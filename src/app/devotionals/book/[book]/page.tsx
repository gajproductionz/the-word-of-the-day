import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allTopics, getAllDevotionals, bibleBooks } from "@/content";
import { resolveImages } from "@/lib/resolveImage";
import DevotionalLibrary from "@/components/DevotionalLibrary";
import RevealText from "@/components/RevealText";

interface PageProps {
  params: Promise<{ book: string }>;
}

function findBook(slug: string) {
  return bibleBooks.find((b) => b.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
}

export async function generateStaticParams() {
  return bibleBooks.map((b) => ({ book: b.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { book: bookSlug } = await params;
  const book = findBook(bookSlug);
  if (!book) return {};
  return {
    title: `${book} Devotionals — King James Version`,
    description: `Daily devotionals rooted in the book of ${book} — Scripture, reflection, and prayer from The Word of the Day.`,
    alternates: { canonical: `/devotionals/book/${bookSlug}` },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { book: bookSlug } = await params;
  const book = findBook(bookSlug);
  if (!book) notFound();

  const allDevotionals = getAllDevotionals();
  const hasContent = allDevotionals.some((d) => d.book === book);
  const devotionals = hasContent ? await resolveImages(allDevotionals) : [];

  return (
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">BIBLE BOOK</p>
        <RevealText
          as="h1"
          text={book}
          className="mt-4 block font-serif text-5xl leading-[1.02] text-charcoal sm:text-6xl"
        />
        <p className="mt-4 max-w-xl font-sans text-base text-charcoal/70">
          Devotionals drawn from the book of {book}, King James Version.
        </p>

        <div className="mt-14">
          {hasContent ? (
            <DevotionalLibrary
              devotionals={devotionals}
              topics={allTopics}
              books={[...bibleBooks]}
              initialBook={book}
            />
          ) : (
            <p className="font-serif text-xl italic text-charcoal/60">
              No devotionals from {book} yet — check back soon, or explore the full library.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
