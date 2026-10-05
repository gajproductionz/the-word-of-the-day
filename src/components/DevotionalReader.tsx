import { formatLongDate } from "@/lib/date";
import type { ResolvedImage } from "@/content/types";
import DevotionalImage from "./DevotionalImage";
import ReadingProgress from "./ReadingProgress";
import Reveal from "./Reveal";
import RevealText from "./RevealText";

export interface DevotionalReaderData {
  title: string;
  /** ISO date string. */
  date: string;
  scriptureReference: string;
  scriptureText: string;
  keyMessage: string;
  reflection: string[];
  reflectionQuestion: string;
  prayer: string;
}

interface DevotionalReaderProps {
  devotional: DevotionalReaderData;
  heroImage: ResolvedImage;
  /** Off in Studio's live preview — there's nothing real to save/share yet. */
  showReadingProgress?: boolean;
}

/**
 * The actual public devotional reading experience — header image through
 * the closing prayer. Used by both /devotional/[slug] (the real public
 * page) and Studio's live preview, so "what readers will see" is never a
 * reimplementation that can drift from the real thing.
 */
export default function DevotionalReader({
  devotional: d,
  heroImage,
  showReadingProgress = true,
}: DevotionalReaderProps) {
  return (
    <article>
      {showReadingProgress && <ReadingProgress />}

      <header className="relative">
        <DevotionalImage image={heroImage} className="h-[52vh] min-h-[380px] w-full" priority>
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/75 via-near-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-10 sm:pb-16">
            <div className="mx-auto max-w-3xl">
              <p className="font-sans text-xs font-semibold tracking-[0.18em] text-ivory/80">
                {d.date ? formatLongDate(d.date) : ""}
              </p>
              <RevealText
                as="h1"
                text={d.title || "Untitled Word"}
                stagger={45}
                className="mt-3 block font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl"
              />
              <p className="mt-4 font-sans text-sm font-medium tracking-[0.1em] text-gold-soft">
                {d.scriptureReference ? `${d.scriptureReference} — KJV` : ""}
              </p>
            </div>
          </div>
        </DevotionalImage>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        {d.scriptureText && (
          <RevealText
            as="blockquote"
            text={`“${d.scriptureText}”`}
            stagger={20}
            className="block border-l-2 border-gold/50 pl-6 font-serif text-2xl italic leading-relaxed text-charcoal/90 sm:text-3xl"
          />
        )}

        {d.keyMessage && (
          <Reveal delay={0.1}>
            <div className="mt-10">
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
                KEY MESSAGE
              </p>
              <p className="mt-3 font-serif text-2xl leading-snug text-forest sm:text-3xl">
                {d.keyMessage}
              </p>
            </div>
          </Reveal>
        )}

        {d.reflection.length > 0 && (
          <div className="mt-14 space-y-6">
            <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
              REFLECTION
            </p>
            {d.reflection.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p
                  className={`font-serif text-lg leading-[1.75] text-charcoal/90 sm:text-xl ${
                    i === 0 ? "drop-cap" : ""
                  }`}
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        )}

        {d.reflectionQuestion && (
          <Reveal>
            <div className="mt-14 rounded-sm bg-ivory-deep px-6 py-8 sm:px-10 sm:py-10">
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
                TODAY&apos;S QUESTION
              </p>
              <p className="mt-3 font-serif text-xl italic leading-snug text-charcoal sm:text-2xl">
                {d.reflectionQuestion}
              </p>
            </div>
          </Reveal>
        )}

        {d.prayer && (
          <Reveal>
            <div className="mt-14">
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
                PRAYER
              </p>
              <p className="mt-4 font-serif text-lg italic leading-[1.8] text-charcoal/90 sm:text-xl">
                {d.prayer}
              </p>
              <p className="mt-8 font-serif text-lg text-charcoal">
                Amen.
                <br />
                <span className="text-base text-charcoal/60">— TheWordofTheDay</span>
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </article>
  );
}
