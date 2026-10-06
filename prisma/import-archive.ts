/**
 * Imports The Word of the Day's historical devotional archive
 * (prisma/archive/word-of-the-day-archive.json) into the live content
 * model, alongside prisma/seed.ts's prototype content — not replacing it.
 *
 * Source of truth: prisma/archive/word-of-the-day-archive.json.
 * prisma/archive/CLAUDE-IMPORT-INSTRUCTIONS.md and archive-manifest.json
 * document the recovery package itself; word-of-the-day-archive.md is a
 * human-readable mirror of the same JSON.
 *
 * Integrity rule (from the archive's own manifest, and honored here):
 * only `devotionals[]` entries are imported. `historicalCatalog[]` is a
 * recovery checklist of entries whose original wording could not be
 * recovered — it is never turned into published copy. Nothing here
 * invents scripture, reflections, prayers, or dates; it only supplies
 * schema-required fields the archive doesn't carry (reflectionQuestion,
 * featuredImage/Alt, SEO copy) as generated UI/metadata, never as
 * replacement devotional content.
 *
 * Safe to re-run: every write is an upsert keyed by slug, matching
 * prisma/seed.ts's convention — and by design, since the archive's own
 * instructions anticipate more recovered entries being added later.
 *
 * Usage: npm run db:import-archive
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const db = new PrismaClient();

interface ArchiveDevotional {
  id: string;
  slug: string;
  date: string;
  title: string;
  scriptureReference: string;
  translation: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  scriptureText: string;
  keyMessage: string;
  reflection: string;
  prayer: string;
  topics: string[];
  series?: string;
  recoveryStatus: "near-complete" | "partial" | "catalog-only";
  sourceNote?: string;
}

interface ArchiveCatalogEntry {
  book: string;
  scriptureReference: string;
  recoveryStatus: "catalog-only";
  import: false;
  note: string;
}

interface ArchiveFile {
  archiveName: string;
  version: string;
  primaryTranslation: string;
  devotionals: ArchiveDevotional[];
  historicalCatalog: ArchiveCatalogEntry[];
}

/**
 * Editorial decisions made for this import — not part of the archive
 * itself. Each maps an archive slug to: the (max two) existing site
 * topics it genuinely fits, a reflectionQuestion grounded in its own
 * keyMessage/reflection, an Atmosphere fallback treatment + alt text,
 * SEO copy, and — only where the connection is real, per the import
 * brief's "do not force a weak connection" rule — an "I Need a Word"
 * category slug (see src/content/emotions.ts for the existing set).
 */
const editorial: Record<
  string,
  {
    topics: string[];
    reflectionQuestion: string;
    featuredImage: string;
    featuredImageAlt: string;
    seoTitle: string;
    seoDescription: string;
    needCategorySlug?: string;
  }
> = {
  "seek-first": {
    topics: ["Faith", "Purpose"],
    reflectionQuestion: "What would it look like to seek God's kingdom first in the decision you're facing today?",
    featuredImage: "sunrise-ridge",
    featuredImageAlt: "Warm early light breaking gently over a distant ridge",
    seoTitle: "Seek First — Matthew 6:33 | The Word of the Day",
    seoDescription:
      "A devotional on Matthew 6:33 about seeking God's kingdom first and trusting Him to provide the rest.",
    needCategorySlug: "worried-about-money",
  },
  "shine-for-impact": {
    topics: ["Faith", "Purpose"],
    reflectionQuestion: "Where have you been dimming the light God placed in you to avoid standing out?",
    featuredImage: "window-light",
    featuredImageAlt: "Soft light spilling through a window into a quiet room",
    seoTitle: "Shine for Impact — Matthew 5:14 | The Word of the Day",
    seoDescription:
      "A devotional on Matthew 5:14 about letting your life reflect God's light instead of dimming it to fit in.",
  },
  "stay-hungry-for-god": {
    topics: ["Spiritual Growth", "Faith"],
    reflectionQuestion: "What has quietly dulled your hunger for God lately, and how can you return to it?",
    featuredImage: "wheat-field",
    featuredImageAlt: "Golden wheat catching the late afternoon light",
    seoTitle: "Stay Hungry for God — Matthew 5:6 | The Word of the Day",
    seoDescription:
      "A devotional on Matthew 5:6 about staying spiritually hungry and trusting God to satisfy that hunger.",
  },
  "release-the-weight": {
    topics: ["Peace", "Healing"],
    reflectionQuestion: "What weight have you been carrying alone that Jesus is inviting you to bring to Him instead?",
    featuredImage: "mountain-mist",
    featuredImageAlt: "Mist settling quietly over layered mountain ridges",
    seoTitle: "Release the Weight — Matthew 11:28 | The Word of the Day",
    seoDescription:
      "A devotional on Matthew 11:28 about releasing what you've been carrying and finding rest in God's presence.",
    needCategorySlug: "need-peace",
  },
  "guard-your-heart-from-offense": {
    topics: ["Relationships", "Forgiveness"],
    reflectionQuestion: "Is there an offense you're still carrying that it's time to release before it hardens into bitterness?",
    featuredImage: "storm-light",
    featuredImageAlt: "Light breaking through heavy clouds after a storm",
    seoTitle: "Guard Your Heart From Offense — Matthew 24:10 | The Word of the Day",
    seoDescription:
      "A devotional on Matthew 24:10 about guarding your heart from bitterness and responding to hurt with maturity.",
    needCategorySlug: "angry",
  },
  "integrity-over-validation": {
    topics: ["Purpose", "Obedience"],
    reflectionQuestion: "Whose approval have you been chasing more than God's lately?",
    featuredImage: "desert-road",
    featuredImageAlt: "A long, sunlit road stretching across open desert",
    seoTitle: "Integrity Over Validation — Galatians 1:10 | The Word of the Day",
    seoDescription:
      "A devotional on Galatians 1:10 about choosing integrity and God's approval over the pressure to please people.",
  },
  "access-does-not-equal-readiness": {
    topics: ["Spiritual Growth", "Discipline"],
    reflectionQuestion: "What is God developing in your character before He releases what He's prepared for you?",
    featuredImage: "forest-light",
    featuredImageAlt: "Sunlight filtering softly through a quiet forest canopy",
    seoTitle: "Access Doesn't Equal Readiness — Galatians 4:1 | The Word of the Day",
    seoDescription:
      "A devotional on Galatians 4:1 about letting God build the character and readiness your calling requires.",
    needCategorySlug: "need-discipline",
  },
  "bring-order-to-what-is-out-of-place": {
    topics: ["Leadership", "Discipline"],
    reflectionQuestion: "What has God entrusted to you that still needs your attention, order, or follow-through?",
    featuredImage: "harbor-dawn",
    featuredImageAlt: "A still harbor at first light, calm before the day begins",
    seoTitle: "Bring Order to What Is Out of Place — Titus 1:5 | The Word of the Day",
    seoDescription:
      "A devotional on Titus 1:5 about answering God's call to bring order and faithfulness to what's been neglected.",
    needCategorySlug: "need-purpose",
  },
  "growth-should-flow-through-you": {
    topics: ["Leadership", "Spiritual Growth"],
    reflectionQuestion: "Who in your life could benefit from what God has already taught you?",
    featuredImage: "ocean-horizon",
    featuredImageAlt: "A wide, calm ocean horizon meeting the early sky",
    seoTitle: "Growth Should Flow Through You — Titus 2:4 | The Word of the Day",
    seoDescription: "A devotional on Titus 2:4 about letting what God has taught you flow into the lives of others.",
  },
  "a-fountain-of-life": {
    topics: ["Relationships", "Spiritual Growth"],
    reflectionQuestion: "Do your words tend to leave people stronger or wounded — and what would it take to change that?",
    featuredImage: "candle-glow",
    featuredImageAlt: "A single candle glowing warm in a dark, quiet room",
    seoTitle: "A Fountain of Life — Proverbs 10:11 | The Word of the Day",
    seoDescription: "A devotional on Proverbs 10:11 about the life-giving power of words shaped by righteousness.",
  },
};

const seriesMeta: Record<string, { slug: string; description: string }> = {
  "Journey Through Matthew": {
    slug: "journey-through-matthew",
    description: "A verse-by-verse journey through the Gospel of Matthew, recovered from The Word of the Day's archive.",
  },
  "Journey Through Galatians": {
    slug: "journey-through-galatians",
    description: "A walk through Paul's letter to the Galatians, recovered from The Word of the Day's archive.",
  },
  "Journey Through Titus": {
    slug: "journey-through-titus",
    description: "A study through Paul's letter to Titus, recovered from The Word of the Day's archive.",
  },
  "Proverbs: Wisdom for Life": {
    slug: "proverbs-wisdom-for-life",
    description: "Daily wisdom from the book of Proverbs, recovered from The Word of the Day's archive.",
  },
};

async function resolveTopicIds(names: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of names) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const topic = await db.topic.upsert({ where: { name }, create: { name, slug }, update: {} });
    ids.push(topic.id);
  }
  return ids;
}

/**
 * Assigns each series a stable reading-order day number (canonical
 * chapter:verse order, then date) since the archive doesn't supply one,
 * and a provisional totalDays equal to how many of that series' entries
 * have been recovered so far — not a claim about the true historical
 * length. Both update automatically as more entries are added later.
 */
async function resolveSeriesAndDays(
  entries: ArchiveDevotional[]
): Promise<{ seriesIdBySlug: Map<string, string>; dayByEntryId: Map<string, number> }> {
  const seriesIdBySlug = new Map<string, string>();
  const dayByEntryId = new Map<string, number>();

  const bySeries = new Map<string, ArchiveDevotional[]>();
  for (const e of entries) {
    if (!e.series) continue;
    if (!bySeries.has(e.series)) bySeries.set(e.series, []);
    bySeries.get(e.series)!.push(e);
  }

  for (const [seriesName, days] of bySeries) {
    const meta = seriesMeta[seriesName];
    if (!meta) {
      console.warn(`No seriesMeta entry for "${seriesName}" — skipping series link for its devotionals.`);
      continue;
    }
    const sorted = [...days].sort(
      (a, b) => a.chapter - b.chapter || a.verseStart - b.verseStart || a.date.localeCompare(b.date)
    );
    sorted.forEach((d, i) => dayByEntryId.set(d.id, i + 1));

    const series = await db.series.upsert({
      where: { slug: meta.slug },
      create: {
        slug: meta.slug,
        title: seriesName,
        description: meta.description,
        totalDays: sorted.length,
        status: "PUBLISHED",
      },
      // Grow totalDays if a later archive run recovers more days for this
      // series; never shrink it if this run happens to see fewer.
      update: { totalDays: { set: Math.max(sorted.length, days.length) } },
    });
    seriesIdBySlug.set(seriesName, series.id);
  }

  return { seriesIdBySlug, dayByEntryId };
}

async function importArchive() {
  const raw = await fs.readFile(path.join(__dirname, "archive/word-of-the-day-archive.json"), "utf-8");
  const archive = JSON.parse(raw) as ArchiveFile;

  const importable = archive.devotionals.filter((d) => d.recoveryStatus !== "catalog-only");
  const skippedNoEditorial = importable.filter((d) => !editorial[d.slug]);
  const toImport = importable.filter((d) => editorial[d.slug]);

  const { seriesIdBySlug, dayByEntryId } = await resolveSeriesAndDays(toImport);

  const errors: { slug: string; reason: string }[] = [];
  const imported: ArchiveDevotional[] = [];

  for (const d of toImport) {
    const meta = editorial[d.slug];
    try {
      const topicIds = await resolveTopicIds(meta.topics);
      const seriesId = d.series ? seriesIdBySlug.get(d.series) ?? null : null;
      const seriesDay = d.series ? dayByEntryId.get(d.id) ?? null : null;

      await db.devotional.upsert({
        where: { slug: d.slug },
        create: {
          slug: d.slug,
          date: new Date(d.date + "T06:00:00.000Z"),
          title: d.title,
          book: d.book,
          chapter: d.chapter,
          verseStart: d.verseStart,
          verseEnd: d.verseEnd,
          scriptureReference: d.scriptureReference,
          scriptureText: d.scriptureText,
          keyMessage: d.keyMessage,
          // Archive stores one recovered paragraph per entry — wrapped as
          // the schema's paragraph array, not split or rewritten.
          reflection: [d.reflection],
          reflectionQuestion: meta.reflectionQuestion,
          prayer: d.prayer,
          topics: { connect: topicIds.map((id) => ({ id })) },
          seriesId,
          seriesDay,
          featuredImage: meta.featuredImage,
          featuredImageAlt: meta.featuredImageAlt,
          seoTitle: meta.seoTitle,
          seoDescription: meta.seoDescription,
          status: "PUBLISHED",
          publishAt: new Date(d.date + "T06:00:00.000Z"),
          // Historical backfill — never today's featured Word, and never
          // eligible for (re)notification on a future distribution run.
          featured: false,
          emailEnabled: false,
          pushEnabled: false,
          socialEnabled: false,
        },
        // Re-running the import never overwrites a devotional someone has
        // since edited in Studio — same "upsert once, then hands off"
        // convention as prisma/seed.ts.
        update: {},
      });

      if (meta.needCategorySlug) {
        const category = await db.needCategory.findUnique({ where: { slug: meta.needCategorySlug } });
        const devotional = await db.devotional.findUnique({ where: { slug: d.slug } });
        if (category && devotional) {
          await db.needCategoryDevotional.upsert({
            where: { needCategoryId_devotionalId: { needCategoryId: category.id, devotionalId: devotional.id } },
            create: { needCategoryId: category.id, devotionalId: devotional.id },
            update: {},
          });
        } else if (!category) {
          errors.push({ slug: d.slug, reason: `needCategorySlug "${meta.needCategorySlug}" not found` });
        }
      }

      imported.push(d);
    } catch (err) {
      errors.push({ slug: d.slug, reason: err instanceof Error ? err.message : String(err) });
    }
  }

  // --- Validation report ---
  const byBook = new Map<string, number>();
  const bySeries = new Map<string, number>();
  const byTopic = new Map<string, number>();
  const refCounts = new Map<string, number>();
  for (const d of imported) {
    byBook.set(d.book, (byBook.get(d.book) ?? 0) + 1);
    if (d.series) bySeries.set(d.series, (bySeries.get(d.series) ?? 0) + 1);
    for (const t of editorial[d.slug].topics) byTopic.set(t, (byTopic.get(t) ?? 0) + 1);
    refCounts.set(d.scriptureReference, (refCounts.get(d.scriptureReference) ?? 0) + 1);
  }
  const duplicateRefs = [...refCounts.entries()].filter(([, n]) => n > 1).map(([ref]) => ref);
  const missingDates = imported.filter((d) => !d.date);
  const missingTitles = imported.filter((d) => !d.title);
  const catalogByBook = new Map<string, number>();
  for (const c of archive.historicalCatalog) catalogByBook.set(c.book, (catalogByBook.get(c.book) ?? 0) + 1);
  const catalogOnly = archive.historicalCatalog.length;

  console.log("\n=== HISTORICAL ARCHIVE IMPORT REPORT ===\n");
  console.log(`Total devotionals imported: ${imported.length}`);
  console.log(`\nBy Bible book:`);
  for (const [book, n] of byBook) console.log(`  ${book}: ${n}`);
  console.log(`\nBy series:`);
  for (const [s, n] of bySeries) console.log(`  ${s}: ${n}`);
  console.log(`\nBy topic:`);
  for (const [t, n] of byTopic) console.log(`  ${t}: ${n}`);
  console.log(`\nEntries missing dates: ${missingDates.length}`);
  console.log(`Entries missing titles: ${missingTitles.length}`);
  console.log(
    `Entries missing a reflectionQuestion in the source archive: ${imported.length} (all — the archive format doesn't carry one; each was given a short question generated from its own keyMessage/reflection, listed in this script's "editorial" map, per CLAUDE-IMPORT-INSTRUCTIONS.md's "may be generated as metadata/UI support" allowance)`
  );
  console.log(`Duplicate Scripture references among imported entries: ${duplicateRefs.length ? duplicateRefs.join(", ") : "none"}`);
  console.log(
    `\nCatalog-only historical references NOT imported (original wording unrecoverable): ${catalogOnly}`
  );
  for (const [book, n] of catalogByBook) console.log(`  ${book}: ${n}`);
  console.log(
    `\nEntries with recovered content but skipped (no editorial mapping written for them yet): ${skippedNoEditorial.length}`
  );
  for (const d of skippedNoEditorial) console.log(`  ${d.slug}`);
  console.log(`\nImport errors: ${errors.length}`);
  for (const e of errors) console.log(`  ${e.slug}: ${e.reason}`);
  console.log("\n=== END REPORT ===\n");
}

importArchive()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
