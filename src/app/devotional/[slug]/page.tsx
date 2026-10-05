import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllDevotionals,
  getDevotionalBySlug,
  getRelatedDevotional,
} from "@/content";
import { resolveImage } from "@/lib/resolveImage";
import DevotionalReader from "@/components/DevotionalReader";
import DevotionalActions from "@/components/DevotionalActions";
import DevotionalCard from "@/components/DevotionalCard";
import TrackPageView from "@/components/TrackPageView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Safety-net cache window — Studio's publish flow calls revalidatePath
// for instant updates (see src/app/api/studio/devotionals/[id]/publish),
// so this mostly guards against a missed on-demand revalidation.
export const revalidate = 3600;

export async function generateStaticParams() {
  const devotionals = await getAllDevotionals();
  return devotionals.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDevotionalBySlug(slug);
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
  const d = await getDevotionalBySlug(slug);
  if (!d) notFound();

  const related = await getRelatedDevotional(d.topics, d.slug);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <TrackPageView devotionalId={d.id} />
      <DevotionalReader devotional={d} heroImage={heroImage} />

      <div className="mx-auto -mt-8 max-w-3xl px-5 pb-16 sm:px-6 sm:pb-24">
        <DevotionalActions devotionalId={d.id} slug={d.slug} title={d.title} />
      </div>

      {related && relatedImage && (
        <section className="mt-16 border-t border-charcoal/10 bg-ivory-deep px-5 py-20 sm:px-10">
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
    </>
  );
}
