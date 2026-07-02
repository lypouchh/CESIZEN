#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-file.sql.gz|backup-file.sql>"
  exit 1
fi

backup_file="$1"
if [[ ! -f "$backup_file" ]]; then
  echo "Backup file not found: $backup_file"
  exit 1
fi

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
compose_file="${COMPOSE_FILE:-$workspace_root/docker-compose.prod.yml}"
db_name="${DB_DATABASE:-cesizen}"
db_user="${DB_USERNAME:-cesizen_user}"
db_password="${DB_PASSWORD:-password}"

echo "Restoring database $db_name from $backup_file"

if [[ "$backup_file" == *.gz ]]; then
  gzip -dc "$backup_file" | docker compose -f "$compose_file" exec -T mysql sh -lc \
    "mysql -u\"$db_user\" -p\"$db_password\" \"$db_name\""
else
  docker compose -f "$compose_file" exec -T mysql sh -lc \
    "mysql -u\"$db_user\" -p\"$db_password\" \"$db_name\"" < "$backup_file"
fi

echo "Restore completed"