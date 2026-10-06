import Link from "next/link";
import type { DevotionalWithImage } from "@/lib/resolveImage";
import DevotionalImage from "../DevotionalImage";
import Reveal from "../Reveal";
import RevealText from "../RevealText";

export default function TodaysWord({ devotional }: { devotional: DevotionalWithImage }) {
  const d = devotional;
  /** "ROMANS 8:28" → "8:28" — the editorial numeral watermark behind the verse. */
  const verseNumber = d.scriptureReference.match(/\d+:\d+/)?.[0];

  return (
    <section id="todays-word" className="relative overflow-hidden bg-ivory px-5 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="rule-gold w-8" aria-hidden="true" />
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">TODAY&apos;S WORD</p>
          </div>
        </Reveal>

        <div className="relative mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-7">
            {verseNumber && (
              <p
                className="ghost-word pointer-events-none absolute -top-6 left-0 select-none font-serif text-[9rem] text-gold/[0.08] sm:-top-10 sm:text-[13rem]"
                aria-hidden="true"
              >
                {verseNumber}
              </p>
            )}
            <RevealText
              as="h2"
              text={d.title}
              className="relative font-serif text-5xl leading-[1.02] tracking-tight text-charcoal sm:text-6xl lg:text-7xl"
            />

            <Reveal delay={0.1}>
              <p className="relative mt-8 font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
                {d.scriptureReference} — KJV
              </p>
            </Reveal>
            <RevealText
              as="blockquote"
              text={`“${d.scriptureText}”`}
              stagger={22}
              className="relative mt-4 block max-w-2xl border-l-2 border-gold/50 pl-6 font-serif text-2xl italic leading-relaxed text-charcoal/90 sm:text-[1.7rem]"
            />

            <Reveal delay={0.3}>
              <div className="mt-10">
                <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">KEY MESSAGE</p>
                <p className="mt-3 max-w-xl font-serif text-xl leading-snug text-forest sm:text-2xl">
                  {d.keyMessage}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <Link
                href={`/devotional/${d.slug}`}
                className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.1em] text-charcoal underline-offset-4 transition-colors hover:text-forest"
              >
                READ THE FULL WORD →
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.2} className="h-full">
              <DevotionalImage
                image={d.resolvedImage}
                className="aspect-[4/5] w-full rounded-sm lg:aspect-auto lg:h-full lg:min-h-[420px]"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
