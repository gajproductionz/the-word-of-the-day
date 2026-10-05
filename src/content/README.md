# Adding a new Word of the Day

This content layer is intentionally just typed TypeScript objects — no
database, no CMS — so a non-developer workflow can be bolted on later
(Sanity, Contentful, a simple admin form writing to a DB, etc.) without
touching a single page or component. Every page reads through the
functions in `src/content/index.ts`, never the raw arrays directly.

## To publish tomorrow's devotional

1. Open `src/content/devotionals.ts`.
2. Copy an existing entry and add a new object to the top of the `devotionals` array.
3. Fill in every field (see `src/content/types.ts` for the full shape):
   - `id` — any unique string (e.g. `"d16"`)
   - `slug` — URL-safe, kebab-case, unique (becomes `/devotional/your-slug`)
   - `date` — `"YYYY-MM-DD"`
   - `title`, `book`, `chapter`, `verseStart`, `verseEnd?`
   - `scriptureReference` — display form, e.g. `"ROMANS 8:28"`
   - `scriptureText` — full KJV passage text
   - `keyMessage` — one sentence, becomes the big pull-quote
   - `reflection` — an array of paragraph strings
   - `reflectionQuestion`, `prayer`
   - `topics` — pick from the `Topic` union in `types.ts`, or extend it
   - `series?` / `seriesDay?` — only if this is part of a series (must match a slug in `src/content/series.ts`)
   - `featuredImage` — one of the named atmosphere treatments in
     `src/components/Atmosphere.tsx` (or a real photo path once photography
     is added — see below)
   - `featuredImageAlt` — required, descriptive alt text
   - `seoTitle`, `seoDescription` — `seoTitle` should **not** include
     "The Word of the Day"; the root layout's title template appends it
     automatically, so including it yourself produces a doubled title
   - `published: true`, `featured?: true` (only one should be `featured` — it becomes "Today's Word" on the homepage)
4. Save. The devotional is now live on `/devotionals`, search, topic pages,
   its book page, and (if it has `series`) its series page — no other
   changes needed.
5. Run `npm run fetch-images` once. This automatically searches Unsplash
   for a photo matching the devotional's topic (or its `unsplashQuery`
   override, if you set one) and caches the result — **no manual image
   search required**. Devotionals that already have a cached image are
   skipped, so it's always safe to re-run after adding a new one. Requires
   `UNSPLASH_ACCESS_KEY` in `.env.local` — see the root `README.md`.

If you skip step 5 (or haven't set up an Unsplash key yet), the
devotional still displays fine — it just uses its `featuredImage`
Atmosphere treatment instead of a real photo, exactly like before this
feature existed.

## How images are chosen

Each devotional's photo comes from one of three sources, in priority order:

1. **A cached Unsplash photo** (`src/data/unsplash-cache.json`), resolved
   automatically by `npm run fetch-images` from the devotional's topic —
   see above. This is the default path and requires no manual work.
2. **`featuredImage`** — a named key (`"sunrise-ridge"`, `"forest-light"`,
   etc.) rendered by `src/components/Atmosphere.tsx` as an art-directed
   gradient + grain treatment. Used whenever no Unsplash image is cached
   for that slug (no key configured, the fetch script hasn't run yet, or
   the search came up empty) — so every devotional always has a
   considered visual, Unsplash or not.
3. **Your own fine-art photography**, once you have it. Swap in a real
   file instead of relying on either of the above:
   - Drop the image into `/public/images/devotionals/`.
   - In `Atmosphere.tsx`, add a case that renders a Next.js `<Image>`
     using that file instead of the generated treatment, keyed by the
     same name — or write it straight into
     `src/data/unsplash-cache.json` under the devotional's slug (same
     shape as an Unsplash entry, pointing at your own file) to have it
     take priority over both Unsplash and Atmosphere.
   - No other devotional data needs to change.

To re-pick a devotional's Unsplash photo (e.g. after narrowing its
`unsplashQuery` to a more precise search phrase), delete its entry from
`src/data/unsplash-cache.json` and run `npm run fetch-images` again — it
only resolves entries missing from the cache, so this re-fetches just
that one devotional. `npm run fetch-images -- --force` instead
re-resolves *every* devotional, overwriting the whole cache.

## Swapping this for a real CMS/database later

Replace the contents of `getAllDevotionals()` and friends in
`src/content/index.ts` with calls to your CMS/DB client, keeping the same
return shape (`Devotional[]`). Every page and component already consumes
data exclusively through those functions, so the rest of the app needs no
changes.
