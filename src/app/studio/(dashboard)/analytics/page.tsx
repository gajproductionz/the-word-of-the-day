import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

function startOfToday(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export default async function AnalyticsPage() {
  const today = startOfToday();
  // This is a dynamic (force-dynamic) Server Component — "now" is meant
  // to be computed fresh on every request, not memoized for idempotency.
  // eslint-disable-next-line react-hooks/purity
  const last30 = new Date(Date.now() - 30 * 86400000);

  const [
    todaysViews,
    uniqueSessionsToday,
    mostRead,
    topNeeds,
    emailSubscribers,
    pushSubscribers,
    wordReceivedCount,
    prayerSubmitted,
    prayerPrayed,
    shares,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: { type: "PAGE_VIEW", createdAt: { gte: today } } }),
    db.analyticsEvent
      .findMany({ where: { type: "PAGE_VIEW", createdAt: { gte: today } }, select: { sessionId: true }, distinct: ["sessionId"] })
      .then((rows) => rows.length),
    db.analyticsEvent.groupBy({
      by: ["devotionalId"],
      where: { type: "PAGE_VIEW", devotionalId: { not: null }, createdAt: { gte: last30 } },
      _count: { _all: true },
      orderBy: { _count: { devotionalId: "desc" } },
      take: 5,
    }),
    db.analyticsEvent.findMany({
      where: { type: "NEED_A_WORD_SELECTED", createdAt: { gte: last30 } },
      select: { metadata: true },
    }),
    db.subscriber.count({ where: { emailStatus: "SUBSCRIBED" } }),
    db.pushSubscription.count({ where: { revokedAt: null } }),
    db.analyticsEvent.count({ where: { type: "WORD_RECEIVED", createdAt: { gte: last30 } } }),
    db.analyticsEvent.count({ where: { type: "PRAYER_SUBMITTED", createdAt: { gte: last30 } } }),
    db.analyticsEvent.count({ where: { type: "PRAYER_PRAYED", createdAt: { gte: last30 } } }),
    db.analyticsEvent.count({ where: { type: "SHARE", createdAt: { gte: last30 } } }),
  ]);

  const mostReadTitles = await Promise.all(
    mostRead.map(async (row) => {
      const d = row.devotionalId ? await db.devotional.findUnique({ where: { id: row.devotionalId }, select: { title: true } }) : null;
      return { title: d?.title ?? "Unknown", count: row._count._all };
    })
  );

  const needCounts = new Map<string, number>();
  for (const event of topNeeds) {
    const need = (event.metadata as { need?: string } | null)?.need;
    if (need) needCounts.set(need, (needCounts.get(need) ?? 0) + 1);
  }
  const topNeedsSorted = Array.from(needCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-charcoal">Analytics</h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-charcoal/60">
        Are people actually engaging with the Word? Last 30 days unless noted.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "READERS TODAY", value: todaysViews },
          { label: "UNIQUE TODAY", value: uniqueSessionsToday },
          { label: "EMAIL SUBSCRIBERS", value: emailSubscribers },
          { label: "PUSH SUBSCRIBERS", value: pushSubscribers },
          { label: "I RECEIVED THIS WORD", value: wordReceivedCount },
          { label: "PRAYERS SUBMITTED", value: prayerSubmitted },
          { label: "PRAYERS PRAYED", value: prayerPrayed },
          { label: "SHARES", value: shares },
        ].map((stat) => (
          <div key={stat.label} className="rounded-sm border border-charcoal/10 px-4 py-4">
            <p className="font-serif text-2xl text-charcoal">{stat.value}</p>
            <p className="mt-1 font-sans text-[0.6rem] tracking-[0.1em] text-charcoal/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">MOST-READ WORDS</p>
          <div className="mt-3 space-y-2">
            {mostReadTitles.length === 0 ? (
              <p className="font-sans text-sm italic text-charcoal/40">No reads recorded yet.</p>
            ) : (
              mostReadTitles.map((m, i) => (
                <div key={i} className="flex items-center justify-between font-sans text-sm text-charcoal">
                  <span>{m.title}</span>
                  <span className="text-charcoal/50">{m.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">
            MOST-SELECTED NEEDS
          </p>
          <div className="mt-3 space-y-2">
            {topNeedsSorted.length === 0 ? (
              <p className="font-sans text-sm italic text-charcoal/40">No selections recorded yet.</p>
            ) : (
              topNeedsSorted.map(([need, count]) => (
                <div key={need} className="flex items-center justify-between font-sans text-sm text-charcoal">
                  <span className="capitalize">{need.replace(/-/g, " ")}</span>
                  <span className="text-charcoal/50">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
