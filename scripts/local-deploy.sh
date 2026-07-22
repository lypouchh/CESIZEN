#!/usr/bin/env bash
#
# Déploiement local paramétré par environnement (dev, test, prod).
# Les 3 environnements tournent en parallèle sur la même machine, isolés par
# nom de projet Compose, ports hôte et volume MySQL (voir README).

set -euo pipefail

usage() {
  echo "Usage: $0 --env dev|test|prod" >&2
  exit 1
}

env_name=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)
      env_name="${2:-}"
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

case "$env_name" in
  dev|test|prod) ;;
  *) usage ;;
esac

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# PROD garde son déploiement blue/green (bascule sans coupure) : le socle
# (mysql, frontend) et l'API blue/green sont orchestrés par ce script dédié.
if [[ "$env_name" == "prod" ]]; then
  echo "[prod] Délégation au déploiement blue/green"
  exec bash "$workspace_root/scripts/bluegreen-deploy.sh"
fi

compose_file="$workspace_root/docker-compose.$env_name.yml"
env_file="$workspace_root/.env.$env_name"
project_name="cesizen-$env_name"

if [[ ! -f "$env_file" ]]; then
  echo "Fichier d'environnement introuvable: $env_file"
  exit 1
fi

compose=(docker compose --env-file "$env_file" -f "$compose_file" -p "$project_name")

echo "[$env_name] Stopping the $project_name stack only (les autres environnements ne sont pas affectés)"
"${compose[@]}" down

echo "[$env_name] Starting database only"
"${compose[@]}" up -d mysql

# La CD exporte IMAGE_TAG (ex. dev-<sha>) avant d'appeler ce script : il doit
# gagner sur la valeur statique du fichier .env.<env>, sinon on redéploierait
# un tag (ex. "develop") qui n'a jamais été poussé sur le registre.
image_tag_override="${IMAGE_TAG:-}"

# shellcheck disable=SC1090
source "$env_file"

if [[ -n "$image_tag_override" ]]; then
  IMAGE_TAG="$image_tag_override"
fi
export IMAGE_TAG

echo "[$env_name] Waiting for MySQL to become ready"
# L'image mysql:8.0 démarre un serveur temporaire le temps de son
# initialisation (création base/utilisateur) puis bascule vers le serveur
# définitif : un simple "mysqladmin ping" répond déjà pendant cette fenêtre
# temporaire, avant que l'utilisateur applicatif n'existe vraiment. On
# attend donc une connexion authentifiée réelle, pas un ping générique.
for attempt in $(seq 1 20); do
  if "${compose[@]}" exec -T mysql sh -lc \
    "mysql -u\"${DB_USERNAME:-cesizen_user}\" -p\"${DB_PASSWORD}\" \"${DB_DATABASE}\" -e 'SELECT 1;'" >/dev/null 2>&1; then
    break
  fi

  if [[ "$attempt" -eq 20 ]]; then
    echo "MySQL is not ready after waiting (le serveur définitif n'a pas pris le relais du serveur temporaire à temps)."
    exit 1
  fi

  sleep 3
done

echo "[$env_name] Pulling images tagged for this branch"
"${compose[@]}" pull || echo "[$env_name] Certains services sont construits localement (pas d'image à tirer), c'est attendu pour dev."

# L'artefact SQL généré par la CI (backend/artifacts/migration.sql) est un
# "--pretend" produit contre une base SQLite éphémère : utile pour la revue,
# mais dans un dialecte différent de MySQL et donc impossible à rejouer tel
# quel. On applique les migrations avec le driver réel de l'environnement
# cible, via l'image qui vient d'être tirée, avant de basculer le trafic.
echo "[$env_name] Applying database migrations (php artisan migrate --force)"
"${compose[@]}" run --rm --no-deps laravel php artisan migrate --force

echo "[$env_name] Starting the $project_name stack"
"${compose[@]}" up -d --build

echo "[$env_name] Deployment completed"
