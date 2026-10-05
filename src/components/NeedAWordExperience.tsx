"use client";

import { useState } from "react";
import Link from "next/link";
import type { EmotionWord } from "@/content/types";
import RevealText from "./RevealText";

interface NeedAWordExperienceProps {
  emotions: EmotionWord[];
}

export default function NeedAWordExperience({ emotions }: NeedAWordExperienceProps) {
  const [selected, setSelected] = useState<EmotionWord | null>(null);
  const [excluded, setExcluded] = useState<string[]>([]);

  function pick(e: EmotionWord) {
    setSelected(e);
    setExcluded([e.slug]);
  }

  function another() {
    if (!selected) return;
    const pool = emotions.filter((e) => !excluded.includes(e.slug));
    const next = pool[Math.floor(Math.random() * pool.length)] ?? selected;
    setSelected(next);
    setExcluded((prev) => [...prev, next.slug]);
  }

  if (selected) {
    return (
      <div key={selected.slug} className="animate-fade-up">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">
          HERE&apos;S A WORD FOR YOU.
        </p>
        <p className="mt-6 font-sans text-sm font-medium tracking-[0.1em] text-charcoal/60">
          {selected.scriptureReference} — KJV
        </p>
        <RevealText
          as="blockquote"
          text={`“${selected.scriptureText}”`}
          stagger={20}
          className="mt-4 block max-w-2xl border-l-2 border-gold/50 pl-6 font-serif text-2xl italic leading-relaxed text-charcoal sm:text-3xl"
        />
        <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-charcoal/80">
          {selected.encouragement}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={`/devotional/${selected.devotionalSlug}`}
            className="rounded-full bg-forest px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-ivory transition-colors hover:bg-forest-light"
          >
            READ THIS WORD →
          </Link>
          <button
            type="button"
            onClick={another}
            className="rounded-full border border-charcoal/20 px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-charcoal transition-colors hover:border-forest hover:text-forest"
          >
            GIVE ME ANOTHER WORD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-5 sm:gap-x-7 sm:gap-y-6">
      {emotions.map((e, i) => (
        <button
          key={e.slug}
          type="button"
          onClick={() => pick(e)}
          className="group font-serif text-charcoal transition-colors hover:text-forest"
          style={{ fontSize: `${1.15 + (i % 4) * 0.28}rem` }}
        >
          <span className="border-b border-transparent pb-0.5 italic transition-colors group-hover:border-forest">
            {e.label}
          </span>
        </button>
      ))}
    </div>
  );
}
