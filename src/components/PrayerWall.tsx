"use client";

import { useEffect, useState } from "react";
import type { PrayerRequest } from "@/content/types";

const PRAYED_KEY = "wordoftheday_prayed_for";

function readPrayedFor(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(PRAYED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function PrayerWall({ initialPrayers }: { initialPrayers: PrayerRequest[] }) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [prayedFor, setPrayedFor] = useState<string[]>([]);

  useEffect(() => {
    // One-time read of client-only localStorage after mount, to avoid a
    // server/client hydration mismatch — not syncing to an external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrayedFor(readPrayedFor());
  }, []);

  async function handlePray(id: string) {
    if (prayedFor.includes(id)) return;

    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, prayerCount: p.prayerCount + 1 } : p))
    );
    const next = [...prayedFor, id];
    setPrayedFor(next);
    try {
      window.localStorage.setItem(PRAYED_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable — count still updates server-side
    }

    try {
      await fetch(`/api/prayer/${id}/pray`, { method: "POST" });
    } catch {
      // network failure — optimistic update stands for this session
    }
  }

  if (prayers.length === 0) {
    return (
      <p className="font-serif text-xl italic text-charcoal/60">
        The Prayer Wall is quiet right now — be the first to share a request.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {prayers.map((p) => {
        const already = prayedFor.includes(p.id);
        return (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-sm border border-charcoal/10 bg-white/50 px-6 py-7"
          >
            <p className="font-serif text-lg italic leading-relaxed text-charcoal">
              &ldquo;{p.request}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-between">
              <p className="font-sans text-xs tracking-wide text-charcoal/60">— {p.name}</p>
              <button
                type="button"
                onClick={() => handlePray(p.id)}
                disabled={already}
                className={`rounded-full border px-4 py-2 font-sans text-xs font-medium tracking-wide transition-colors ${
                  already
                    ? "border-forest/30 bg-forest/10 text-forest"
                    : "border-charcoal/20 text-charcoal/70 hover:border-forest hover:text-forest"
                }`}
              >
                🙏 {p.prayerCount} {already ? "PRAYED" : "I PRAYED FOR YOU"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
