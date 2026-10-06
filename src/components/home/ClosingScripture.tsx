import Reveal from "../Reveal";
import RevealText from "../RevealText";

export default function ClosingScripture() {
  return (
    <section className="relative overflow-hidden bg-near-black px-5 py-40 text-center sm:px-10 sm:py-56">
      <div className="grain" aria-hidden="true" />
      {/* The one light in the room — a slow, barely-visible breath behind
          the verse. Presence, even in stillness. Minimal motion, by design. */}
      <div
        className="animate-glow-breathe pointer-events-none absolute left-1/2 top-1/2 h-[55vmax] w-[55vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,165,104,0.22) 0%, rgba(201,165,104,0.05) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="ghost-word font-serif text-[22vw] text-ivory/[0.05] sm:text-[12vw]" aria-hidden="true">
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
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="rule-gold w-8" aria-hidden="true" />
              <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
                PSALM 46:10 — KJV
              </p>
              <span className="rule-gold w-8 rotate-180" aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
