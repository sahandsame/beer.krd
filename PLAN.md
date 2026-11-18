# beer.krd — Website Plan

**Client:** Beer Agency (بیر) — marketing & software agency, Erbil, Kurdistan
**Domain:** beer.krd · admin at admin.beer.krd
**Source:** facebook.com/profile.php?id=61573316705238
**Contact on FB:** 0773 418 7963 · Erbil (opening soon)
**Tagline:** بۆ ئەوانەی بە قووڵی بیر دەکەنەوە ("For those who think deeply")

> "Beer" plays on the Kurdish word بیر, which means _thought_ or _mind_. The site copy should lean into that idea: thinking, depth, strategy.

---

## 1. Brand system (taken from the logo)

| Token               | Value     | Use                                              |
| ------------------- | --------- | ------------------------------------------------ |
| `--brand-green-900` | `#06332E` | Primary background (deep green)                  |
| `--brand-ink`       | `#081D18` | Long shadow, dark barcode bars, deepest surfaces |
| `--brand-lime`      | `#C6DB62` | The "B" mark, "Beer" word, CTAs, highlights      |
| `--brand-white`     | `#FAFFFE` | "Agency" word, body text on dark                 |

The site is dark-first. Lime is for accents only, not large blocks of text. The page itself stays deep green.

**Visual motifs to reuse**

- **The italic "B"**: a straight diagonal left edge with rounded bowls on the right. Use it as the hero mark, favicon and loader.
- **Long diagonal shadow**: a soft dark shadow cast down and to the right. Use it on cards and section headers.
- **Barcode**: lime bars turning into black, then white. Use it as section dividers, a progress bar, the hover underline, and the footer.
- **Monospace, wide-tracked wordmark**: "B e e r A g e n c y". Use it for labels, eyebrows and nav items in Latin script.

**Typography** (glyph coverage must be checked for Sorani ڕ ڵ ۆ ێ ە ڤ)

- Kurdish/Arabic: candidates are _Vazirmatn_, _Noto Kufi Arabic_ and _Rabar_. Pick one after testing real Sorani copy.
- Latin headings: a geometric sans such as _Space Grotesk_ or _Manrope_.
- Latin labels: a monospace font such as _JetBrains Mono_ or _IBM Plex Mono_, to match the wordmark.

**Assets:** there is no vector logo, only the 1080×1080 PNG at [brand/logo-reference.png](brand/logo-reference.png). In Phase 1 the B mark, the barcode and the wordmark get redrawn as SVG in `packages/ui/brand/`, in full, mark-only and favicon versions.

---

## 2. Architecture: Turborepo monorepo

```
beer.krd/
├─ apps/
│  ├─ web/          Next.js (App Router): public site, beer.krd, ckb/en/ar
│  └─ admin/        Next.js: admin.beer.krd, staff-only, hosts sign-in
├─ packages/
│  ├─ db/           Drizzle ORM schema, migrations, seed (Postgres)
│  ├─ auth/         Better Auth config: email+password, roles, invite-only
│  ├─ ui/           Shared components (shadcn/ui + Tailwind), brand tokens, RTL-safe
│  ├─ i18n/         Locale config, shared dictionaries, localized-field helpers
│  ├─ validators/   Zod schemas shared by forms, server actions and the API
│  ├─ storage/      Image uploads → WebP on a shared Docker volume, served by web at /media
│  ├─ notify/       Discord webhook lead alerts
│  └─ config/       Shared tsconfig
├─ tests/e2e/       Playwright end-to-end tests
├─ docker/          Dockerfile, compose, Caddyfile, deploy + backup scripts
└─ .github/workflows/  CI (lint, typecheck, tests, build, e2e) + deploy
```

**Stack:** pnpm · Turborepo · TypeScript · Next.js 16 · Tailwind v4 · Drizzle · PostgreSQL 18 · Better Auth · Zod · next-intl · Biome · Vitest · Playwright · Docker · Caddy

> **Change during the build (2026-11-18):** I dropped MinIO. Uploads now live on a Docker volume that the admin writes and the web app serves, which is one less service to run and back up. Swapping to S3 or R2 later only touches `packages/storage`. The admin dev server runs on port **3100**.

**Auth:** auth is a shared package rather than a separate app. Only staff sign in, so `admin.beer.krd/login` is enough.

- Roles: `owner` (manages users), `admin` (everything), `editor` (content only, no user management)
- No public sign-up. The owner invites staff by email.
- Session cookies scoped to `admin.beer.krd`. Rate-limited login. Optional 2FA (TOTP), included in Better Auth.

**Content flow:** admin saves → Postgres → admin calls a secret revalidation endpoint on `web` → affected pages regenerate. Public pages are statically generated with ISR, so they stay fast and the database is off the hot path.

---

## 3. Internationalization (ckb · en · ar)

- Routes: `/` → `/ckb` (default), `/en`, `/ar`. Uses next-intl middleware with `Accept-Language` detection and a cookie to remember the choice.
- `ckb` and `ar` are right-to-left (`dir="rtl"`) and `en` is left-to-right. All layout uses logical CSS properties (`ms-`, `pe-`, `start-`). The "B" shadow and diagonal motifs are mirrored in RTL where it makes sense.
- Fixed UI strings live in JSON dictionaries in `packages/i18n`. Database content uses localized JSONB fields: `{ ckb, en, ar }`.
- Admin forms show a ckb / en / ar tab on every translatable field, with a "missing translation" badge. If a translation is missing, the public site falls back to ckb.
- SEO: `hreflang` alternates, per-locale sitemap, localized OG images generated with the brand (dark green + lime B).

---

## 4. Public site (apps/web)

| Page                                          | Content                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**                                      | Hero with the animated B mark and tagline · services grid · featured work · "how we think" process (Discover → Strategy → Create → Grow) · stats/clients strip · CTA to contact                                                                                                                          |
| **Services** `/services` + `/services/[slug]` | 1. Websites, systems & software development · 2. Social media management · 3. Branding & design · 4. Paid ads (Meta / Google / TikTok) · 5. Photo & video production                                                                                                                                     |
| **Work** `/work` + `/work/[slug]`             | Portfolio grid filterable by service. Case study: challenge, approach, results, gallery/video. **Hidden at launch:** it's left out of the nav, the home page and the sitemap, and the routes return 404 until an admin turns on the `work_section_enabled` setting                                       |
| **About** `/about`                            | Story and the meaning of بیر, values, team                                                                                                                                                                                                                                                               |
| **Contact** `/contact`                        | Lead form (name, phone, email, service, budget range, message) · click-to-call +964 773 418 7963 · WhatsApp and Viber links · Instagram and Facebook links · location shown as **"Erbil, Kurdistan" only**, with no map until the office opens (the address and map can be turned on later in the admin) |
| Legal                                         | Privacy policy                                                                                                                                                                                                                                                                                           |

Also: 404 page in brand style, `robots.txt`, `sitemap.xml`, JSON-LD (`Organization`, `LocalBusiness`), and an analytics script (self-hosted Umami).

---

## 5. Admin (apps/admin)

The admin interface is **English only**. Content is still entered in ckb, en and ar through tabs on each field.

- **Dashboard:** new leads count, recent leads, content that's missing translations
- **Leads inbox:** list, filters and search. Status: `new → contacted → proposal → won / lost`. Internal notes, assignee, CSV export. Each new lead posts a **Discord** message to a staff channel through a webhook: an embed with name, phone, service, message, locale and a link to the lead in the admin. The webhook URL is stored in settings, and the admin has a "Send test" button.
- **Portfolio:** CRUD for projects. Fields: localized title, summary and body; client; services (multi); cover; gallery (images and video URLs); featured; published; sort order.
- **Services:** CRUD with localized name, description, deliverables, icon and order
- **Page content:** structured editors for Home hero, process steps, stats, About text, contact details and social links. These are typed blocks, not a free page builder.
- **Team:** members with photo, localized name/role, order
- **Media library:** uploads to the shared uploads volume, automatic resize/WebP, alt text per locale
- **Users:** invite, set role, deactivate (owner only)
- **Audit log:** who changed what

---

## 6. Data model (packages/db)

```
user, session, account, verification, invitation   ← Better Auth tables (+ role)
service       id, slug, icon, sort, published, name{}, summary{}, body{}, deliverables{}
project       id, slug, client, cover_media_id, featured, published, sort,
              title{}, summary{}, body{}, results{}, year
project_service   project_id, service_id
project_media     project_id, media_id, sort
media         id, key, mime, width, height, alt{}, created_by
team_member   id, photo_media_id, sort, name{}, role{}
content_block key (e.g. home.hero), data jsonb (per-locale), updated_by
setting       key, value (phone, socials, address, notification targets)
lead          id, name, phone, email, service_id, budget, message, locale,
              source_page, status, assignee_id, created_at
lead_note     id, lead_id, author_id, body, created_at
audit_log     id, user_id, action, entity, entity_id, diff, created_at
```
`{}` = localized JSONB `{ ckb, en, ar }`

---

## 7. Infrastructure (VPS + Docker)

- **VPS:** the client's existing server and existing GitHub org/repo. Needs at least 2 vCPU and 4 GB RAM, Docker and Docker Compose.
- **docker compose services:** `caddy` (reverse proxy + automatic HTTPS) · `web` · `admin` · `postgres` · `migrate` (runs once per deploy) · `umami` (optional)
- **DNS:** `beer.krd` and `www` → VPS (A/AAAA records). `admin.beer.krd` → VPS. Uploads are served at `beer.krd/media/…`.
- **CI/CD:** GitHub Actions runs lint, typecheck and build, then pushes images to GHCR, then deploys over SSH with `docker compose pull && up -d` and runs migrations as a separate step
- **Backups:** nightly `pg_dump` and an uploads archive to off-site storage (Backblaze B2 or R2), with 14-day retention. Do a test restore once.
- **Hardening:** SSH keys only, ufw (80/443/22), fail2ban, automatic security updates, Postgres not exposed publicly
- **Environments:** `local` (embedded Postgres via `pnpm db:dev`, no Docker needed) and `production`. Staging is optional later, e.g. `staging.beer.krd`.

---

## 8. Milestones

| #   | Phase                    | Deliverable                                                                                             |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| 0   | **Brand & content prep** | SVG redraw of the logo, font chosen, Claude drafts all copy in ckb/en/ar for the team to review, photos |
| 1   | **Scaffold**             | Turborepo, shared config, `ui` package with brand tokens, Docker compose for local dev, CI              |
| 2   | **Data & auth**          | Drizzle schema + migrations + seed, Better Auth with roles, invite flow, admin login                    |
| 3   | **Public site**          | All pages in 3 locales with RTL, seeded content, contact form saving leads, SEO                         |
| 4   | **Admin**                | Leads inbox, portfolio, services, content blocks, team, media, users, revalidation                      |
| 5   | **Launch**               | VPS provisioning, DNS, HTTPS, backups, analytics, Lighthouse/a11y pass, go live                         |
| 6   | **After launch**         | Blog/insights (deferred), client portal (deferred), staging environment                                 |

---

## 9. Decisions (answered 2026-11-18)

| Topic             | Decision                                                          |
| ----------------- | ----------------------------------------------------------------- |
| Logo              | No vector exists. Claude redraws it as SVG from the PNG.          |
| Admin UI language | English only                                                      |
| Copywriting       | Claude drafts ckb/en/ar, the team reviews and edits in the admin  |
| Portfolio         | Hidden at launch, turned on from the admin later                  |
| Lead alerts       | Discord (webhook to a staff channel)                              |
| Socials           | Instagram, Facebook, WhatsApp, Viber (no TikTok/LinkedIn for now) |
| Infrastructure    | VPS and GitHub are already available                              |
| Location          | "Erbil, Kurdistan", city only, no map                             |

## 10. Still needed (small inputs, not blockers)

- **Instagram handle.**
- **WhatsApp/Viber number:** this plan assumes +964 773 418 7963, the number on Facebook. Confirm or give a different one.
- **Discord webhook URL** for the leads channel. It goes into `.env` or admin settings, never into git.
- **VPS details:** OS, whether Docker is installed, SSH access for deploys. Also the **GitHub repo** name.
- **beer.krd DNS:** who manages it, and A records to point at the VPS IP when it's time to launch.
- **Owner account email** for the first admin user, which gets seeded.
