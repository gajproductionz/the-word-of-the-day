import { devotionals } from "./devotionals";
import { seriesList } from "./series";
import { emotionWords } from "./emotions";
import type { Devotional, Topic } from "./types";

export * from "./types";
export { seriesList } from "./series";
export { emotionWords } from "./emotions";
export { bibleBooks } from "./books";

/** All known topics, derived from content so the list never drifts out of sync. */
export const allTopics: Topic[] = Array.from(
  new Set(devotionals.flatMap((d) => d.topics))
).sort() as Topic[];

function byDateDesc(a: Devotional, b: Devotional) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getAllDevotionals(): Devotional[] {
  return devotionals.filter((d) => d.published).sort(byDateDesc);
}

export function getDevotionalBySlug(slug: string): Devotional | undefined {
  return devotionals.find((d) => d.slug === slug && d.published);
}

export function getTodaysWord(): Devotional {
  const published = getAllDevotionals();
  return published.find((d) => d.featured) ?? published[0];
}

export function getRecentDevotionals(excludeSlug?: string, limit = 3): Devotional[] {
  return getAllDevotionals()
    .filter((d) => d.slug !== excludeSlug)
    .slice(0, limit);
}

export function getDevotionalsByTopic(topic: string): Devotional[] {
  const normalized = topic.toLowerCase();
  return getAllDevotionals().filter((d) =>
    d.topics.some((t) => t.toLowerCase() === normalized)
  );
}

export function getDevotionalsByBook(book: string): Devotional[] {
  const normalized = book.toLowerCase();
  return getAllDevotionals().filter((d) => d.book.toLowerCase() === normalized);
}

export function getDevotionalsBySeries(seriesSlug: string): Devotional[] {
  return getAllDevotionals()
    .filter((d) => d.series === seriesSlug)
    .sort((a, b) => (a.seriesDay ?? 0) - (b.seriesDay ?? 0));
}

export function getSeriesMeta(slug: string) {
  return seriesList.find((s) => s.slug === slug);
}

export function getFeaturedSeries() {
  // The first series that has at least one published devotional.
  return seriesList.find((s) => getDevotionalsBySeries(s.slug).length > 0);
}

export function getSeasonPick(): Devotional {
  const published = getAllDevotionals();
  return published.find((d) => d.slug === "the-waiting-is-not-wasted") ?? published[1] ?? published[0];
}

export function getEmotionBySlug(slug: string) {
  return emotionWords.find((e) => e.slug === slug);
}

export function getRelatedDevotional(topics: Topic[], excludeSlug: string): Devotional | undefined {
  const pool = getAllDevotionals().filter(
    (d) => d.slug !== excludeSlug && d.topics.some((t) => topics.includes(t))
  );
  return pool[0] ?? getAllDevotionals().find((d) => d.slug !== excludeSlug);
}

/**
 * Lightweight search across title, scripture reference/text, topics, book,
 * and key message. Good enough for a content base of this size; swap for
 * a proper search index (Algolia, Meilisearch, etc.) as the library grows.
 */
export function searchDevotionals(query: string): Devotional[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllDevotionals().filter((d) => {
    const haystack = [
      d.title,
      d.scriptureReference,
      d.scriptureText,
      d.keyMessage,
      d.book,
      ...d.topics,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
