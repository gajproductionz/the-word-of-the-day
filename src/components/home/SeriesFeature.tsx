import Link from "next/link";
import type { Devotional, SeriesMeta } from "@/content/types";
import Reveal from "../Reveal";

interface SeriesFeatureProps {
  series: SeriesMeta;
  days: Devotional[];
}

export default function SeriesFeature({ series, days }: SeriesFeatureProps) {
  const first = days[0];
  if (!first) return null;

  return (
    <section className="bg-ivory-deep px-5 py-24 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-forest">
            DEVOTIONAL SERIES
          </p>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <h2 className="font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                {series.title}
              </h2>
              <p className="mt-4 max-w-xl font-sans text-base text-charcoal/70">
                {series.description}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60">
                DAY {first.seriesDay} OF {series.totalDays}
              </p>
              <Link
                href={`/series/${series.slug}`}
                className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.1em] text-charcoal hover:text-forest"
              >
                BEGIN THE SERIES →
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <ol className="space-y-3 border-l border-charcoal/15 pl-6">
                {days.slice(0, 4).map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/devotional/${d.slug}`}
                      className="group flex items-baseline gap-3 font-sans text-sm text-charcoal/70 transition-colors hover:text-forest"
                    >
                      <span className="text-xs text-charcoal/60">DAY {d.seriesDay}</span>
                      <span className="font-serif text-base text-charcoal group-hover:text-forest">
                        {d.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
