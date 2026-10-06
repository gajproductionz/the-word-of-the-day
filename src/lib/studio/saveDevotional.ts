import { db } from "@/lib/db";
import type { DevotionalInput } from "@/lib/validation";
import type { Devotional as PrismaDevotional, Topic as PrismaTopic, Series as PrismaSeries } from "@prisma/client";

async function resolveSeriesId(seriesSlug: string | null | undefined): Promise<string | null> {
  if (!seriesSlug) return null;
  const series = await db.series.findUnique({ where: { slug: seriesSlug } });
  return series?.id ?? null;
}

async function resolveTopicIds(topicNames: string[]): Promise<string[]> {
  const ids: string[] = [];
  for (const name of topicNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const topic = await db.topic.upsert({
      where: { name },
      create: { name, slug },
      update: {},
    });
    ids.push(topic.id);
  }
  return ids;
}

/**
 * Shared by the create and update API routes so both stay in lockstep.
 * Topics are returned separately (as plain ids) rather than baked into
 * the data object, because create needs `connect` and update needs
 * `set` (so unchecking a topic actually detaches it) — see saveDevotional.ts's callers.
 */
export async function buildDevotionalData(input: DevotionalInput) {
  const [seriesId, topicIds] = await Promise.all([
    resolveSeriesId(input.seriesSlug),
    resolveTopicIds(input.topics),
  ]);

  const fields = {
    slug: input.slug,
    date: new Date(input.date + "T06:00:00.000Z"),
    title: input.title,
    book: input.book,
    chapter: input.chapter,
    verseStart: input.verseStart,
    verseEnd: input.verseEnd ?? null,
    scriptureReference: input.scriptureReference,
    scriptureText: input.scriptureText,
    keyMessage: input.keyMessage,
    reflection: input.reflection,
    reflectionQuestion: input.reflectionQuestion,
    prayer: input.prayer,
    seriesId,
    seriesDay: input.seriesDay ?? null,
    featuredImage: input.featuredImage,
    featuredImageAlt: input.featuredImageAlt,
    unsplashQuery: input.unsplashQuery || null,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    status: input.status,
    publishAt: input.publishAt ? new Date(input.publishAt) : null,
    featured: input.featured,
    emailEnabled: input.emailEnabled,
    pushEnabled: input.pushEnabled,
    socialEnabled: input.socialEnabled,
    audioUrl: input.audioUrl || null,
    audioDuration: input.audioDuration ?? null,
  };

  return { fields, topicIds };
}

/**
 * Reconstructs the same shape devotionalInputSchema expects from a saved
 * row — used by the publish and schedule routes to check readiness
 * against the DB's current state, since autosave validates against the
 * looser devotionalDraftSchema and may have left required fields empty.
 */
export function toPublishCheckInput(
  d: PrismaDevotional & { topics: PrismaTopic[]; series: PrismaSeries | null }
) {
  return {
    slug: d.slug,
    date: d.date.toISOString().slice(0, 10),
    title: d.title,
    book: d.book,
    chapter: d.chapter,
    verseStart: d.verseStart,
    verseEnd: d.verseEnd,
    scriptureReference: d.scriptureReference,
    scriptureText: d.scriptureText,
    keyMessage: d.keyMessage,
    reflection: d.reflection,
    reflectionQuestion: d.reflectionQuestion,
    prayer: d.prayer,
    topics: d.topics.map((t) => t.name),
    seriesSlug: d.series?.slug ?? null,
    seriesDay: d.seriesDay,
    featuredImage: d.featuredImage,
    featuredImageAlt: d.featuredImageAlt,
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    status: "PUBLISHED" as const,
  };
}
