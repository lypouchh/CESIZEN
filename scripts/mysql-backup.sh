#!/usr/bin/env bash

set -euo pipefail

workspace_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
compose_file="${COMPOSE_FILE:-$workspace_root/docker-compose.prod.yml}"
backup_dir="${BACKUP_DIR:-$workspace_root/backups/mysql}"
db_name="${DB_DATABASE:-cesizen}"
db_user="${DB_USERNAME:-cesizen_user}"
db_password="${DB_PASSWORD:-password}"
timestamp=$(date +%Y%m%d_%H%M%S)
backup_file="$backup_dir/${db_name}_${timestamp}.sql.gz"

mkdir -p "$backup_dir"

echo "Creating backup at $backup_file"
docker compose -f "$compose_file" exec -T mysql sh -lc \
  "mysqldump -u\"$db_user\" -p\"$db_password\" --single-transaction --quick --lock-tables=false \"$db_name\"" \
  | gzip -9 > "$backup_file"

echo "Backup completed: $backup_file"