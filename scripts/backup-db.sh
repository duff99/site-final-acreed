#!/usr/bin/env bash
# Daily backup of the SQLite database used by the api container.
# Uses sqlite3 .backup (online, consistent) rather than a raw file copy so it
# is safe even while the api is writing.
#
# Install via cron (root):
#   0 3 * * * /srv/prod/sites/site-final-acreed/scripts/backup-db.sh >> /var/log/acreed-backup.log 2>&1
#
# Restore: stop api, copy chosen backup to the volume, start api.
#   docker compose stop api
#   docker run --rm -v site-final-acreed_db-data:/data -v /srv/backups/acreed:/b alpine \
#     sh -c 'cp /b/acreed-YYYYMMDD-HHMMSS.db /data/acreed.db'
#   docker compose start api

set -euo pipefail

CONTAINER="${ACREED_API_CONTAINER:-site-final-acreed-api-1}"
BACKUP_DIR="${ACREED_BACKUP_DIR:-/srv/backups/acreed}"
RETENTION_DAYS="${ACREED_BACKUP_RETENTION:-30}"

mkdir -p "$BACKUP_DIR"

stamp="$(date -u +%Y%m%d-%H%M%S)"
target="$BACKUP_DIR/acreed-$stamp.db"

# Run sqlite3 .backup inside the container so it sees the live db file.
# sqlite3 is not in the alpine image — install it on the fly into a temp
# location to avoid mutating the running container's package db.
if ! docker exec "$CONTAINER" which sqlite3 >/dev/null 2>&1; then
  docker exec "$CONTAINER" apk add --no-cache sqlite >/dev/null
fi

docker exec "$CONTAINER" sqlite3 /app/data/acreed.db ".backup '/app/data/.backup-tmp.db'"
docker cp "$CONTAINER:/app/data/.backup-tmp.db" "$target"
docker exec "$CONTAINER" rm -f /app/data/.backup-tmp.db

gzip -f "$target"
echo "[$(date -Is)] backup ok: $target.gz ($(du -h "$target.gz" | cut -f1))"

# Prune old backups
find "$BACKUP_DIR" -name 'acreed-*.db.gz' -mtime "+$RETENTION_DAYS" -delete
