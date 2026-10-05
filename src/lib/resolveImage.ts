import type { Devotional, ResolvedImage } from "@/content/types";
import { getCachedImage } from "./imageCache";

export type DevotionalWithImage = Devotional & { resolvedImage: ResolvedImage };

/**
 * Resolves a devotional's display image: a cached Unsplash photo if one
 * exists for its slug, otherwise the Atmosphere treatment fallback. Reads
 * the file-based cache (Node `fs`), so this must run in a Server
 * Component or route handler — never inside a "use client" module.
 */
export async function resolveImage(
  d: Pick<Devotional, "slug" | "featuredImage" | "featuredImageAlt">
): Promise<ResolvedImage> {
  const cached = await getCachedImage(d.slug);
  if (cached) {
    return {
      kind: "unsplash",
      url: cached.url,
      width: cached.width,
      height: cached.height,
      alt: cached.altDescription || d.featuredImageAlt,
      photographerName: cached.photographerName,
      photographerProfileUrl: cached.photographerProfileUrl,
      unsplashPhotoUrl: cached.unsplashPhotoUrl,
    };
  }
  return { kind: "atmosphere", treatment: d.featuredImage, alt: d.featuredImageAlt };
}

/** Resolves images for a whole list of devotionals, attaching `resolvedImage` to each. */
export async function resolveImages<T extends Devotional>(
  list: T[]
): Promise<(T & { resolvedImage: ResolvedImage })[]> {
  return Promise.all(
    list.map(async (d) => ({ ...d, resolvedImage: await resolveImage(d) }))
  );
}
