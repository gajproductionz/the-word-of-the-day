import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllDevotionals,
  getDevotionalBySlug,
  getRelatedDevotional,
} from "@/content";
import { formatLongDate } from "@/lib/date";
import { resolveImage } from "@/lib/resolveImage";
import DevotionalImage from "@/components/DevotionalImage";
import ReadingProgress from "@/components/ReadingProgress";
import DevotionalActions from "@/components/DevotionalActions";
import DevotionalCard from "@/components/DevotionalCard";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDevotionals().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const d = getDevotionalBySlug(slug);
  if (!d) return {};

  return {
    title: d.seoTitle,
    description: d.seoDescription,
    alternates: { canonical: `/devotional/${d.slug}` },
    openGraph: {
      title: d.seoTitle,
      description: d.seoDescription,
      type: "article",
      publishedTime: d.date,
      url: `/devotional/${d.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: d.seoTitle,
      description: d.seoDescription,
    },
  };
}

export default async function DevotionalPage({ params }: PageProps) {
  const { slug } = await params;
  const d = getDevotionalBySlug(slug);
  if (!d) notFound();

  const related = getRelatedDevotional(d.topics, d.slug);

  const [heroImage, relatedImage] = await Promise.all([
    resolveImage(d),
    related ? resolveImage(related) : Promise.resolve(null),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    description: d.seoDescription,
    datePublished: d.date,
    author: { "@type": "Organization", name: "The Word of the Day" },
  };

  return (
    <article>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative">
        <DevotionalImage image={heroImage} className="h-[52vh] min-h-[380px] w-full" priority>
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/75 via-near-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-10 sm:pb-16">
            <div className="mx-auto max-w-3xl">
              <p className="font-sans text-xs font-semibold tracking-[0.18em] text-ivory/80">
                {formatLongDate(d.date)}
              </p>
              <RevealText
                as="h1"
                text={d.title}
                stagger={45}
                className="mt-3 block font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl"
              />
              <p className="mt-4 font-sans text-sm font-medium tracking-[0.1em] text-gold-soft">
                {d.scriptureReference} — KJV
              </p>
            </div>
          </div>
        </DevotionalImage>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-24">
        <RevealText
          as="blockquote"
          text={`“${d.scriptureText}”`}
          stagger={20}
          className="block border-l-2 border-gold/50 pl-6 font-serif text-2xl italic leading-relaxed text-charcoal/90 sm:text-3xl"
        />

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

        <div className="mt-16">
          <DevotionalActions slug={d.slug} title={d.title} />
        </div>
      </div>

      {related && relatedImage && (
        <section className="border-t border-charcoal/10 bg-ivory-deep px-5 py-20 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="font-sans text-xs font-semibold tracking-[0.16em] text-charcoal/60">
              YOU MAY ALSO NEED
            </p>
            <div className="mt-6 max-w-md">
              <DevotionalCard
                devotional={{ ...related, resolvedImage: relatedImage }}
                layout="image-side"
              />
            </div>
          </div>
        </section>
      )}

      <div className="px-5 py-10 text-center sm:px-10">
        <Link
          href="/devotionals"
          className="font-sans text-xs font-semibold tracking-[0.14em] text-charcoal/60 hover:text-forest"
        >
          ← BACK TO ALL DEVOTIONALS
        </Link>
      </div>
    </article>
  );
}
