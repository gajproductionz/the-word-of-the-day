# CLAUDE IMPORT INSTRUCTIONS — THE WORD OF THE DAY

You are receiving a historical archive package for the existing **The Word of the Day** website.

## Files
- `word-of-the-day-archive.json` — machine-readable source of truth.
- `word-of-the-day-archive.md` — human-readable archive.
- `archive-manifest.json` — counts and recovery status.

## Critical integrity rule
These devotionals represent the history of The Word of the Day.

**DO NOT invent missing historical content.**
**DO NOT turn catalog-only references into fabricated old devotionals.**
**DO NOT silently rewrite the author's voice.**

Only import entries from `devotionals` as historical devotional pages.

The `historicalCatalog` array is a recovery checklist. It is NOT importable devotional copy.

## Recovery statuses
- `near-complete`: historical wording/content was substantially recovered. Import it.
- `partial`: meaningful historical wording was recovered, but the original may have contained additional detail. Import it, and store `recoveryStatus` in metadata.
- `catalog-only`: the historical entry is known to have existed, but its complete original copy is unavailable. Do not publish fabricated copy.

## Import mapping
Map each recovered devotional into the site's existing content model:
- id
- slug
- title
- date
- book
- chapter
- verseStart
- verseEnd
- scriptureReference
- scriptureText
- keyMessage
- reflection
- prayer
- topics
- series
- recoveryStatus

If the existing schema contains additional fields such as `reflectionQuestion`, `featuredImage`, `seoTitle`, or `seoDescription`, those may be generated as metadata/UI support, but DO NOT alter the devotional's historical message.

## Public placement
Recovered devotionals should become eligible for:
- Devotional Library
- Search
- Bible Book pages
- Topic pages
- Related Words
- I Need A Word recommendations
- Series pages

Do not automatically make them Today's Word.

## Series
Preserve series labels in the archive, including:
- Journey Through Matthew
- Journey Through Galatians
- Journey Through Titus
- Proverbs: Wisdom for Life

Create series relationships without rewriting the devotional.

## Dates
Preserve dates supplied by the archive.
Never invent missing dates.

## URLs
Use clean permanent URLs such as:
`/devotional/seek-first`

Handle slug collisions safely.

## KJV
The archive's primary Scripture translation is KJV. Do not silently substitute another translation.

## Search / I Need A Word
Use `topics` to power search and recommendation mapping. A devotional may be associated with multiple relevant needs, but do not over-tag it.

## Validation
After import, produce a report containing:
1. total recovered devotionals imported
2. total near-complete vs partial
3. entries by Bible book
4. entries by series
5. entries by topic
6. catalog-only historical references not imported
7. duplicate slugs/references
8. any import errors

## Future archive expansion
Design the importer to be rerunnable/upsert-safe by stable `id` or `slug`. More historical devotionals will be added to this package as their original text is recovered.

**DO NOT REWRITE THE HISTORY. IMPORT WHAT IS RECOVERED, AND LEAVE UNRECOVERED HISTORY CLEARLY MARKED.**
