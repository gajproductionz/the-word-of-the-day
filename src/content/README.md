# The content layer

Every public page reads devotionals, series, topics, and "I Need a Word"
categories exclusively through the functions in `src/content/index.ts`
(`getAllDevotionals`, `getTodaysWord`, `getDevotionalsBySeries`, etc.) —
never a database client, never a raw array. Those functions are backed
by Postgres/SQLite via Prisma (see the root `README.md`'s "Database"
section), which is what makes "publish once, appears everywhere"
possible: there's exactly one place the public site gets its data from,
so nothing can go update the homepage but forget the archive.

## To publish tomorrow's devotional

**Use [Word of the Day Studio](/studio)** — `/studio/new` for a fresh
Word, or paste an already-written one into its **Import a Word** panel
and it'll suggest how the text maps onto each field (title, Scripture,
key message, reflection, question, prayer), all editable before you
save anything. Autosave keeps a draft as you write; **Publish Now** or
**Schedule** makes it live. See the root `README.md`'s "Studio" section
for what every page there does.

Publishing a devotional automatically makes it eligible for the
homepage's Today's Word, the devotional archive, its topic and Bible
book pages, search, "I Need a Word" (once you link it to a category in
`/studio/need-a-word`), its series page (if assigned in
`/studio/series`), and the sitemap — no separate step for any of those.

`prisma/schema.prisma` is the full field reference if you want it beyond
what the editor's UI surfaces directly (e.g. `unsplashQuery`, to
override the auto-selected search phrase for a specific Word — editable
via `npm run db:studio`, Prisma's own data browser).

## How images are chosen

Each devotional's photo comes from one of three sources, in priority order:

1. **A cached Unsplash photo** (`src/data/unsplash-cache.json`), resolved
   automatically by `npm run fetch-images` from the devotional's topic.
   This is the default path and requires no manual work — see the root
   `README.md`'s "Automatic photography" section for setup.
2. **`featuredImage`** — a named key (`"sunrise-ridge"`, `"forest-light"`,
   etc.), set in the editor's "Topics, Series & Image" section, rendered
   by `src/components/Atmosphere.tsx` as an art-directed gradient + grain
   treatment. Used whenever no Unsplash image is cached for that slug (no
   key configured, the fetch script hasn't run yet, or the search came up
   empty) — so every devotional always has a considered visual, Unsplash
   or not.
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
`unsplashQuery` to a more precise search phrase via `npm run db:studio`),
delete its entry from `src/data/unsplash-cache.json` and run
`npm run fetch-images` again — it only resolves entries missing from the
cache, so this re-fetches just that one devotional.
`npm run fetch-images -- --force` instead re-resolves *every*
devotional, overwriting the whole cache.

## `DevotionalReader.tsx`: one template, not two

Studio's live preview and the real public devotional page
(`/devotional/[slug]`) both render through the same
`src/components/DevotionalReader.tsx` component. "What you see in
preview" and "what readers actually get" can't drift apart because
they're literally the same code path, fed different data.

## Extending the schema

Add a field in `prisma/schema.prisma`, run `npm run db:migrate` to
create and apply the migration, then thread it through: the Zod schema
in `src/lib/validation.ts`, `buildDevotionalData` in
`src/lib/studio/saveDevotional.ts`, the `Devotional` type in
`src/content/types.ts` and its mapping in `toDevotional()`
(`src/content/index.ts`), and wherever in the editor UI
(`src/components/studio/DevotionalEditor.tsx`) it should be editable.
