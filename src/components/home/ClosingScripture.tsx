import Reveal from "../Reveal";
import RevealText from "../RevealText";

export default function ClosingScripture() {
  return (
    <section className="relative overflow-hidden bg-forest-deep px-5 py-32 text-center sm:px-10 sm:py-40">
      <div className="grain" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="font-serif text-[22vw] leading-none text-ivory/[0.06] sm:text-[12vw]" aria-hidden="true">
            STILL
          </p>
        </Reveal>
        <div className="-mt-8 sm:-mt-16">
          <RevealText
            as="p"
            text="“Be still, and know that I am God.”"
            stagger={60}
            className="block font-serif text-3xl italic leading-relaxed text-ivory sm:text-4xl"
          />
          <Reveal delay={0.3}>
            <p className="mt-6 font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
              PSALM 46:10 — KJV
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
