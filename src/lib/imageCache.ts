import { promises as fs } from "fs";
import path from "path";
import type { UnsplashImageMeta } from "@/content/types";

const CACHE_PATH = path.join(process.cwd(), "src/data/unsplash-cache.json");

type ImageCache = Record<string, UnsplashImageMeta>;

let memoCache: ImageCache | null = null;

async function readCacheFile(): Promise<ImageCache> {
  try {
    const raw = await fs.readFile(CACHE_PATH, "utf-8");
    return JSON.parse(raw) as ImageCache;
  } catch {
    return {};
  }
}

/**
 * Resolved Unsplash images are read from a build-time JSON cache
 * (src/data/unsplash-cache.json), keyed by devotional slug — populated
 * by `npm run fetch-images`, not fetched live on each request. This
 * keeps pages fast and static, and avoids hitting Unsplash's hourly
 * rate limit under real traffic.
 */
export async function getCachedImage(slug: string): Promise<UnsplashImageMeta | null> {
  if (!memoCache) {
    memoCache = await readCacheFile();
  }
  return memoCache[slug] ?? null;
}

export async function writeCachedImage(slug: string, image: UnsplashImageMeta): Promise<void> {
  const current = await readCacheFile();
  current[slug] = image;
  await fs.writeFile(CACHE_PATH, JSON.stringify(current, null, 2) + "\n", "utf-8");
  memoCache = current;
}
