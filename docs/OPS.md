# Acreed Consulting — Ops runbook

Living reference for relaunching, backing up, restoring and observing the
production stack on the `acreed-prod` Docker network.

## Stack layout

- VM: hosts containers `site-final-acreed-api-1` (Express :3001) and
  `site-final-acreed-frontend-1` (nginx :80 → host :8888).
- Reverse proxy: host nginx terminates TLS for `site.acreedconsulting.com` and
  forwards to the frontend container.
- DB: SQLite, persisted in the named Docker volume `site-final-acreed_db-data`,
  mounted at `/app/data` inside the api container.

## Daily ops

### Start / stop / rebuild

```bash
cd /srv/prod/sites/site-final-acreed

# Tail logs
docker compose logs -f api
docker compose logs -f frontend

# Restart a service after a code change (no rebuild)
docker compose restart api

# Rebuild after a code change
docker compose up -d --build api

# Full stack restart
docker compose down && docker compose up -d --build
```

### Health

The api container exposes a docker `HEALTHCHECK` hitting `/api/health` every
30s. Quick check:

```bash
docker inspect --format='{{.State.Health.Status}}' site-final-acreed-api-1
curl -fsS https://site.acreedconsulting.com/api/health
```

If `unhealthy`, inspect the last probes:

```bash
docker inspect site-final-acreed-api-1 --format='{{json .State.Health}}' | jq
```

## Backups

Online SQLite backups via `scripts/backup-db.sh`. The script uses
`sqlite3 .backup` inside the running container so it stays consistent under
concurrent writes.

### Install the cron (one-time, as root)

```bash
crontab -e
# Add:
0 3 * * * /srv/prod/sites/site-final-acreed/scripts/backup-db.sh >> /var/log/acreed-backup.log 2>&1
```

Backups land in `/srv/backups/acreed/acreed-YYYYMMDD-HHMMSS.db.gz`. Retention
is 30 days by default (`ACREED_BACKUP_RETENTION` env var to override).

### Restore a backup

```bash
cd /srv/prod/sites/site-final-acreed
docker compose stop api

# Pick a backup, decompress to a temp dir
gunzip -k /srv/backups/acreed/acreed-20260429-030000.db.gz

# Copy into the volume via a throwaway alpine
docker run --rm \
  -v site-final-acreed_db-data:/data \
  -v /srv/backups/acreed:/b \
  alpine sh -c 'cp /b/acreed-20260429-030000.db /data/acreed.db'

docker compose start api
docker compose logs -f api  # verify boot
```

## Environment variables

Production `.env` lives at `/srv/prod/sites/site-final-acreed/.env` and is
consumed by `docker-compose.yml`. See the table in `CLAUDE.md` for the full
list. SMTP vars are optional — if absent the email notifier silently logs
and skips, contact + application submissions still land in the DB.

## Recovery after VM reboot

The compose services use `restart: unless-stopped`, so they come back
automatically if Docker is enabled at boot:

```bash
sudo systemctl is-enabled docker  # should print "enabled"
```

If containers are down after a reboot:

```bash
cd /srv/prod/sites/site-final-acreed
docker compose up -d
```

The `acreed-prod` network is `external: true` in compose, so it must exist
before `up`. If it doesn't:

```bash
docker network create acreed-prod
```

## Known debt

- **UFW dette Session A** : ports `0.0.0.0:3001` et `0.0.0.0:8888` exposés sur
  toutes les interfaces. Devraient être bind sur `127.0.0.1` puisque seule la
  nginx host les consomme. Migrer en éditant `docker-compose.yml`
  (`"127.0.0.1:3001:3001"`, `"127.0.0.1:8888:80"`) — vérifier que la nginx
  host pointe bien sur 127.0.0.1 d'abord.
- **Volume nommé vs bind mount** : la DB est dans un volume Docker, ce qui
  rend les backups un peu plus indirects. Migration vers `./data:/app/data`
  possible mais demande un downtime + une copie de volume → planifier.
- **Logs non structurés** : `console.log/error` côté api. À migrer vers pino
  ou winston JSON pour faciliter une éventuelle ingestion future.
- **Pas de monitoring d'erreurs** (Sentry/équivalent) front + back.
