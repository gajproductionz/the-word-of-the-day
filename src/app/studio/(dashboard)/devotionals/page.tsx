import type { Metadata } from "next";
import Link from "next/link";
import { listDevotionals } from "@/lib/studio/queries";
import { formatShortDate } from "@/lib/date";
import DevotionalRowActions from "@/components/studio/DevotionalRowActions";
import type { DevotionalStatus } from "@prisma/client";

export const metadata: Metadata = { title: "Devotionals" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

const statuses: DevotionalStatus[] = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];

export default async function DevotionalsListPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;
  const devotionals = await listDevotionals({
    status: status && statuses.includes(status as DevotionalStatus) ? (status as DevotionalStatus) : undefined,
    query: q,
  });

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-charcoal">Devotionals</h1>
        <Link
          href="/studio/new"
          className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
        >
          NEW WORD
        </Link>
      </div>

      <form method="get" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search title, Scripture, book…"
          className="w-full max-w-sm rounded-full border border-charcoal/20 bg-white/60 px-4 py-2 font-sans text-sm outline-none focus:border-forest"
        />
        <input type="hidden" name="status" value={status ?? ""} />
        <button
          type="submit"
          className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold text-charcoal hover:border-forest"
        >
          SEARCH
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/studio/devotionals${q ? `?q=${q}` : ""}`}
          className={`rounded-full border px-4 py-1.5 font-sans text-xs ${
            !status ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/studio/devotionals?status=${s}${q ? `&q=${q}` : ""}`}
            className={`rounded-full border px-4 py-1.5 font-sans text-xs ${
              status === s ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="mt-8 divide-y divide-charcoal/10 border-t border-charcoal/10">
        {devotionals.length === 0 ? (
          <p className="py-10 text-center font-serif text-lg italic text-charcoal/50">No devotionals found.</p>
        ) : (
          devotionals.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <p className="font-serif text-lg text-charcoal">{d.title}</p>
                <p className="font-sans text-xs text-charcoal/50">
                  {d.scriptureReference} · {formatShortDate(d.date.toISOString())} ·{" "}
                  <span className="font-semibold">{d.status}</span>
                </p>
              </div>
              <DevotionalRowActions id={d.id} status={d.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
