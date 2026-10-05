"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSeriesForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch("/api/studio/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, totalDays }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) router.push(`/studio/series/${data.series.slug}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
      >
        CREATE SERIES
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-charcoal/10 bg-ivory-deep/60 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">TITLE</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="7 Days of Faith"
            className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
          />
        </div>
        <div>
          <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
            NUMBER OF DAYS
          </label>
          <input
            type="number"
            value={totalDays}
            onChange={(e) => setTotalDays(Number(e.target.value))}
            className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
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
          className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
        />
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light disabled:opacity-60"
        >
          {loading ? "CREATING…" : "CREATE"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
