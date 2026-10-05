import type { CSSProperties } from "react";
import type { ResolvedImage } from "@/content/types";
import DevotionalImage from "../DevotionalImage";
import HeroParallax from "./HeroParallax";

/** CSS custom properties aren't in React's CSSProperties type by default. */
type FloatVars = CSSProperties & {
  "--float-y"?: string;
  "--float-duration"?: string;
  "--float-delay"?: string;
};

interface HeroProps {
  dateLabel: string;
  image: ResolvedImage;
}

export default function Hero({ dateLabel, image }: HeroProps) {
  return (
    <section className="relative flex h-[100vh] min-h-[640px] w-full items-end overflow-hidden">
      {/* The zoom animation lives on this wrapper (not on DevotionalImage
          itself, which clips its own overflow) so the slightly-oversized
          image can scale down into the section's own clipped frame. */}
      <div className="animate-hero-zoom absolute inset-0">
        <DevotionalImage image={image} className="absolute inset-0" priority creditTone="light">
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/70 via-near-black/10 to-transparent" />
        </DevotionalImage>
      </div>

      <div className="relative z-10 w-full px-5 pb-16 sm:px-10 sm:pb-24">
        <HeroParallax>
          <div className="mx-auto max-w-[1400px]">
            <p
              className="animate-fade-up font-sans text-xs font-medium tracking-[0.22em] text-ivory/80"
              style={{ animationDelay: "0.3s" }}
            >
              {dateLabel}
            </p>

            <h1 className="animate-hero-breathe mt-4 font-serif text-[18vw] leading-[0.92] tracking-tight text-ivory sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw]">
              <span className="mask-line">
                <span style={{ animationDelay: "0.45s" }}>
                  <span
                    className="float-line"
                    style={
                      {
                        "--float-y": "-14px",
                        "--float-duration": "4.5s",
                        "--float-delay": "1.9s",
                      } as FloatVars
                    }
                  >
                    GOOD
                  </span>
                </span>
              </span>
              <span className="mask-line">
                <span style={{ animationDelay: "0.6s" }}>
                  <span
                    className="float-line"
                    style={
                      {
                        "--float-y": "-20px",
                        "--float-duration": "5.5s",
                        "--float-delay": "2.15s",
                      } as FloatVars
                    }
                  >
                    MORNING
                  </span>
                </span>
              </span>
              <span className="mask-line">
                <span style={{ animationDelay: "0.75s" }}>
                  <span
                    className="float-line"
                    style={
                      {
                        "--float-y": "-11px",
                        "--float-duration": "5s",
                        "--float-delay": "2.4s",
                      } as FloatVars
                    }
                  >
                    <span className="sr-only">FAMILY.</span>
                    <span aria-hidden="true">
                      {"FAMILY.".split("").map((char, i) => (
                        <span
                          key={i}
                          className="letter-wave"
                          style={{ animationDelay: `${2.6 + i * 0.09}s` }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
            </h1>

            <div
              className="animate-fade-up mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between"
              style={{ animationDelay: "1.1s" }}
            >
              <p className="max-w-sm font-serif text-lg italic text-ivory/85 sm:text-xl">
                There is a Word for you today.
              </p>
              <a
                href="#todays-word"
                className="group inline-flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.16em] text-ivory"
              >
                RECEIVE TODAY&apos;S WORD
                <span
                  className="animate-arrow-bounce inline-block transition-transform group-hover:scale-125"
                  style={{ animationDelay: "2.2s" }}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </HeroParallax>
      </div>
    </section>
  );
}
