# The Word of the Day

> A Word for today. Faith for the journey.

A devotional website, built with Next.js (App Router), TypeScript,
Tailwind CSS v4, and Prisma — plus **Word of the Day Studio**, the
private admin behind it, at `/studio`.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in the values — see below
npm run db:migrate                  # creates prisma/dev.db (local SQLite)
npm run db:seed                     # seeds sample content + your admin account
npm run dev
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/studio`
for the admin (sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you put
in `.env.local`).

```bash
npm run build          # production build
npm run start           # serve the production build
npm run lint             # ESLint
npm run fetch-images   # source devotional photos from Unsplash — see below
npm run db:studio        # Prisma Studio — browse/edit the database directly
```

## Word of the Day Studio (`/studio`)

The private admin for the whole operation: write a devotional once, and
it automatically becomes today's homepage feature, a permanent page, an
archive/topic/book entry, a search result, an "I Need a Word"
recommendation, an email + push + social notification, and a sitemap
entry — no separate step for each. See `src/content/README.md` for the
single-source-of-truth content flow, and the pages below for everything
Studio does:

| Route | What it's for |
|---|---|
| `/studio` | Dashboard — today's Word, its engagement, quick actions |
| `/studio/new` | The editor — write, paste-import, live preview, publish/schedule |
| `/studio/devotionals` | Search/filter all Words; edit, duplicate, archive |
| `/studio/calendar` | Month view of what's published/scheduled/draft/empty |
| `/studio/series` | Create series, assign Words, reorder days, publish |
| `/studio/prayers` | Approve prayer requests for the public wall (nothing auto-publishes) |
| `/studio/need-a-word` | Link devotionals to each "I Need a Word" category |
| `/studio/subscribers` | Search, filter, export, growth counts |
| `/studio/distribution` | Per-channel send status, with safe retry on failure |
| `/studio/analytics` | Real engagement — reads from logged events, not vanity metrics |
| `/studio/settings` | Default timezone/email delay for scheduling, password |

**Auth:** a signed session cookie (see `src/lib/auth.ts`), checked in
`src/proxy.ts` (Next's "proxy"/middleware convention) for every
`/studio` and `/api/studio` request, with a second check in the
dashboard layout. Passwords are bcrypt-hashed; the session JWT carries
identity so the edge-runtime check never touches the database.

**What's a real, working implementation vs. an architected stub**
(matching what the product brief asked for in each case):

- **Publishing, scheduling, auto-propagation, idempotent distribution
  queueing, and actual sending** — fully real. A Vercel Cron job
  (`vercel.json` → `src/app/api/cron/send-notifications/route.ts`, daily
  by default — see "Distribution" below) sends every queued EMAIL/PUSH
  notification. See "Database" below for how content flows.
- **Email** — a real template (HTML + plain text, `src/lib/email/templates/`)
  and a provider abstraction (`src/lib/email/providers/`) with a
  `ConsoleEmailProvider` that logs instead of sending. The cron job calls
  it for real on schedule; connect a real provider (Resend, Postmark,
  SES…) by adding one file there — nothing else changes.
- **Web push** — actually real: `npm run db:seed`-free, self-generated
  VAPID keys (no external account) let the public "🔔 REMIND ME" button
  genuinely subscribe a browser (`src/components/PushOptIn.tsx`,
  `public/sw.js`), and the cron job calls `src/lib/push/sendPush.ts` to
  really send to everyone subscribed, on schedule.
  Browser permission is only ever requested after the visitor clicks the
  button, never on page load.
  **Important:** `web-push` requires Node's crypto APIs, so it can't run
  on the Edge runtime — `sendPush.ts` must only ever be called from a
  Node-runtime route handler (the default for API routes unless you've
  opted into `export const runtime = "edge"`).
- **Social captions** — real template generation
  (`src/lib/socialCaptions.ts`) plus a copy/edit/regenerate panel in the
  editor. Never auto-posts anywhere, per the brief.
- **Share graphics** — the existing OG image generator
  (`src/app/opengraph-image.tsx`, `.../devotional/[slug]/opengraph-image.tsx`)
  is the real, working piece; dedicated 1:1/4:5/9:16 export formats are
  an easy extension of that same `next/og` pattern when needed.
- **Analytics** — real: every page view, "I received this Word," share,
  search, and "I Need a Word" pick writes an `AnalyticsEvent` row
  (`src/lib/analytics.ts`, `/api/analytics/event`), and the dashboard
  reads real aggregates — nothing is mocked.

## Database

Prisma, with SQLite for local development (zero external setup) and a
schema written to be Postgres-portable. **This matters before you
deploy:** SQLite's file storage does not reliably persist on Vercel's
serverless functions. Before relying on Studio in production:

1. Provision a Postgres database (Neon, Vercel Postgres — a couple of
   minutes in either dashboard).
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to
   `provider = "postgresql"`.
3. Set `DATABASE_URL` (in Vercel's project env vars, and in your local
   `.env` if you want to develop against it too) to the new connection
   string.
4. Run `npm run db:migrate` once against it, then `npm run db:seed` if
   it's a fresh database.

Until then, local development works fully out of the box against SQLite
— nothing above is required just to run the project.

**Content flow:** `src/content/index.ts` exposes the same functions the
public site has always used (`getAllDevotionals`, `getTodaysWord`,
etc.) — they now query the database instead of a static file, so every
public page automatically reflects whatever Studio publishes. Nothing
on the public site imports Prisma directly or duplicates this data.

**Seeding:** `prisma/seed.ts` is safe to re-run — it upserts, and
existing devotionals are left alone (Studio is the source of truth once
you've started editing). It migrates the project's original static
content into the database and creates your first admin account from
`ADMIN_EMAIL`/`ADMIN_PASSWORD`.

## Automatic photography (Unsplash)

Every devotional and the homepage hero can show a real photo, automatically
chosen to match the devotional's topic — no manual image search required,
ever. Set it up once:

1. Create a free account at [unsplash.com/developers](https://unsplash.com/developers),
   click **New Application**, accept the API terms, and copy the
   **Access Key** it gives you. Takes about two minutes.
2. Add it to `.env.local`: `UNSPLASH_ACCESS_KEY=your-key-here`
3. Run `npm run fetch-images`. It searches Unsplash once per devotional
   (using a topic → search-query map in `src/lib/imageQuery.ts`), caches
   the result in `src/data/unsplash-cache.json`, and skips anything
   already cached — so it's always safe to re-run after publishing a new
   devotional.

**Images are never fetched live on a page view** — only by that script,
which you run whenever you add a devotional (or on a schedule in CI, if
you prefer). This keeps every page fast, and keeps you well under
Unsplash's free-tier limit (50 requests/hour).

If you skip this setup entirely, the site works exactly as before —
every image falls back to its art-directed `Atmosphere` gradient
treatment, no errors, nothing missing. See the "How images are chosen"
section of `src/content/README.md` for the full priority order and how
to hand-pick or override a specific photo.

Photo credit (photographer name + link, required by Unsplash's API
terms) appears as a small caption on hover/focus over any Unsplash-sourced
image — see `src/components/UnsplashCredit.tsx`.

## Project structure

- `prisma/schema.prisma` — the entire data model (devotionals, topics,
  series, "I Need a Word" categories, prayer requests, subscribers, push
  subscriptions, notification log, analytics events, admin users,
  settings, rate-limit buckets). `prisma/seed.ts` populates it.
- `src/content/` — `index.ts` is the read API every public page uses
  (now backed by the database); `types.ts` defines the shared shapes;
  `books.ts` is the static list of canonical Bible book names.
  **See `src/content/README.md`.**
- `src/app/studio/` — the admin UI; `src/app/api/studio/` — its API
  routes. Both sit behind `src/proxy.ts`.
- `src/components/studio/` — Studio-only UI (the editor, live preview,
  calendars, panels).
- `src/app/` (public) — routes. Each page reads content exclusively
  through `src/content/index.ts`.
- `src/components/` (public) — shared UI. `DevotionalReader.tsx` is the
  actual devotional reading template, used by both the public page and
  Studio's live preview, so the preview can never drift from reality.
  `DevotionalImage.tsx` renders whichever image a devotional resolved to
  (Unsplash photo or `Atmosphere` gradient fallback).
- `src/lib/` — auth, rate limiting, analytics, email (template +
  provider abstraction), push (VAPID sending), social captions, the
  import-paste parser, date/timezone helpers, and the Unsplash client.
- `scripts/fetch-devotional-images.ts` — the image-sourcing script.

## Security

- Studio routes require a valid session (bcrypt-hashed passwords, signed
  JWT cookies, httpOnly + `sameSite=lax` + `secure` in production).
- Public POST endpoints (prayer submission, email signup, Studio login)
  are rate-limited per IP via a database-backed fixed window
  (`src/lib/rateLimit.ts`) — works correctly across serverless instances,
  unlike an in-memory limiter.
- All form input is validated with Zod (`src/lib/validation.ts`) before
  it touches the database.
- Prayer requests marked private by the requester can never be approved
  for the public wall — enforced in the API route, not just the UI — and
  prayer content is never written to logs.
- No secret (API keys, session secret, VAPID private key, database
  credentials) is ever referenced from a `"use client"` module; only
  `NEXT_PUBLIC_`-prefixed values reach the browser.

## Distribution: how a publish turns into a send

1. Publishing (or a scheduled Word going live) queues a `NotificationLog`
   row per enabled channel — see
   `src/app/api/studio/devotionals/[id]/publish/route.ts`. Each row's
   `idempotencyKey` (`${devotionalId}:${channel}`) means a re-publish or
   a crashed retry can never create a duplicate send.
2. `src/app/api/cron/send-notifications/route.ts` is what actually sends:
   it claims due EMAIL/PUSH rows (an atomic conditional update, so two
   overlapping runs can't both send the same row), sends through the
   email provider / `sendPush.ts`, and only marks a row `SENT` once that
   call actually resolves successfully — a failure is recorded with
   `errorMessage` and left for the Distribution page's retry button.
   SOCIAL is never auto-sent; its captions stay queued for a human to
   copy and post.
3. Vercel Cron (`vercel.json`) calls that route once a day by default —
   safe for every Vercel plan. If you're on Pro or higher, you can tighten
   `vercel.json`'s `schedule` (e.g. `*/15 * * * *`) for same-morning
   delivery instead of next-day.
4. The route only accepts requests carrying `CRON_SECRET` as a bearer
   token — set the same value in both `.env.local` (local testing) and
   Vercel's project env vars (what the actual cron invocation checks
   against).

## Known prototype limits

- See "Database" above re: SQLite → Postgres before production traffic.
- Email only *looks* sent until you connect a real provider — the
  `ConsoleEmailProvider` the cron calls by default just logs instead of
  reaching an inbox. See "What's real vs. a stub" above.
- `SITE_URL` resolution lives in `next.config.ts` / `src/lib/site.ts` —
  it already works correctly on Vercel out of the box (falls back to the
  `*.vercel.app` domain), but set `NEXT_PUBLIC_SITE_URL` once you attach
  a custom domain.
