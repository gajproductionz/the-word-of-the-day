import { db } from "@/lib/db";
import type { Devotional, EmotionWord, SeriesMeta, Topic } from "./types";
import type {
  Devotional as PrismaDevotional,
  Topic as PrismaTopic,
  Series as PrismaSeries,
} from "@prisma/client";

export * from "./types";
export { bibleBooks } from "./books";

type DevotionalRow = PrismaDevotional & { topics: PrismaTopic[]; series: PrismaSeries | null };

/**
 * Maps a database row onto the same `Devotional` shape every page and
 * component already consumes, so the DB migration required no changes
 * to the public site's pages — see src/content/README.md.
 */
function toDevotional(row: DevotionalRow): Devotional {
  return {
    id: row.id,
    slug: row.slug,
    date: row.date.toISOString().slice(0, 10),
    title: row.title,
    book: row.book,
    chapter: row.chapter,
    verseStart: row.verseStart,
    verseEnd: row.verseEnd ?? undefined,
    scriptureReference: row.scriptureReference,
    scriptureText: row.scriptureText,
    keyMessage: row.keyMessage,
    reflection: row.reflection as string[],
    reflectionQuestion: row.reflectionQuestion,
    prayer: row.prayer,
    topics: row.topics.map((t) => t.name) as Topic[],
    series: row.series?.slug,
    seriesDay: row.seriesDay ?? undefined,
    featuredImage: row.featuredImage,
    featuredImageAlt: row.featuredImageAlt,
    unsplashQuery: row.unsplashQuery ?? undefined,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    published: row.status === "PUBLISHED",
    featured: row.featured,
  };
}

const include = { topics: true, series: true } as const;

/** Devotionals that are currently live on the public site (status PUBLISHED, date order). */
export async function getAllDevotionals(): Promise<Devotional[]> {
  const rows = await db.devotional.findMany({
    where: { status: "PUBLISHED" },
    include,
    orderBy: { date: "desc" },
  });
  return rows.map(toDevotional);
}

export async function getDevotionalBySlug(slug: string): Promise<Devotional | undefined> {
  const row = await db.devotional.findFirst({
    where: { slug, status: "PUBLISHED" },
    include,
  });
  return row ? toDevotional(row) : undefined;
}

export async function getTodaysWord(): Promise<Devotional> {
  const featured = await db.devotional.findFirst({
    where: { status: "PUBLISHED", featured: true },
    include,
    orderBy: { date: "desc" },
  });
  if (featured) return toDevotional(featured);

  const mostRecent = await db.devotional.findFirstOrThrow({
    where: { status: "PUBLISHED" },
    include,
    orderBy: { date: "desc" },
  });
  return toDevotional(mostRecent);
}

export async function getRecentDevotionals(excludeSlug?: string, limit = 3): Promise<Devotional[]> {
  const rows = await db.devotional.findMany({
    where: { status: "PUBLISHED", ...(excludeSlug ? { slug: { not: excludeSlug } } : {}) },
    include,
    orderBy: { date: "desc" },
    take: limit,
  });
  return rows.map(toDevotional);
}

export async function getDevotionalsByTopic(topic: string): Promise<Devotional[]> {
  const rows = await db.devotional.findMany({
    where: {
      status: "PUBLISHED",
      topics: { some: { name: { equals: topic } } },
    },
    include,
    orderBy: { date: "desc" },
  });
  return rows.map(toDevotional);
}

export async function getDevotionalsByBook(book: string): Promise<Devotional[]> {
  const rows = await db.devotional.findMany({
    where: { status: "PUBLISHED", book: { equals: book } },
    include,
    orderBy: { date: "desc" },
  });
  return rows.map(toDevotional);
}

export async function getDevotionalsBySeries(seriesSlug: string): Promise<Devotional[]> {
  const rows = await db.devotional.findMany({
    where: { status: "PUBLISHED", series: { slug: seriesSlug } },
    include,
    orderBy: { seriesDay: "asc" },
  });
  return rows.map(toDevotional);
}

export async function getSeriesMeta(slug: string): Promise<SeriesMeta | undefined> {
  const row = await db.series.findUnique({ where: { slug } });
  if (!row) return undefined;
  return { slug: row.slug, title: row.title, description: row.description, totalDays: row.totalDays };
}

export async function getAllSeries(): Promise<SeriesMeta[]> {
  const rows = await db.series.findMany({ where: { status: "PUBLISHED" }, orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    totalDays: row.totalDays,
  }));
}

export async function getFeaturedSeries(): Promise<SeriesMeta | undefined> {
  const series = await getAllSeries();
  for (const s of series) {
    const days = await getDevotionalsBySeries(s.slug);
    if (days.length > 0) return s;
  }
  return undefined;
}

export async function getSeasonPick(): Promise<Devotional> {
  const preferred = await getDevotionalBySlug("the-waiting-is-not-wasted");
  if (preferred) return preferred;
  const recent = await getAllDevotionals();
  return recent[1] ?? recent[0];
}

export async function getEmotionBySlug(slug: string): Promise<EmotionWord | undefined> {
  const row = await db.needCategory.findUnique({ where: { slug } });
  if (!row) return undefined;
  const link = await db.needCategoryDevotional.findFirst({
    where: { needCategoryId: row.id },
    include: { devotional: true },
  });
  return {
    slug: row.slug,
    label: row.label,
    scriptureReference: row.scriptureReference,
    scriptureText: row.scriptureText,
    encouragement: row.encouragement,
    devotionalSlug: link?.devotional.slug ?? "",
  };
}

/** All "I Need a Word" categories, each paired with one rotated-at-random linked devotional. */
export async function getEmotionWords(): Promise<EmotionWord[]> {
  const categories = await db.needCategory.findMany({
    include: { devotionals: { include: { devotional: true } } },
    orderBy: { createdAt: "asc" },
  });

  return categories.map((cat) => {
    const options = cat.devotionals.filter((link) => link.devotional.status === "PUBLISHED");
    const chosen = options[Math.floor(Math.random() * options.length)]?.devotional;
    return {
      slug: cat.slug,
      label: cat.label,
      scriptureReference: cat.scriptureReference,
      scriptureText: cat.scriptureText,
      encouragement: cat.encouragement,
      devotionalSlug: chosen?.slug ?? "",
    };
  });
}

export async function getRelatedDevotional(
  topics: Topic[],
  excludeSlug: string
): Promise<Devotional | undefined> {
  const rows = await db.devotional.findMany({
    where: {
      status: "PUBLISHED",
      slug: { not: excludeSlug },
      topics: { some: { name: { in: topics } } },
    },
    include,
    orderBy: { date: "desc" },
    take: 1,
  });
  if (rows[0]) return toDevotional(rows[0]);

  const fallback = await db.devotional.findFirst({
    where: { status: "PUBLISHED", slug: { not: excludeSlug } },
    include,
    orderBy: { date: "desc" },
  });
  return fallback ? toDevotional(fallback) : undefined;
}

export async function searchDevotionals(query: string): Promise<Devotional[]> {
  const q = query.trim();
  if (!q) return [];
  const rows = await db.devotional.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q } },
        { scriptureReference: { contains: q } },
        { scriptureText: { contains: q } },
        { keyMessage: { contains: q } },
        { book: { contains: q } },
        { topics: { some: { name: { contains: q } } } },
      ],
    },
    include,
    orderBy: { date: "desc" },
  });
  return rows.map(toDevotional);
}

/** The ministry's configured timezone for scheduling and "today" labels. */
export async function getDefaultTimezone(): Promise<string> {
  const settings = await db.settings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} });
  return settings.defaultTimezone;
}

export async function getAllTopics(): Promise<Topic[]> {
  const rows = await db.topic.findMany({ orderBy: { name: "asc" } });
  return rows.map((t) => t.name) as Topic[];
}
