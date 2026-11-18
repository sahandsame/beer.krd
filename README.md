# beer.krd

Website and admin for **Beer Agency** (ئاژانسی بیر), a marketing and software agency in Erbil.
_بۆ ئەوانەی بە قووڵی بیر دەکەنەوە — For those who think deeply._

| App          | URL            | What it is                                                                                  |
| ------------ | -------------- | ------------------------------------------------------------------------------------------- |
| `apps/web`   | beer.krd       | Public site in Kurdish (default), English and Arabic. Kurdish and Arabic are right-to-left. |
| `apps/admin` | admin.beer.krd | Staff-only admin: leads inbox, services, portfolio, page text, team, media, settings, users |

## Repository layout

```
apps/web          Next.js public site (next-intl: /ckb /en /ar)
apps/admin        Next.js admin (English UI, content edited in all 3 languages)
packages/db       Drizzle schema, migrations, seed + default copy, public queries
packages/auth     Better Auth (email + password, invite-only, roles owner/admin/editor)
packages/ui       Brand tokens (Tailwind v4), B mark / barcode / wordmark, form components
packages/i18n     Locales, RTL helpers, UI dictionaries (messages/*.json)
packages/validators  Zod schemas shared by forms and server actions
packages/storage  Image uploads (validated, resized, re-encoded as WebP), path-safe file serving
packages/notify   Discord webhook lead alerts
tests/e2e         Playwright tests (production builds against a throwaway database)
docker/           Dockerfile, compose stack, Caddyfile, deploy + backup scripts
brand/            Logo: original PNG, plus SVG redraws (logo.svg, mark.svg, favicon.svg)
```

## Local development

Requirements: Node 22+ (24 recommended) and pnpm 12 (`corepack enable`). No Docker needed.

```bash
pnpm install
```

```bash
cp .env.example .env
```

Fill in `.env`: set `BETTER_AUTH_SECRET`, `REVALIDATE_SECRET` and the `SEED_OWNER_*` values.

In one terminal, start the local Postgres. This uses real Postgres binaries installed through npm, listens on port 5433 and stores data in `.data/pg`:

```bash
pnpm db:dev
```

In another terminal:

```bash
pnpm db:migrate
```

```bash
pnpm db:seed
```

```bash
pnpm dev
```

- Public site: http://localhost:3000
- Admin: http://localhost:3100 (sign in with the `SEED_OWNER_*` account)

## Tests

```bash
pnpm test
```

Runs unit tests, plus database and auth integration tests against a temporary embedded Postgres.

```bash
pnpm test:e2e
```

Builds both apps and runs Playwright in Chromium (desktop and phone).

```bash
pnpm lint
```

```bash
pnpm typecheck
```

## Content model

- **Translated text** is stored as `{ ckb, en, ar }`. If a translation is missing, the public site falls back to Kurdish. The admin dashboard lists anything that is missing a translation.
- **Page text** such as the home hero, process steps, stats and the About story lives in "content blocks". Their fields are defined in `packages/db/src/content.ts`, and the default copy is in `packages/db/src/seed-data.ts`.
- **Caching:** the public site caches database reads. Every save in the admin calls `POST /api/revalidate` on the web app with the affected tags, so changes appear immediately.
- **Portfolio** is hidden at launch. Turn it on in Admin → Settings → "Show the Work / portfolio section".

## Roles

|                                                       | Editor | Admin | Owner |
| ----------------------------------------------------- | :----: | :---: | :---: |
| Leads, services, portfolio, page text, team, media    |   ✓    |   ✓   |   ✓   |
| Delete services, projects, leads; settings; audit log |        |   ✓   |   ✓   |
| Invite users, change roles, deactivate users          |        |       |   ✓   |

Public sign-up is disabled. The owner invites staff from **Users**, which creates a single-use link that is valid for 7 days.

## Deployment

See [docs/DEPLOY.md](docs/DEPLOY.md).
