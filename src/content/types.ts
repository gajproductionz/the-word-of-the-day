export type Topic =
  | "Faith"
  | "Purpose"
  | "Relationships"
  | "Discipline"
  | "Forgiveness"
  | "Prayer"
  | "Family"
  | "Fear"
  | "Anxiety"
  | "Finances"
  | "Love"
  | "Healing"
  | "Temptation"
  | "Leadership"
  | "Patience"
  | "Obedience"
  | "Gratitude"
  | "Spiritual Growth"
  | "Waiting"
  | "Strength"
  | "Peace"
  | "Heartbreak"
  | "Direction";

export interface SeriesMeta {
  slug: string;
  title: string;
  description: string;
  totalDays: number;
}

/**
 * A single Word of the Day entry. This is the full content contract —
 * see src/content/README.md for how to add a new one.
 */
export interface Devotional {
  id: string;
  slug: string;
  /** ISO date string, e.g. "2026-10-05" */
  date: string;
  title: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  /** e.g. "ROMANS 8:28" */
  scriptureReference: string;
  /** Full KJV text of the passage */
  scriptureText: string;
  keyMessage: string;
  reflection: string[];
  reflectionQuestion: string;
  prayer: string;
  topics: Topic[];
  series?: string;
  seriesDay?: number;
  /** Fallback Atmosphere treatment key, used when no Unsplash image is cached — see Atmosphere.tsx */
  featuredImage: string;
  featuredImageAlt: string;
  /**
   * Optional override for the Unsplash search query used to source this
   * devotional's photo. When omitted, one is derived automatically from
   * `topics[0]` (see src/lib/imageQuery.ts). Set this when the default
   * topic-based query doesn't fit, or to art-direct a specific look.
   */
  unsplashQuery?: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  featured?: boolean;
}

export interface EmotionWord {
  slug: string;
  label: string;
  scriptureReference: string;
  scriptureText: string;
  encouragement: string;
  devotionalSlug: string;
}

/** A resolved, cached Unsplash photo for one devotional (see src/data/unsplash-cache.json). */
export interface UnsplashImageMeta {
  url: string;
  width: number;
  height: number;
  altDescription: string;
  query: string;
  photographerName: string;
  photographerProfileUrl: string;
  unsplashPhotoUrl: string;
  fetchedAt: string;
}

/**
 * The image a devotional actually renders with — either a real cached
 * Unsplash photo, or the art-directed Atmosphere treatment fallback.
 * Plain/serializable so it can cross the server→client boundary.
 */
export type ResolvedImage =
  | {
      kind: "unsplash";
      url: string;
      width: number;
      height: number;
      alt: string;
      photographerName: string;
      photographerProfileUrl: string;
      unsplashPhotoUrl: string;
    }
  | {
      kind: "atmosphere";
      treatment: string;
      alt: string;
    };

export interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  isPrivate: boolean;
  shareOnWall: boolean;
  prayerCount: number;
  createdAt: string;
}
