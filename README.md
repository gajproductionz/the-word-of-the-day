# The Word of the Day

> A Word for today. Faith for the journey.

A devotional website built with Next.js (App Router), TypeScript, and
Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

```bash
npm run build          # production build (static-generates every devotional,
                        # topic, book, and series page)
npm run start           # serve the production build
npm run lint             # ESLint
npm run fetch-images   # source devotional photos from Unsplash — see below
```

## Automatic photography (Unsplash)

Every devotional and the homepage hero can show a real photo, automatically
chosen to match the devotional's topic — no manual image search required,
ever. Set it up once:

1. Create a free account at [unsplash.com/developers](https://unsplash.com/developers),
   click **New Application**, accept the API terms, and copy the
   **Access Key** it gives you. Takes about two minutes.
2. Copy `.env.local.example` to `.env.local` and paste the key in:
   ```bash
   cp .env.local.example .env.local
   # then edit .env.local and set UNSPLASH_ACCESS_KEY=your-key-here
   ```
3. Run `npm run fetch-images`. It searches Unsplash once per devotional
   (using a topic → search-query map in `src/lib/imageQuery.ts`), caches
   the result in `src/data/unsplash-cache.json`, and skips anything
   already cached — so it's always safe to re-run after adding a new
   devotional.

**Images are never fetched live on a page view** — only by that script,
which you run whenever you add a devotional (or on a schedule in CI, if
you prefer). This keeps every page fast and statically generated, and
keeps you well under Unsplash's free-tier limit (50 requests/hour).

If you skip this setup entirely, the site works exactly as before —
every image falls back to its art-directed `Atmosphere` gradient
treatment, no errors, nothing missing. See the "How images are chosen"
section of `src/content/README.md` for the full priority order and how
to hand-pick or override a specific photo.

Photo credit (photographer name + link, required by Unsplash's API
terms) appears as a small caption on hover/focus over any Unsplash-sourced
image — see `src/components/UnsplashCredit.tsx`.

## Project structure

- `src/content/` — the entire content layer (devotionals, series, topics,
  emotion-word mappings, Bible books) as typed TypeScript, with no
  database required for the prototype. **See `src/content/README.md` for
  exactly how to publish tomorrow's Word.**
- `src/app/` — routes (App Router). Each page reads content exclusively
  through `src/content/index.ts`.
- `src/components/` — shared UI. `DevotionalImage.tsx` renders whichever
  image a devotional resolved to (Unsplash photo or `Atmosphere`
  gradient fallback); `Atmosphere.tsx` is the gradient treatment itself.
  Homepage-specific sections live under `src/components/home/`.
- `src/lib/` — utilities: date formatting, the streak hook, the Prayer
  Wall's JSON-file store, the Unsplash client (`unsplash.ts`), the
  image cache reader (`imageCache.ts`) and resolver (`resolveImage.ts`).
- `src/data/prayers.json` — prototype persistence for the Prayer Wall.
  Swap `src/lib/prayerStore.ts` for real database calls when deploying
  for real; nothing else needs to change.
- `src/data/unsplash-cache.json` — resolved Unsplash photos, keyed by
  devotional slug. Populated by `npm run fetch-images`, read at request
  time by `src/lib/imageCache.ts`.
- `scripts/fetch-devotional-images.ts` — the image-sourcing script.

## Email delivery, SMS, push

`/api/subscribe` validates and accepts signups but isn't wired to a real
provider yet — connect Resend/Mailchimp/etc. (or Twilio for SMS, a push
service for push) inside that route when ready. The frontend contract
won't need to change.

## Known prototype limits

- The Prayer Wall and streak/save state use a JSON file and
  `localStorage` respectively — fine for a single-instance demo, not for
  production scale. Both are isolated behind small modules
  (`src/lib/prayerStore.ts`, `src/lib/useStreak.ts`) specifically so they
  can be swapped for real accounts/a database later without touching any
  page or component.
- `src/data/unsplash-cache.json` is likewise a flat file — fine for a
  single-instance demo. Move it to a database table (slug → image) if
  you outgrow that.
- `SITE_URL` in `src/lib/site.ts` is a placeholder — update it to the
  real deployed domain before going live (it feeds canonical URLs, the
  sitemap, Open Graph tags, and share links).
