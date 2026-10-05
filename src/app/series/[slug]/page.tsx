import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { seriesList, getDevotionalsBySeries, getSeriesMeta } from "@/content";
import { resolveImages } from "@/lib/resolveImage";
import DevotionalImage from "@/components/DevotionalImage";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return seriesList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesMeta(slug);
  if (!series) return {};
  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: `/series/${slug}` },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeriesMeta(slug);
  if (!series) notFound();

  const days = await resolveImages(getDevotionalsBySeries(slug));

  return (
    <div>
      <section className="bg-forest-deep px-5 py-24 text-center sm:px-10 sm:py-32">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
          DEVOTIONAL SERIES
        </p>
        <RevealText
          as="h1"
          text={series.title}
          className="mx-auto mt-5 block max-w-3xl font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl"
        />
        <p className="mx-auto mt-6 max-w-xl font-sans text-base text-ivory/70">
          {series.description}
        </p>
        {days.length > 0 && (
          <p className="mt-8 font-sans text-xs font-semibold tracking-[0.16em] text-gold-soft">
            {days.length} OF {series.totalDays} DAYS AVAILABLE
          </p>
        )}
      </section>

      <section className="px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-3xl">
          {days.length === 0 ? (
            <p className="text-center font-serif text-xl italic text-charcoal/60">
              This series begins soon — check back shortly.
            </p>
          ) : (
            <ol className="space-y-16">
              {days.map((d, i) => {
                const prev = days[i - 1];
                const next = days[i + 1];
                return (
                  <li key={d.id} id={`day-${d.seriesDay}`}>
                    <Reveal>
                      <p className="font-sans text-xs font-semibold tracking-[0.16em] text-forest">
                        DAY {d.seriesDay} OF {series.totalDays}
                      </p>
                      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-5 sm:gap-8">
                        <DevotionalImage
                          image={d.resolvedImage}
                          className="aspect-[4/3] rounded-sm sm:col-span-2"
                        />
                        <div className="sm:col-span-3">
                          <h2 className="font-serif text-2xl leading-snug text-charcoal sm:text-3xl">
                            {d.title}
                          </h2>
                          <p className="mt-2 font-sans text-sm text-charcoal/60">
                            {d.scriptureReference}
                          </p>
                          <p className="mt-3 font-serif italic text-charcoal/70">{d.keyMessage}</p>
                          <Link
                            href={`/devotional/${d.slug}`}
                            className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold tracking-[0.08em] text-charcoal hover:text-forest"
                          >
                            READ DAY {d.seriesDay} →
                          </Link>

                          <div className="mt-6 flex gap-6 border-t border-charcoal/10 pt-4 font-sans text-xs tracking-wide text-charcoal/60">
                            {prev ? (
                              <a href={`#day-${prev.seriesDay}`} className="hover:text-forest">
                                ← PREVIOUS DAY
                              </a>
                            ) : (
                              <span className="opacity-30">← PREVIOUS DAY</span>
                            )}
                            {next ? (
                              <a href={`#day-${next.seriesDay}`} className="hover:text-forest">
                                NEXT DAY →
                              </a>
                            ) : (
                              <span className="opacity-30">NEXT DAY →</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}
