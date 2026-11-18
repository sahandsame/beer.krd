# Deploying beer.krd with Coolify

Coolify builds the images straight from GitHub, routes the domains and handles HTTPS. Postgres runs as a separate Coolify database so you get scheduled backups.

```
GitHub (main) ──push──► Coolify builds docker-compose.coolify.yml
                         ├─ migrate  (runs once per deploy, then exits)
                         ├─ web      :3000  ◄── https://beer.krd, https://www.beer.krd
                         └─ admin    :3100  ◄── https://admin.beer.krd
                              │  shared "uploads" volume
                              ▼
                         beer-db (Coolify PostgreSQL resource, scheduled S3 backups)
```

> These steps follow Coolify v4. Button names can differ a little between versions.

## 1. DNS

At the DNS provider for `beer.krd`, add A records for **`beer.krd`**, **`www`** and **`admin`**, all pointing to the Coolify server's IP. Add matching AAAA records if the server has IPv6.

## 2. Connect GitHub

In Coolify, go to **Sources → + Add → GitHub App** and install it on the `sahandsame/beer.krd` repository. This also turns on automatic deploys when you push to `main`.

## 3. Project

Go to **Projects → + Add**, create a project called "Beer Agency", and use its `production` environment.

## 4. Database

1. In the project, click **+ New → Database → PostgreSQL** (version 17 or 18).
2. Name it `beer-db`. Set the username to `beer`, the database to `beer`, and keep the generated password.
3. Click **Start**, then copy the **Postgres URL (internal)**. It looks like `postgres://beer:…@<container-name>:5432/beer`.
4. Open the **Backups** tab and add a daily scheduled backup to S3-compatible storage such as Backblaze B2 or Cloudflare R2. Add the S3 credentials first under **Settings → S3 Storages**.

## 5. The application

1. In the project, click **+ New → Private Repository (with GitHub App)**, then pick `sahandsame/beer.krd` and branch `main`.
2. Set **Build Pack** to **Docker Compose**.
3. Set **Base Directory** to `/` and **Docker Compose Location** to `/docker-compose.coolify.yml`.
4. Click **Continue**. Coolify lists three services: `migrate`, `web` and `admin`.
5. Under **Advanced**, turn on **Connect To Predefined Network**. Without it, the app can't reach `beer-db`.

## 6. Domains

| Service | Domains                                           |
| ------- | ------------------------------------------------- |
| web     | `https://beer.krd:3000,https://www.beer.krd:3000` |
| admin   | `https://admin.beer.krd:3100`                     |
| migrate | leave empty                                       |

The `:3000` and `:3100` tell Coolify which container port to route to. Visitors don't see them.

## 7. Environment variables

These go under **Environment Variables**. Coolify lists every variable the compose file uses. Never commit the real values.

| Variable                        | Value                                                  |
| ------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                  | internal URL from step 4                               |
| `WEB_URL`                       | `https://beer.krd`                                     |
| `ADMIN_URL`                     | `https://admin.beer.krd`                               |
| `MEDIA_BASE_URL`                | `https://beer.krd/media`                               |
| `BETTER_AUTH_SECRET`            | random, 32+ characters                                 |
| `REVALIDATE_SECRET`             | random, 32+ characters (different from the one above)  |
| `SEED_OWNER_EMAIL`              | the owner's email                                      |
| `SEED_OWNER_PASSWORD`           | a temporary strong password (only used the first time) |
| `SEED_OWNER_NAME`               | the owner's name                                       |
| `DISCORD_WEBHOOK_URL`           | optional; can also be set in Admin → Settings          |
| `UMAMI_SRC`, `UMAMI_WEBSITE_ID` | optional, for self-hosted Umami analytics              |

Generate each secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## 8. Deploy

Click **Deploy** and watch the logs.

1. The first build takes several minutes, because it builds two Next.js apps on the server. If the server has less than 4 GB of RAM, add swap first.
2. `migrate` runs first. It creates the tables, adds the default text in Kurdish, English and Arabic, and creates the owner account.
3. `web` and `admin` start, and Coolify issues the HTTPS certificates.

## 9. Check it

- https://beer.krd should redirect to `/ckb` (or the visitor's language).
- https://admin.beer.krd: sign in with the `SEED_OWNER_*` account.
- **Your account:** change the password. Then remove `SEED_OWNER_PASSWORD` from Coolify.
- **Settings:** add the Instagram URL and the Discord webhook, then press **Send test**.
- **Users:** invite the team.

## Day to day

- **Deploying:** push to `main`. Coolify rebuilds and redeploys, and migrations run on every deploy. They're safe to repeat.
- **Uploaded images** live in the `uploads` volume, which Coolify's database backups don't include. Copy the volume off the server now and then. If uploads grow, switch `packages/storage` to S3 or R2.
- **Rolling back:** in Coolify, open **Deployments** and redeploy an earlier commit.

## Troubleshooting

| Problem                                                | Fix                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `migrate` fails with "connection refused" or ENOTFOUND | Turn on **Connect To Predefined Network**, and check that `DATABASE_URL` is the _internal_ URL. |
| Admin sign-in loops back to the login page             | `ADMIN_URL` must be exactly `https://admin.beer.krd`, and `BETTER_AUTH_SECRET` must be set.     |
| Admin saves don't show up on the site                  | Both apps need the same `REVALIDATE_SECRET`.                                                    |
| Build is killed (exit 137)                             | The server ran out of memory. Add swap or upgrade the server.                                   |
