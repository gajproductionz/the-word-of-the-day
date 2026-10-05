import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getStudioFeaturedDevotional, getDevotionalEngagement, getDashboardCounts } from "@/lib/studio/queries";
import { formatShortDate } from "@/lib/date";

export const metadata: Metadata = { title: "Studio" };
export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export default async function StudioHomePage() {
  const session = await getSession();
  const [{ devotional, state }, counts] = await Promise.all([
    getStudioFeaturedDevotional(),
    getDashboardCounts(),
  ]);
  const engagement = devotional ? await getDevotionalEngagement(devotional.id) : null;
  const firstName = (session?.name || "there").split(" ")[0];

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-4xl text-charcoal">GOOD MORNING, {firstName.toUpperCase()}.</h1>

      <section className="mt-12">
        <p className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-ink">TODAY&apos;S WORD</p>

        {!devotional ? (
          <div className="mt-5 rounded-sm border border-dashed border-charcoal/20 px-6 py-10 text-center">
            <p className="font-serif text-xl italic text-charcoal/60">
              Nothing published or scheduled yet.
            </p>
            <Link
              href="/studio/new"
              className="mt-5 inline-flex rounded-full bg-forest px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] text-ivory hover:bg-forest-light"
            >
              CREATE YOUR FIRST WORD →
            </Link>
          </div>
        ) : (
          <div className="mt-5 rounded-sm border border-charcoal/10 bg-ivory-deep/60 px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">{devotional.title}</h2>
                <p className="mt-1 font-sans text-sm text-charcoal/60">
                  {devotional.scriptureReference} · {formatShortDate(devotional.date.toISOString())}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 font-sans text-[0.65rem] font-semibold tracking-[0.1em] ${
                  state === "published" ? "bg-forest/10 text-forest" : "bg-gold/10 text-gold-ink"
                }`}
              >
                {statusLabel[devotional.status]?.toUpperCase()}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">EMAIL</dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">
                  {devotional.emailEnabled ? "Enabled" : "Off"}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">PUSH</dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">
                  {devotional.pushEnabled ? "Enabled" : "Off"}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">VIEWS</dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">{engagement?.views ?? 0}</dd>
              </div>
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">
                  I RECEIVED THIS WORD
                </dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">{engagement?.wordReceived ?? 0}</dd>
              </div>
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">PRAYER</dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">{engagement?.prayerInteractions ?? 0}</dd>
              </div>
              <div>
                <dt className="font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">SHARES</dt>
                <dd className="mt-1 font-sans text-sm text-charcoal">{engagement?.shares ?? 0}</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/studio/new"
                className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
              >
                CREATE TOMORROW&apos;S WORD
              </Link>
              <Link
                href={`/studio/devotionals/${devotional.id}`}
                className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest hover:text-forest"
              >
                EDIT TODAY&apos;S WORD
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest hover:text-forest"
              >
                PREVIEW WEBSITE ↗
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {[
          { label: "DRAFTS", value: counts.draft, href: "/studio/devotionals?status=DRAFT" },
          { label: "SCHEDULED", value: counts.scheduled, href: "/studio/devotionals?status=SCHEDULED" },
          { label: "PUBLISHED", value: counts.published, href: "/studio/devotionals?status=PUBLISHED" },
          { label: "SUBSCRIBERS", value: counts.subscribers, href: "/studio/subscribers" },
          { label: "NEW PRAYERS", value: counts.newPrayers, href: "/studio/prayers" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-sm border border-charcoal/10 px-4 py-5 transition-colors hover:border-forest/40"
          >
            <p className="font-serif text-3xl text-charcoal">{stat.value}</p>
            <p className="mt-1 font-sans text-[0.65rem] tracking-[0.1em] text-charcoal/50">{stat.label}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
