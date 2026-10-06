"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../Reveal";

/**
 * Each word carries its own glow color — hovering/tapping one quietly
 * shifts the section's light to match, so choosing a word feels like
 * naming where you are rather than picking an item off a list.
 */
const words: { label: string; glow: string }[] = [
  { label: "DISCOURAGED", glow: "100,110,130" },
  { label: "ANXIOUS", glow: "90,140,150" },
  { label: "WAITING", glow: "130,120,150" },
  { label: "GRATEFUL", glow: "201,165,104" },
  { label: "ALONE", glow: "80,90,130" },
  { label: "HOPEFUL", glow: "214,170,90" },
  { label: "PEACE", glow: "120,150,130" },
  { label: "DIRECTION", glow: "201,165,104" },
  { label: "HEARTBROKEN", glow: "150,100,100" },
  { label: "PURPOSE", glow: "180,140,80" },
];

export default function NeedAWordPreview() {
  const [active, setActive] = useState<string | null>(null);
  const activeGlow = words.find((w) => w.label === active)?.glow;

  return (
    <section className="relative overflow-hidden bg-near-black px-5 py-28 sm:px-10 sm:py-36">
      <div className="grain" aria-hidden="true" />
      {/* The one atmosphere shift in this section — color only, so it
          reads as "the light changed" rather than a decoration moving. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full transition-[opacity,background] duration-700 ease-out"
        style={{
          background: activeGlow
            ? `radial-gradient(closest-side, rgba(${activeGlow},0.35) 0%, rgba(${activeGlow},0.08) 45%, transparent 75%)`
            : undefined,
          opacity: activeGlow ? 1 : 0,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="rule-gold w-8" aria-hidden="true" />
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
              WHAT ARE YOU FACING?
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.08] text-ivory sm:text-6xl">
            Whatever you&apos;re carrying, there is Scripture for it.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div
            className="mt-12 flex flex-wrap gap-x-6 gap-y-4"
            onMouseLeave={() => setActive(null)}
          >
            {words.map((w, i) => (
              <button
                key={w.label}
                type="button"
                onMouseEnter={() => setActive(w.label)}
                onFocus={() => setActive(w.label)}
                onBlur={() => setActive(null)}
                onTouchStart={() => setActive(w.label)}
                className="font-serif italic transition-all duration-500 ease-out"
                style={{
                  fontSize: `${1.1 + (i % 3) * 0.4}rem`,
                  color:
                    active === null
                      ? "rgba(247,243,236,0.3)"
                      : active === w.label
                        ? "#f7f3ec"
                        : "rgba(247,243,236,0.14)",
                  transform: active === w.label ? "scale(1.08)" : "scale(1)",
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <Link
            href="/need-a-word"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-4 font-sans text-xs font-semibold tracking-[0.14em] text-near-black transition-opacity hover:opacity-90"
          >
            I NEED A WORD →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
