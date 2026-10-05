"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SeriesDevotional {
  id: string;
  title: string;
  seriesDay: number | null;
  status: string;
}

interface SeriesManagerProps {
  seriesId: string;
  seriesSlug: string;
  title: string;
  description: string;
  totalDays: number;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  devotionals: SeriesDevotional[];
  unassigned: { id: string; title: string }[];
}

export default function SeriesManager({
  seriesId,
  seriesSlug,
  title: initialTitle,
  description: initialDescription,
  totalDays: initialTotalDays,
  status: initialStatus,
  devotionals,
  unassigned,
}: SeriesManagerProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [totalDays, setTotalDays] = useState(initialTotalDays);
  const [status, setStatus] = useState(initialStatus);
  const [selectedToAdd, setSelectedToAdd] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveMeta() {
    setSaving(true);
    await fetch(`/api/studio/series/${seriesId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, totalDays }),
    });
    setSaving(false);
    router.refresh();
  }

  async function togglePublish() {
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setStatus(next);
    await fetch(`/api/studio/series/${seriesId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  async function updateDay(devotionalId: string, day: number) {
    await fetch(`/api/studio/devotionals/${devotionalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seriesSlug, seriesDay: day }),
    });
    router.refresh();
  }

  async function removeFromSeries(devotionalId: string) {
    await fetch(`/api/studio/devotionals/${devotionalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seriesSlug: null, seriesDay: null }),
    });
    router.refresh();
  }

  async function addToSeries() {
    if (!selectedToAdd) return;
    const nextDay = devotionals.length > 0 ? Math.max(...devotionals.map((d) => d.seriesDay ?? 0)) + 1 : 1;
    await updateDay(selectedToAdd, nextDay);
    setSelectedToAdd("");
  }

  return (
    <div className="max-w-3xl">
      <Link href="/studio/series" className="font-sans text-xs text-charcoal/50 hover:text-forest">
        ← ALL SERIES
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">TITLE</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-2.5 font-serif text-xl outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
            TOTAL DAYS
          </label>
          <input
            type="number"
            value={totalDays}
            onChange={(e) => setTotalDays(Number(e.target.value))}
            className="mt-1 w-24 rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2.5 font-sans text-sm outline-none focus:border-forest"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
          DESCRIPTION
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-4 py-2.5 font-sans text-sm outline-none focus:border-forest"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={saveMeta}
          disabled={saving}
          className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest disabled:opacity-60"
        >
          {saving ? "SAVING…" : "SAVE DETAILS"}
        </button>
        <button
          type="button"
          onClick={togglePublish}
          className={`rounded-full px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] ${
            status === "PUBLISHED" ? "border border-charcoal/20 text-charcoal" : "bg-forest text-ivory"
          }`}
        >
          {status === "PUBLISHED" ? "UNPUBLISH SERIES" : "PUBLISH SERIES"}
        </button>
      </div>

      <div className="mt-10">
        <p className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">DAYS</p>
        <div className="mt-3 space-y-2">
          {devotionals
            .slice()
            .sort((a, b) => (a.seriesDay ?? 0) - (b.seriesDay ?? 0))
            .map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-sm border border-charcoal/10 px-4 py-3">
                <input
                  type="number"
                  defaultValue={d.seriesDay ?? 0}
                  onBlur={(e) => updateDay(d.id, Number(e.target.value))}
                  className="w-16 rounded-sm border border-charcoal/20 bg-white/60 px-2 py-1 text-center font-sans text-sm outline-none focus:border-forest"
                />
                <Link href={`/studio/devotionals/${d.id}`} className="flex-1 font-sans text-sm text-charcoal hover:text-forest">
                  {d.title}
                </Link>
                <span className="font-sans text-[0.65rem] text-charcoal/40">{d.status}</span>
                <button
                  type="button"
                  onClick={() => removeFromSeries(d.id)}
                  className="font-sans text-xs text-charcoal/40 hover:text-red-700"
                >
                  REMOVE
                </button>
              </div>
            ))}
        </div>

        <div className="mt-4 flex gap-3">
          <select
            value={selectedToAdd}
            onChange={(e) => setSelectedToAdd(e.target.value)}
            className="flex-1 rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
          >
            <option value="">Add an existing devotional…</option>
            {unassigned.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addToSeries}
            disabled={!selectedToAdd}
            className="rounded-full bg-forest px-5 py-2 font-sans text-xs font-semibold tracking-[0.1em] text-ivory disabled:opacity-50"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
