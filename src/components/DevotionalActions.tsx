"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStreak, streakMilestones } from "@/lib/useStreak";
import ShareBar from "./ShareBar";

interface DevotionalActionsProps {
  slug: string;
  title: string;
}

const SAVED_KEY = "wordoftheday_saved";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function DevotionalActions({ slug, title }: DevotionalActionsProps) {
  const { streak, receivedToday, receiveToday, hydrated } = useStreak();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // One-time read of client-only localStorage after mount, to avoid a
    // server/client hydration mismatch — not syncing to an external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readSaved().includes(slug));
  }, [slug]);

  function toggleSave() {
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaved(next.includes(slug));
  }

  const nextMilestone = streakMilestones.find((m) => m.days > streak);

  return (
    <div className="space-y-8 border-t border-charcoal/10 pt-10">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={receiveToday}
          disabled={receivedToday}
          className={`rounded-full px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] transition-colors disabled:cursor-default ${
            receivedToday
              ? "bg-forest/10 text-forest"
              : "bg-forest text-ivory hover:bg-forest-light"
          }`}
        >
          {receivedToday ? "✓ YOU RECEIVED THIS WORD" : "I RECEIVED THIS WORD"}
        </button>

        <button
          type="button"
          onClick={toggleSave}
          aria-pressed={saved}
          className={`rounded-full border px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] transition-colors ${
            saved ? "border-gold bg-gold/10 text-gold-ink" : "border-charcoal/20 text-charcoal hover:border-forest hover:text-forest"
          }`}
        >
          {saved ? "SAVED" : "SAVE"}
        </button>

        <Link
          href="/prayer"
          className="rounded-full border border-charcoal/20 px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] text-charcoal transition-colors hover:border-forest hover:text-forest"
        >
          PRAY
        </Link>
      </div>

      {hydrated && receivedToday && streak > 0 && (
        <div className="animate-fade-up rounded-sm border border-gold/30 bg-gold/5 px-6 py-5">
          <p className="font-serif text-2xl text-charcoal">🔥 {streak} DAY{streak === 1 ? "" : "S"} STREAK</p>
          <p className="mt-1 font-sans text-sm text-charcoal/60">
            You&apos;ve spent {streak} consecutive day{streak === 1 ? "" : "s"} intentionally starting your day in the Word.
          </p>
          {nextMilestone && (
            <p className="mt-2 font-sans text-xs tracking-wide text-charcoal/60">
              Next milestone: {nextMilestone.days - streak} day{nextMilestone.days - streak === 1 ? "" : "s"} to &ldquo;{nextMilestone.label}&rdquo;
            </p>
          )}
        </div>
      )}

      <div>
        <p className="mb-3 font-sans text-xs font-medium tracking-[0.14em] text-charcoal/60">SHARE THIS WORD</p>
        <ShareBar title={title} url={`/devotional/${slug}`} />
      </div>
    </div>
  );
}
