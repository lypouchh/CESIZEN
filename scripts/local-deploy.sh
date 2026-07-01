#!/usr/bin/env bash

set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
compose_file="$workspace_root/docker-compose.prod.yml"
migration_file="$workspace_root/backend/artifacts/migration.sql"

if [[ ! -f "$migration_file" ]]; then
  echo "Migration artifact not found: $migration_file"
  exit 1
fi

echo "Stopping current stack"
docker compose -f "$compose_file" down

echo "Starting database only"
docker compose -f "$compose_file" up -d mysql

echo "Waiting for MySQL to become ready"
for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if docker compose -f "$compose_file" exec -T mysql mysqladmin ping -h localhost --silent; then
    break
  fi

  if [[ "$attempt" -eq 10 ]]; then
    echo "MySQL is not ready after waiting."
    exit 1
  fi

  sleep 3
done

echo "Applying database migrations from $migration_file"
docker compose -f "$compose_file" exec -T mysql sh -lc \
  "mysql -u\"${DB_USERNAME:-cesizen_user}\" -p\"${DB_PASSWORD:-password}\" \"${DB_DATABASE:-cesizen}\"" \
  < "$migration_file"

echo "Pulling the latest backend and web images"
docker compose -f "$compose_file" pull laravel nginx

echo "Starting the stack"
docker compose -f "$compose_file" up -d laravel nginx

echo "Deployment completed"