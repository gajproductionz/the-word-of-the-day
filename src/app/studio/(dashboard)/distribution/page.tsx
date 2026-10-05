import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import RetryNotificationButton from "@/components/studio/RetryNotificationButton";

export const metadata: Metadata = { title: "Distribution" };
export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  NOT_SCHEDULED: "bg-charcoal/5 text-charcoal/50",
  SCHEDULED: "bg-gold/10 text-gold-ink",
  SENDING: "bg-gold/20 text-gold-ink",
  SENT: "bg-forest/10 text-forest",
  PARTIALLY_FAILED: "bg-red-700/10 text-red-700",
  FAILED: "bg-red-700/10 text-red-700",
};

export default async function DistributionPage() {
  const notifications = await db.notificationLog.findMany({
    include: { devotional: { select: { id: true, title: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-charcoal">Distribution</h1>
      <p className="mt-2 max-w-xl font-sans text-sm text-charcoal/60">
        Every channel is queued independently when a Word publishes — a failure in one never blocks the
        others, and a devotional is never duplicate-sent on retry. Actual delivery currently runs through
        the console provider (see <code className="rounded bg-charcoal/5 px-1">src/lib/email/providers</code>) —
        connect a real provider there when ready.
      </p>

      <div className="mt-8 divide-y divide-charcoal/10 border-t border-charcoal/10">
        {notifications.length === 0 ? (
          <p className="py-10 text-center font-serif text-lg italic text-charcoal/50">
            Nothing queued yet — publish a Word to see its distribution here.
          </p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link href={`/studio/devotionals/${n.devotional.id}`} className="font-sans text-sm text-charcoal hover:text-forest">
                  {n.devotional.title}
                </Link>
                <p className="font-sans text-xs text-charcoal/50">
                  {n.channel} · {n.scheduledAt ? new Date(n.scheduledAt).toLocaleString() : "immediate"}
                  {n.errorMessage && <span className="text-red-700"> · {n.errorMessage}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 font-sans text-[0.65rem] font-semibold ${statusStyle[n.status]}`}>
                  {n.status.replace(/_/g, " ")}
                </span>
                {(n.status === "FAILED" || n.status === "PARTIALLY_FAILED") && (
                  <RetryNotificationButton id={n.id} />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
