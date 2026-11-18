#!/usr/bin/env sh
# Nightly backup: Postgres dump + uploads, kept 14 days on the server and copied off-site with rclone.
#   crontab -e  →  15 3 * * * /opt/beer-krd/docker/backup.sh >> /var/log/beer-backup.log 2>&1
# Off-site copy: configure an rclone remote named "offsite" (Backblaze B2, Cloudflare R2, …) first.
set -eu
cd "$(dirname "$0")/.."
STAMP=$(date +%Y-%m-%d_%H%M)
DEST=/var/backups/beer-krd
mkdir -p "$DEST"
COMPOSE="docker compose -f docker/compose.yml --env-file .env"

$COMPOSE exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > "$DEST/db_$STAMP.dump"
$COMPOSE run --rm --no-deps -v "$DEST:/backup" --entrypoint sh admin -c "tar czf /backup/uploads_$STAMP.tar.gz -C /data uploads"

# Retention: local files older than 14 days, off-site copies older than 30 days.
find "$DEST" -type f -name '*_20*' -mtime +14 -delete
if command -v rclone >/dev/null 2>&1; then
  rclone copy "$DEST" offsite:beer-krd-backups --max-age 25h
  rclone delete offsite:beer-krd-backups --min-age 30d
fi
echo "[$STAMP] backup ok"
