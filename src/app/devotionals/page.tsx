import type { Metadata } from "next";
import { getAllDevotionals, getAllTopics, bibleBooks } from "@/content";
import { resolveImages } from "@/lib/resolveImage";
import DevotionalLibrary from "@/components/DevotionalLibrary";
import RevealText from "@/components/RevealText";

export const metadata: Metadata = {
  title: "Find Your Word — Devotional Library",
  description:
    "Search and browse every Word of the Day devotional by topic, Scripture, series, or date.",
  alternates: { canonical: "/devotionals" },
};

export const revalidate = 3600;

export default async function DevotionalsPage() {
  const [allDevotionals, allTopics] = await Promise.all([getAllDevotionals(), getAllTopics()]);
  const devotionals = await resolveImages(allDevotionals);

  return (
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">DEVOTIONAL LIBRARY</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-charcoal sm:text-6xl lg:text-7xl">
          <RevealText as="span" text="FIND YOUR" className="block" />
          <RevealText as="span" text="WORD." className="block" />
        </h1>

        <div className="mt-14">
          <DevotionalLibrary devotionals={devotionals} topics={allTopics} books={[...bibleBooks]} />
        </div>
      </div>
    </div>
  );
}
