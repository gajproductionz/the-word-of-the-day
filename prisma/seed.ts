/**
 * Populates a fresh database from the project's original static content
 * (src/content/devotionals.ts, series.ts, emotions.ts) plus the existing
 * prayers.json and unsplash-cache.json files, and creates the first
 * admin account from ADMIN_EMAIL/ADMIN_PASSWORD in .env.local.
 *
 * Safe to re-run: every write is an upsert keyed by the same unique
 * field (slug/email/etc.) the app itself uses.
 *
 * Usage: npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";
import { devotionals as seedDevotionals } from "../src/content/devotionals";
import { seriesList as seedSeries } from "../src/content/series";
import { emotionWords as seedEmotions } from "../src/content/emotions";
import { hashPassword } from "../src/lib/auth";

const db = new PrismaClient();

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation.");
    return;
  }
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — skipping.`);
    return;
  }
  const passwordHash = await hashPassword(password);
  await db.adminUser.create({
    data: { email, passwordHash, name: "George" },
  });
  console.log(`Created admin user ${email}.`);
}

async function seedTopics(): Promise<Map<string, string>> {
  const names = Array.from(new Set(seedDevotionals.flatMap((d) => d.topics)));
  const idByName = new Map<string, string>();
  for (const name of names) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const topic = await db.topic.upsert({
      where: { name },
      create: { name, slug },
      update: { slug },
    });
    idByName.set(name, topic.id);
  }
  console.log(`Seeded ${names.length} topics.`);
  return idByName;
}

async function seedSeriesList(): Promise<Map<string, string>> {
  const idBySlug = new Map<string, string>();
  for (const s of seedSeries) {
    const series = await db.series.upsert({
      where: { slug: s.slug },
      create: {
        slug: s.slug,
        title: s.title,
        description: s.description,
        totalDays: s.totalDays,
        status: "PUBLISHED",
      },
      update: {
        title: s.title,
        description: s.description,
        totalDays: s.totalDays,
      },
    });
    idBySlug.set(s.slug, series.id);
  }
  console.log(`Seeded ${seedSeries.length} series.`);
  return idBySlug;
}

async function seedDevotionalsList(topicIdByName: Map<string, string>, seriesIdBySlug: Map<string, string>) {
  let unsplashCache: Record<string, { query?: string }> = {};
  try {
    const raw = await fs.readFile(path.join(__dirname, "../src/data/unsplash-cache.json"), "utf-8");
    unsplashCache = JSON.parse(raw);
  } catch {
    // no cache yet — fine
  }

  for (const d of seedDevotionals) {
    await db.devotional.upsert({
      where: { slug: d.slug },
      create: {
        slug: d.slug,
        date: new Date(d.date + "T06:00:00.000Z"),
        title: d.title,
        book: d.book,
        chapter: d.chapter,
        verseStart: d.verseStart,
        verseEnd: d.verseEnd ?? null,
        scriptureReference: d.scriptureReference,
        scriptureText: d.scriptureText,
        keyMessage: d.keyMessage,
        reflection: d.reflection,
        reflectionQuestion: d.reflectionQuestion,
        prayer: d.prayer,
        topics: { connect: d.topics.map((t) => ({ id: topicIdByName.get(t) })) },
        seriesId: d.series ? seriesIdBySlug.get(d.series) : null,
        seriesDay: d.seriesDay ?? null,
        featuredImage: d.featuredImage,
        featuredImageAlt: d.featuredImageAlt,
        unsplashQuery: unsplashCache[d.slug]?.query ?? null,
        seoTitle: d.seoTitle,
        seoDescription: d.seoDescription,
        status: d.published ? "PUBLISHED" : "DRAFT",
        publishAt: d.published ? new Date(d.date + "T06:00:00.000Z") : null,
        featured: Boolean(d.featured),
      },
      update: {}, // Existing rows are left alone — Studio is now the source of truth.
    });
  }
  console.log(`Seeded ${seedDevotionals.length} devotionals.`);
}

async function seedNeedCategories() {
  for (const e of seedEmotions) {
    const category = await db.needCategory.upsert({
      where: { slug: e.slug },
      create: {
        slug: e.slug,
        label: e.label,
        scriptureReference: e.scriptureReference,
        scriptureText: e.scriptureText,
        encouragement: e.encouragement,
      },
      update: {},
    });
    const devotional = await db.devotional.findUnique({ where: { slug: e.devotionalSlug } });
    if (devotional) {
      await db.needCategoryDevotional.upsert({
        where: { needCategoryId_devotionalId: { needCategoryId: category.id, devotionalId: devotional.id } },
        create: { needCategoryId: category.id, devotionalId: devotional.id },
        update: {},
      });
    }
  }
  console.log(`Seeded ${seedEmotions.length} "I Need a Word" categories.`);
}

async function seedPrayers() {
  try {
    const raw = await fs.readFile(path.join(__dirname, "../src/data/prayers.json"), "utf-8");
    const prayers = JSON.parse(raw) as Array<{
      id: string;
      name: string;
      request: string;
      isPrivate: boolean;
      shareOnWall: boolean;
      prayerCount: number;
      createdAt: string;
    }>;
    for (const p of prayers) {
      const existing = await db.prayerRequest.findFirst({ where: { request: p.request, name: p.name } });
      if (existing) continue;
      await db.prayerRequest.create({
        data: {
          name: p.name,
          request: p.request,
          isPrivate: p.isPrivate,
          shareOnWall: p.shareOnWall,
          status: p.isPrivate ? "PRIVATE" : p.shareOnWall ? "APPROVED_FOR_WALL" : "NEW",
          prayerCount: p.prayerCount,
          createdAt: new Date(p.createdAt),
        },
      });
    }
    console.log(`Seeded ${prayers.length} prayer requests.`);
  } catch {
    console.warn("No existing prayers.json found — skipping.");
  }
}

async function seedSettings() {
  await db.settings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
}

async function main() {
  await seedAdminUser();
  const topicIdByName = await seedTopics();
  const seriesIdBySlug = await seedSeriesList();
  await seedDevotionalsList(topicIdByName, seriesIdBySlug);
  await seedNeedCategories();
  await seedPrayers();
  await seedSettings();
  console.log("\nSeed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
