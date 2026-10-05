import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import CreateSeriesForm from "@/components/studio/CreateSeriesForm";

export const metadata: Metadata = { title: "Series" };
export const dynamic = "force-dynamic";

export default async function SeriesListPage() {
  const series = await db.series.findMany({
    include: { devotionals: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-charcoal">Series</h1>
        <CreateSeriesForm />
      </div>

      <div className="mt-8 divide-y divide-charcoal/10 border-t border-charcoal/10">
        {series.map((s) => (
          <Link
            key={s.id}
            href={`/studio/series/${s.slug}`}
            className="flex items-center justify-between gap-4 py-4 hover:bg-charcoal/5"
          >
            <div>
              <p className="font-serif text-lg text-charcoal">{s.title}</p>
              <p className="font-sans text-xs text-charcoal/50">
                {s.devotionals.length} of {s.totalDays} days · {s.status}
              </p>
            </div>
            <span className="font-sans text-xs text-charcoal/40">MANAGE →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
