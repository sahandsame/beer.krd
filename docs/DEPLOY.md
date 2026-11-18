# Deploying beer.krd to the VPS

Everything runs on one server with Docker: **Caddy** (automatic HTTPS) → **web** + **admin** → **Postgres**. Uploads are kept in a Docker volume that both apps share.

```
Internet ──► Caddy :443 ──► beer.krd        → web:3000   (reads uploads)
                        └─► admin.beer.krd  → admin:3100 (writes uploads)
                                              postgres:5432 (internal only)
```

## 1. One-time server setup

The server needs Ubuntu 22.04 or 24.04, at least 2 vCPU and 4 GB RAM.

```bash
curl -fsSL https://get.docker.com | sh
```

```bash
sudo usermod -aG docker $USER
```

Log out and back in so the group change takes effect. Then set up the firewall:

```bash
sudo ufw allow OpenSSH && sudo ufw allow 80,443/tcp && sudo ufw allow 443/udp && sudo ufw enable
```

Clone the repo into `/opt/beer-krd`:

```bash
sudo git clone https://github.com/OWNER/beer-krd.git /opt/beer-krd && sudo chown -R $USER /opt/beer-krd
```

Create the production env file:

```bash
cd /opt/beer-krd && cp docker/.env.production.example .env && chmod 600 .env
```

Fill in `.env`. Generate each secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

If Node isn't installed on the server, use `openssl rand -base64 32`.

Also recommended: SSH key login only (`PasswordAuthentication no`), `fail2ban`, and `unattended-upgrades`.

## 2. DNS

At the registrar or DNS provider for `beer.krd`:

| Type | Name         | Value                   |
| ---- | ------------ | ----------------------- |
| A    | `beer.krd`   | VPS IPv4                |
| A    | `www`        | VPS IPv4                |
| A    | `admin`      | VPS IPv4                |
| AAAA | (same three) | VPS IPv6, if it has one |

Caddy requests the certificates once DNS points at the server.

## 3. GitHub

1. Push the repo to GitHub. CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit and integration tests, a build, and Playwright.
2. Add these repository secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (a deploy key whose public half is in the server's `~/.ssh/authorized_keys`), and optionally `VPS_PORT`.
3. Create an environment called `production`. You can require approval before each deploy.
4. On every green CI run on `main`, **Deploy** builds `beer-krd-web`, `beer-krd-admin` and `beer-krd-tools`, pushes them to GHCR, then runs `docker/deploy.sh` on the server.
5. If the GHCR packages are private, log the server in once:

```bash
echo <PAT with read:packages> | docker login ghcr.io -u <github-user> --password-stdin
```

## 4. First start

```bash
cd /opt/beer-krd && docker compose -f docker/compose.yml --env-file .env up -d
```

`migrate` runs first. It applies database migrations, adds the default content, and creates the owner from `SEED_OWNER_*` if no users exist yet. Then `web`, `admin` and `caddy` start. After the first sign-in, change the owner password under **Your account**, and you can clear `SEED_OWNER_PASSWORD` from `.env`.

Check that everything is running:

```bash
docker compose -f docker/compose.yml --env-file .env ps
```

```bash
curl -I https://beer.krd/ckb
```

## 5. Backups

Install rclone and configure a remote named `offsite` (Backblaze B2, Cloudflare R2, or similar):

```bash
sudo apt install rclone && rclone config
```

Make the backup script executable:

```bash
chmod +x docker/backup.sh docker/deploy.sh
```

Then run `crontab -e` and add this line:

```
15 3 * * * /opt/beer-krd/docker/backup.sh >> /var/log/beer-backup.log 2>&1
```

To restore, first stop the apps:

```bash
docker compose -f docker/compose.yml --env-file .env stop web admin
```

Restore the database:

```bash
docker compose -f docker/compose.yml --env-file .env exec -T postgres pg_restore -U beer -d beer --clean --if-exists < /var/backups/beer-krd/db_YYYY-MM-DD_HHMM.dump
```

Restore the uploads:

```bash
docker compose -f docker/compose.yml --env-file .env run --rm --no-deps -v /var/backups/beer-krd:/backup --entrypoint sh admin -c "tar xzf /backup/uploads_YYYY-MM-DD_HHMM.tar.gz -C /data"
```

Start everything again:

```bash
docker compose -f docker/compose.yml --env-file .env up -d
```

Test a restore once after launch.

## 6. After launch

- Admin → Settings: add the Instagram URL and the Discord webhook, then press **Send test**.
- Admin → Users: invite the team.
- Optional: run Umami on the same server for privacy-friendly analytics, then set `NEXT_PUBLIC_UMAMI_SRC` and `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
