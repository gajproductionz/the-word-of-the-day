import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/date";

export const metadata: Metadata = { title: "Subscribers" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function SubscribersPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams;

  // Dynamic (force-dynamic) Server Component — "now" is meant to be
  // computed fresh on every request.
  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

  const [subscribers, total, subscribed, unsubscribed, last30Days] = await Promise.all([
    db.subscriber.findMany({
      where: {
        ...(q ? { email: { contains: q } } : {}),
        ...(status === "SUBSCRIBED" || status === "UNSUBSCRIBED" ? { emailStatus: status } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.subscriber.count(),
    db.subscriber.count({ where: { emailStatus: "SUBSCRIBED" } }),
    db.subscriber.count({ where: { emailStatus: "UNSUBSCRIBED" } }),
    db.subscriber.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-charcoal">Subscribers</h1>
        <a
          href="/api/studio/subscribers/export"
          className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest hover:text-forest"
        >
          EXPORT CSV
        </a>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "TOTAL", value: total },
          { label: "SUBSCRIBED", value: subscribed },
          { label: "UNSUBSCRIBED", value: unsubscribed },
          { label: "NEW (30 DAYS)", value: last30Days },
        ].map((stat) => (
          <div key={stat.label} className="rounded-sm border border-charcoal/10 px-4 py-4">
            <p className="font-serif text-2xl text-charcoal">{stat.value}</p>
            <p className="mt-1 font-sans text-[0.6rem] tracking-[0.1em] text-charcoal/50">{stat.label}</p>
          </div>
        ))}
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search email…"
          className="w-full max-w-sm rounded-full border border-charcoal/20 bg-white/60 px-4 py-2 font-sans text-sm outline-none focus:border-forest"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-full border border-charcoal/20 bg-white/60 px-4 py-2 font-sans text-sm outline-none focus:border-forest"
        >
          <option value="">All statuses</option>
          <option value="SUBSCRIBED">Subscribed</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>
        <button
          type="submit"
          className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold text-charcoal hover:border-forest"
        >
          FILTER
        </button>
      </form>

      <div className="mt-8 divide-y divide-charcoal/10 border-t border-charcoal/10">
        {subscribers.length === 0 ? (
          <p className="py-10 text-center font-serif text-lg italic text-charcoal/50">No subscribers found.</p>
        ) : (
          subscribers.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-sans text-sm text-charcoal">{s.email}</p>
                <p className="font-sans text-xs text-charcoal/50">
                  {s.source} · joined {formatShortDate(s.createdAt.toISOString())}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-sans text-[0.65rem] font-semibold ${
                  s.emailStatus === "SUBSCRIBED" ? "bg-forest/10 text-forest" : "bg-charcoal/10 text-charcoal/50"
                }`}
              >
                {s.emailStatus}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
