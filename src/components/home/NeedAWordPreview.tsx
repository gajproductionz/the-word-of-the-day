import Link from "next/link";
import Reveal from "../Reveal";

const words = ["DISCOURAGED", "ANXIOUS", "WAITING", "GRATEFUL", "ALONE", "HOPEFUL"];

export default function NeedAWordPreview() {
  return (
    <section className="relative overflow-hidden bg-near-black px-5 py-28 sm:px-10 sm:py-36">
      <div className="grain" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1400px]">
        <Reveal>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
            WHAT ARE YOU FACING?
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-4xl font-serif text-4xl leading-[1.08] text-ivory sm:text-6xl">
            Whatever you&apos;re carrying, there is Scripture for it.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3" aria-hidden="true">
            {words.map((w, i) => (
              <span
                key={w}
                className="font-serif italic text-ivory/30"
                style={{ fontSize: `${1.1 + (i % 3) * 0.4}rem` }}
              >
                {w}
              </span>
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
