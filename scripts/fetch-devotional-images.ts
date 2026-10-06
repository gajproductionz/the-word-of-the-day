/**
 * Automatically sources a fitting Unsplash photo for every devotional
 * that doesn't have one cached yet, based on its topic (or an explicit
 * `unsplashQuery` override) — so adding tomorrow's Word (or importing an
 * archive, or anything else written in Studio) never requires manually
 * finding a photo.
 *
 * Reads devotionals straight from the database — the content layer's
 * single source of truth since the Studio migration — not a static file,
 * so this always covers every devotional that actually exists, including
 * ones Studio created after this script was last run.
 *
 * Usage:
 *   npm run fetch-images          # only resolve devotionals missing an image
 *   npm run fetch-images -- --force   # re-resolve every devotional
 *
 * Requires UNSPLASH_ACCESS_KEY in .env.local (see README.md).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { getImageQuery } from "../src/lib/imageQuery";
import { searchUnsplashImage } from "../src/lib/unsplash";
import { getCachedImage, writeCachedImage } from "../src/lib/imageCache";
import type { Topic } from "../src/content/types";

const db = new PrismaClient();

async function main() {
  const force = process.argv.includes("--force");

  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) {
    console.error(
      "UNSPLASH_ACCESS_KEY is not set. Add it to .env.local — see README.md for how to get a free key."
    );
    process.exit(1);
  }

  const devotionals = await db.devotional.findMany({
    include: { topics: true },
    orderBy: { date: "desc" },
  });

  let resolved = 0;
  let skipped = 0;
  let failed = 0;

  for (const devotional of devotionals) {
    const existing = force ? null : await getCachedImage(devotional.slug);
    if (existing) {
      skipped++;
      continue;
    }

    const query = getImageQuery({
      topics: devotional.topics.map((t) => t.name) as Topic[],
      unsplashQuery: devotional.unsplashQuery ?? undefined,
    });
    console.log(`Searching "${query}" for "${devotional.title}"…`);

    try {
      const image = await searchUnsplashImage(query);
      if (!image) {
        console.warn(`  ✗ No image found for "${devotional.title}" — will keep its Atmosphere fallback.`);
        failed++;
        continue;
      }
      await writeCachedImage(devotional.slug, image);
      console.log(`  ✓ Cached photo by ${image.photographerName}`);
      resolved++;
    } catch (err) {
      console.error(`  ✗ Failed for "${devotional.title}":`, err);
      failed++;
    }

    // Be a good citizen of Unsplash's rate limit (50 req/hr on demo keys).
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. ${resolved} resolved, ${skipped} already cached, ${failed} failed.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
