"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NeedCategoryRowProps {
  id: string;
  label: string;
  scriptureReference: string;
  assigned: { id: string; title: string }[];
  available: { id: string; title: string }[];
}

export default function NeedCategoryRow({ id, label, scriptureReference, assigned, available }: NeedCategoryRowProps) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  async function add() {
    if (!selected) return;
    setLoading(true);
    await fetch(`/api/studio/need-a-word/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devotionalId: selected }),
    });
    setLoading(false);
    setSelected("");
    router.refresh();
  }

  async function remove(devotionalId: string) {
    setLoading(true);
    await fetch(`/api/studio/need-a-word/${id}?devotionalId=${devotionalId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <details className="rounded-sm border border-charcoal/10 p-4">
      <summary className="flex cursor-pointer items-center justify-between font-sans text-sm font-semibold text-charcoal">
        <span>{label}</span>
        <span className="font-sans text-xs font-normal text-charcoal/40">
          {assigned.length} Word{assigned.length === 1 ? "" : "s"} · {scriptureReference}
        </span>
      </summary>
      <div className="mt-4 space-y-2">
        {assigned.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-sm bg-charcoal/5 px-3 py-2">
            <Link href={`/studio/devotionals/${d.id}`} className="font-sans text-sm text-charcoal hover:text-forest">
              {d.title}
            </Link>
            <button
              type="button"
              onClick={() => remove(d.id)}
              disabled={loading}
              className="font-sans text-xs text-charcoal/40 hover:text-red-700"
            >
              REMOVE
            </button>
          </div>
        ))}
        {assigned.length === 0 && (
          <p className="font-sans text-sm italic text-charcoal/40">No Words linked yet.</p>
        )}

        <div className="flex gap-2 pt-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex-1 rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
          >
            <option value="">Link a devotional…</option>
            {available.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={add}
            disabled={!selected || loading}
            className="rounded-full bg-forest px-4 py-2 font-sans text-xs font-semibold text-ivory disabled:opacity-50"
          >
            ADD
          </button>
        </div>
      </div>
    </details>
  );
}
