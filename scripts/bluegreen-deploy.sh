#!/usr/bin/env bash

set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
compose_base="${COMPOSE_BASE_FILE:-$workspace_root/docker-compose.prod.yml}"
compose_bluegreen="$workspace_root/docker-compose.bluegreen.yml"
migration_file="${MIGRATION_FILE:-$workspace_root/backend/artifacts/migration.sql}"
active_file="$workspace_root/backend/docker/nginx/bluegreen/includes/active-upstream.conf"
proxy_url="${BLUEGREEN_PROXY_URL:-http://localhost:8080}"
db_name="${DB_DATABASE:-cesizen}"
db_user="${DB_USERNAME:-cesizen_user}"
db_password="${DB_PASSWORD:-password}"

if [[ ! -f "$migration_file" ]]; then
  echo "Migration artifact not found: $migration_file"
  exit 1
fi

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
  docker compose -f "$compose_base" -f "$compose_bluegreen" exec -T proxy nginx -s reload >/dev/null 2>&1 || true
}

trap restore_previous_upstream ERR

echo "Starting MySQL and the proxy"
docker compose -f "$compose_base" -f "$compose_bluegreen" up -d mysql proxy

echo "Starting target service $target_service"
docker compose -f "$compose_base" -f "$compose_bluegreen" up -d --no-deps --pull always "$target_service"

echo "Waiting for $target_service to answer on /health"
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if docker compose -f "$compose_base" -f "$compose_bluegreen" exec -T "$target_service" curl -fsS http://127.0.0.1:8000/health >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq 12 ]]; then
    echo "$target_service did not become healthy in time"
    exit 1
  fi

  sleep 3
done

echo "Applying expand/contract migrations from $migration_file"
docker compose -f "$compose_base" -f "$compose_bluegreen" exec -T mysql sh -lc \
  "mysql -u\"$db_user\" -p\"$db_password\" \"$db_name\"" \
  < "$migration_file"

echo "Promoting $target_service in the proxy"
printf 'set $active_upstream http://%s:8000;\n' "$target_service" > "$active_file"
docker compose -f "$compose_base" -f "$compose_bluegreen" exec -T proxy nginx -s reload

echo "Verifying the proxy now serves $target_service"
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
  echo "Stopping old service $active_service"
  docker compose -f "$compose_base" -f "$compose_bluegreen" stop "$active_service"
fi

trap - ERR
echo "Blue/green deployment completed successfully"