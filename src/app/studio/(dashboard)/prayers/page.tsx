import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/date";
import PrayerStatusControl from "@/components/studio/PrayerStatusControl";

export const metadata: Metadata = { title: "Prayers" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const statuses = ["NEW", "PRAYED_FOR", "APPROVED_FOR_WALL", "PRIVATE", "ARCHIVED"] as const;

const statusStyle: Record<string, string> = {
  NEW: "bg-gold/10 text-gold-ink",
  PRAYED_FOR: "bg-forest/10 text-forest",
  APPROVED_FOR_WALL: "bg-forest/20 text-forest",
  PRIVATE: "bg-charcoal/10 text-charcoal/60",
  ARCHIVED: "bg-charcoal/5 text-charcoal/40",
};

export default async function PrayersPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const filterStatus = status && statuses.includes(status as (typeof statuses)[number]) ? status : undefined;

  const prayers = await db.prayerRequest.findMany({
    where: filterStatus ? { status: filterStatus as (typeof statuses)[number] } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-charcoal">Prayer Requests</h1>
      <p className="mt-2 font-sans text-sm text-charcoal/60">
        Nothing reaches the public Prayer Wall until you approve it here.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/studio/prayers"
          className={`rounded-full border px-4 py-1.5 font-sans text-xs ${
            !filterStatus ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/studio/prayers?status=${s}`}
            className={`rounded-full border px-4 py-1.5 font-sans text-xs ${
              filterStatus === s ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {prayers.length === 0 ? (
          <p className="py-10 text-center font-serif text-lg italic text-charcoal/50">No prayer requests here.</p>
        ) : (
          prayers.map((p) => (
            <div key={p.id} className="rounded-sm border border-charcoal/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg italic text-charcoal">&ldquo;{p.request}&rdquo;</p>
                  <p className="mt-1 font-sans text-xs text-charcoal/50">
                    — {p.name} · {formatShortDate(p.createdAt.toISOString())}
                    {p.isPrivate && " · marked private by requester"}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 font-sans text-[0.65rem] font-semibold ${statusStyle[p.status]}`}>
                  {p.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-4">
                <PrayerStatusControl id={p.id} status={p.status} isPrivate={p.isPrivate} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
