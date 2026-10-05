import { db } from "@/lib/db";
import type { DevotionalStatus } from "@prisma/client";

const fullInclude = {
  topics: true,
  series: true,
  notifications: true,
} as const;

/**
 * Studio's "what's the current Word" — distinct from the public site's
 * getTodaysWord() because it needs to surface scheduled/draft states too,
 * so the dashboard always shows something actionable.
 */
export async function getStudioFeaturedDevotional() {
  const published = await db.devotional.findFirst({
    where: { status: "PUBLISHED", featured: true },
    include: fullInclude,
    orderBy: { date: "desc" },
  });
  if (published) return { devotional: published, state: "published" as const };

  const mostRecent = await db.devotional.findFirst({
    where: { status: "PUBLISHED" },
    include: fullInclude,
    orderBy: { date: "desc" },
  });
  if (mostRecent) return { devotional: mostRecent, state: "published" as const };

  const nextScheduled = await db.devotional.findFirst({
    where: { status: "SCHEDULED" },
    include: fullInclude,
    orderBy: { publishAt: "asc" },
  });
  if (nextScheduled) return { devotional: nextScheduled, state: "scheduled" as const };

  return { devotional: null, state: "none" as const };
}

export async function getDevotionalEngagement(devotionalId: string) {
  const events = await db.analyticsEvent.groupBy({
    by: ["type"],
    where: { devotionalId },
    _count: { _all: true },
  });
  const countFor = (type: string) => events.find((e) => e.type === type)?._count._all ?? 0;

  return {
    views: countFor("PAGE_VIEW"),
    wordReceived: countFor("WORD_RECEIVED"),
    prayerInteractions: countFor("PRAYER_PRAYED") + countFor("PRAYER_SUBMITTED"),
    shares: countFor("SHARE"),
  };
}

export interface DevotionalListFilters {
  status?: DevotionalStatus;
  query?: string;
}

export async function listDevotionals(filters: DevotionalListFilters = {}) {
  return db.devotional.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query } },
              { scriptureReference: { contains: filters.query } },
              { book: { contains: filters.query } },
            ],
          }
        : {}),
    },
    include: fullInclude,
    orderBy: { date: "desc" },
  });
}

export async function getDevotionalForEdit(id: string) {
  return db.devotional.findUnique({
    where: { id },
    include: fullInclude,
  });
}

export async function getDashboardCounts() {
  const [draft, scheduled, published, subscribers, newPrayers] = await Promise.all([
    db.devotional.count({ where: { status: "DRAFT" } }),
    db.devotional.count({ where: { status: "SCHEDULED" } }),
    db.devotional.count({ where: { status: "PUBLISHED" } }),
    db.subscriber.count({ where: { emailStatus: "SUBSCRIBED" } }),
    db.prayerRequest.count({ where: { status: "NEW" } }),
  ]);
  return { draft, scheduled, published, subscribers, newPrayers };
}
