import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Calendar" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ year?: string; month?: string }>;
}

const statusColor: Record<string, string> = {
  PUBLISHED: "bg-forest/10 text-forest border-forest/30",
  SCHEDULED: "bg-gold/10 text-gold-ink border-gold/30",
  DRAFT: "bg-charcoal/5 text-charcoal/60 border-charcoal/20",
  ARCHIVED: "bg-charcoal/5 text-charcoal/40 border-charcoal/10",
};

export default async function CalendarPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const now = new Date();
  const year = sp.year ? Number(sp.year) : now.getUTCFullYear();
  const month = sp.month ? Number(sp.month) : now.getUTCMonth(); // 0-indexed

  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));
  const firstWeekday = monthStart.getUTCDay();
  const daysInMonth = monthEnd.getUTCDate();

  const devotionals = await db.devotional.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
    select: { id: true, title: true, status: true, date: true },
  });
  const byDay = new Map<number, (typeof devotionals)[number][]>();
  for (const d of devotionals) {
    const day = d.date.getUTCDate();
    byDay.set(day, [...(byDay.get(day) ?? []), d]);
  }

  const monthLabel = monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  const prevMonth = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  const nextMonth = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };

  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-charcoal">{monthLabel}</h1>
        <div className="flex gap-2">
          <Link
            href={`/studio/calendar?year=${prevMonth.year}&month=${prevMonth.month}`}
            className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold text-charcoal hover:border-forest"
          >
            ← PREV
          </Link>
          <Link
            href={`/studio/calendar?year=${nextMonth.year}&month=${nextMonth.month}`}
            className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold text-charcoal hover:border-forest"
          >
            NEXT →
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-px overflow-hidden rounded-sm border border-charcoal/10 bg-charcoal/10">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="bg-ivory-deep px-2 py-2 text-center font-sans text-[0.65rem] font-semibold text-charcoal/50">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="min-h-[100px] bg-ivory/50" />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayDevotionals = byDay.get(day) ?? [];
          return (
            <div key={i} className="min-h-[100px] bg-ivory p-2">
              <p className="font-sans text-xs text-charcoal/40">{day}</p>
              {dayDevotionals.length === 0 ? (
                <Link
                  href={`/studio/new?date=${dateStr}`}
                  className="mt-2 block font-sans text-[0.65rem] text-charcoal/30 hover:text-forest"
                >
                  + Create Word
                </Link>
              ) : (
                <div className="mt-1 space-y-1">
                  {dayDevotionals.map((d) => (
                    <Link
                      key={d.id}
                      href={`/studio/devotionals/${d.id}`}
                      className={`block truncate rounded border px-1.5 py-1 font-sans text-[0.65rem] ${statusColor[d.status]}`}
                      title={d.title}
                    >
                      {d.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
