import type { UnsplashImageMeta } from "@/content/types";

const API_BASE = "https://api.unsplash.com";

interface UnsplashSearchPhoto {
  urls: { regular: string };
  width: number;
  height: number;
  alt_description: string | null;
  description: string | null;
  user: { name: string; links: { html: string } };
  links: { html: string; download_location: string };
}

function getAccessKey(): string | null {
  return process.env.UNSPLASH_ACCESS_KEY?.trim() || null;
}

/**
 * Searches Unsplash for a photo matching `query` and returns the
 * resolved metadata to cache, or null if no key is configured or the
 * request fails (callers should fall back to the Atmosphere treatment).
 *
 * Per Unsplash's API Guidelines, using a photo requires: (1) attributing
 * the photographer and Unsplash with a link back — see UnsplashCredit.tsx
 * — and (2) pinging `links.download_location` at the moment the photo is
 * put into use. We do that ping here, once, when the photo is resolved
 * for caching — not on every page view.
 */
export async function searchUnsplashImage(query: string): Promise<UnsplashImageMeta | null> {
  const accessKey = getAccessKey();
  if (!accessKey) {
    console.warn("[unsplash] UNSPLASH_ACCESS_KEY not set — skipping image fetch.");
    return null;
  }

  const searchUrl = `${API_BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&content_filter=high`;

  const res = await fetch(searchUrl, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (!res.ok) {
    console.warn(`[unsplash] search failed for "${query}": ${res.status} ${res.statusText}`);
    return null;
  }

  const data = (await res.json()) as { results: UnsplashSearchPhoto[] };
  const photo = data.results?.[0];
  if (!photo) {
    console.warn(`[unsplash] no results for "${query}"`);
    return null;
  }

  // Required by Unsplash's API Guidelines: ping download_location when a
  // photo is used, so the photographer gets credit for the download.
  try {
    await fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
  } catch {
    // Non-fatal — the photo is still usable even if this ping fails.
  }

  return {
    url: photo.urls.regular,
    width: photo.width,
    height: photo.height,
    altDescription: photo.alt_description || photo.description || query,
    query,
    photographerName: photo.user.name,
    photographerProfileUrl: `${photo.user.links.html}?utm_source=the_word_of_the_day&utm_medium=referral`,
    unsplashPhotoUrl: `${photo.links.html}?utm_source=the_word_of_the_day&utm_medium=referral`,
    fetchedAt: new Date().toISOString(),
  };
}
