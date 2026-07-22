#!/usr/bin/env bash

set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
env_file="${COMPOSE_ENV_FILE:-$workspace_root/.env.prod}"
compose_base="${COMPOSE_BASE_FILE:-$workspace_root/docker-compose.prod.yml}"
compose_bluegreen="$workspace_root/docker-compose.bluegreen.yml"
project_name="${COMPOSE_PROJECT_NAME:-cesizen-prod}"
active_file="$workspace_root/backend/docker/nginx/bluegreen/includes/active-upstream.conf"

if [[ ! -f "$env_file" ]]; then
  echo "Fichier d'environnement introuvable: $env_file (copier .env.prod.example et renseigner les secrets)"
  exit 1
fi

# shellcheck disable=SC1090
source "$env_file"

proxy_url="${BLUEGREEN_PROXY_URL:-http://localhost:${NGINX_PORT:-8002}}"
db_name="${DB_DATABASE:-cesizen}"
db_user="${DB_USERNAME:-cesizen_user}"
db_password="${DB_PASSWORD}"

compose=(docker compose --env-file "$env_file" -f "$compose_base" -f "$compose_bluegreen" -p "$project_name")

mkdir -p "$(dirname "$active_file")"
if [[ ! -f "$active_file" ]]; then
  printf 'set $active_upstream http://app-blue:8000;\n' > "$active_file"
fi

active_color=$(grep -oE 'app-(blue|green)' "$active_file" | head -n1 | cut -d- -f2)
if [[ -z "${active_color:-}" ]]; then
  active_color=blue
  printf 'set $active_upstream http://app-blue:8000;\n' > "$active_file"
fi

if [[ "$active_color" == "blue" ]]; then
  target_color=green
else
  target_color=blue
fi

active_service="app-$active_color"
target_service="app-$target_color"
previous_upstream=$(cat "$active_file")

restore_previous_upstream() {
  printf '%s\n' "$previous_upstream" > "$active_file"
  "${compose[@]}" exec -T proxy nginx -s reload >/dev/null 2>&1 || true
}

trap restore_previous_upstream ERR

echo "[prod] Starting MySQL, frontend and the proxy"
"${compose[@]}" up -d --pull always mysql frontend proxy

echo "[prod] Waiting for MySQL to become ready"
# Même précaution que pour dev/test : mysql:8.0 répond déjà à un ping pendant
# l'initialisation de son serveur temporaire, avant que le serveur définitif
# (et l'utilisateur applicatif) ne soit réellement prêt.
for attempt in $(seq 1 20); do
  if "${compose[@]}" exec -T mysql sh -lc \
    "mysql -u\"$db_user\" -p\"$db_password\" \"$db_name\" -e 'SELECT 1;'" >/dev/null 2>&1; then
    break
  fi

  if [[ "$attempt" -eq 20 ]]; then
    echo "MySQL is not ready after waiting."
    exit 1
  fi

  sleep 3
done

echo "[prod] Starting target service $target_service"
"${compose[@]}" up -d --no-deps --pull always "$target_service"

# Les migrations sont appliquées via le conteneur applicatif fraîchement
# démarré (driver MySQL réel), pas en rejouant l'artefact SQL de la CI (qui
# est un --pretend SQLite, dans le mauvais dialecte, voir local-deploy.sh).
# On les applique par exec, avant le health check : le driver de session par
# défaut de Laravel est "database", donc /health échoue tant que la table
# "sessions" n'existe pas — sur un environnement neuf, attendre le health
# check avant de migrer serait un blocage permanent.
echo "[prod] Applying database migrations on $target_service (php artisan migrate --force)"
"${compose[@]}" exec -T "$target_service" php artisan migrate --force

echo "[prod] Waiting for $target_service to answer on /health"
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if "${compose[@]}" exec -T "$target_service" curl -fsS http://127.0.0.1:8000/health >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq 12 ]]; then
    echo "$target_service did not become healthy in time"
    exit 1
  fi

  sleep 3
done

echo "[prod] Promoting $target_service in the proxy"
printf 'set $active_upstream http://%s:8000;\n' "$target_service" > "$active_file"
"${compose[@]}" exec -T proxy nginx -s reload

echo "[prod] Verifying the proxy now serves $target_service"
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "$proxy_url/health" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq 10 ]]; then
    echo "Proxy health check failed after promotion"
    exit 1
  fi

  sleep 2
done

if [[ "${STOP_OLD_COLOR:-true}" == "true" ]]; then
  echo "[prod] Stopping old service $active_service"
  "${compose[@]}" stop "$active_service"
fi

trap - ERR
echo "[prod] Blue/green deployment completed successfully"