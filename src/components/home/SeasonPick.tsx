import Link from "next/link";
import type { DevotionalWithImage } from "@/lib/resolveImage";
import DevotionalImage from "../DevotionalImage";
import Reveal from "../Reveal";
import RevealText from "../RevealText";

export default function SeasonPick({ devotional }: { devotional: DevotionalWithImage }) {
  const d = devotional;
  return (
    <section className="relative isolate overflow-hidden px-5 py-28 sm:px-10 sm:py-36">
      <DevotionalImage image={d.resolvedImage} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-near-black/55" />
      </DevotionalImage>

      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
            A WORD FOR THIS SEASON
          </p>
        </Reveal>
        <RevealText
          as="h2"
          text={d.title}
          className="mt-6 block max-w-3xl font-serif text-4xl leading-[1.08] text-ivory sm:text-5xl lg:text-6xl"
        />
        <RevealText
          as="p"
          text={`“${d.scriptureText}”`}
          stagger={22}
          className="mt-6 block max-w-xl font-serif text-xl italic leading-relaxed text-ivory/80"
        />
        <Reveal delay={0.3}>
          <Link
            href={`/devotional/${d.slug}`}
            className="mt-10 inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.14em] text-ivory"
          >
            READ THIS WORD →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
