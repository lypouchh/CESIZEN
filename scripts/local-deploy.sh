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
migration_file="$workspace_root/backend/artifacts/migration.sql"

if [[ ! -f "$env_file" ]]; then
  echo "Fichier d'environnement introuvable: $env_file"
  exit 1
fi

if [[ ! -f "$migration_file" ]]; then
  echo "Migration artifact not found: $migration_file"
  exit 1
fi

compose=(docker compose --env-file "$env_file" -f "$compose_file" -p "$project_name")

echo "[$env_name] Stopping the $project_name stack only (les autres environnements ne sont pas affectés)"
"${compose[@]}" down

echo "[$env_name] Starting database only"
"${compose[@]}" up -d mysql

echo "[$env_name] Waiting for MySQL to become ready"
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if "${compose[@]}" exec -T mysql mysqladmin ping -h localhost --silent; then
    break
  fi

  if [[ "$attempt" -eq 10 ]]; then
    echo "MySQL is not ready after waiting."
    exit 1
  fi

  sleep 3
done

# shellcheck disable=SC1090
source "$env_file"

echo "[$env_name] Applying database migrations from $migration_file"
"${compose[@]}" exec -T mysql sh -lc \
  "mysql -u\"${DB_USERNAME:-cesizen_user}\" -p\"${DB_PASSWORD}\" \"${DB_DATABASE}\"" \
  < "$migration_file"

echo "[$env_name] Pulling images tagged for this branch"
"${compose[@]}" pull || echo "[$env_name] Certains services sont construits localement (pas d'image à tirer), c'est attendu pour dev."

echo "[$env_name] Starting the $project_name stack"
"${compose[@]}" up -d --build

echo "[$env_name] Deployment completed"
