import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTopics, getAllDevotionals, bibleBooks } from "@/content";
import { resolveImages } from "@/lib/resolveImage";
import DevotionalLibrary from "@/components/DevotionalLibrary";
import RevealText from "@/components/RevealText";

interface PageProps {
  params: Promise<{ topic: string }>;
}

async function findTopic(slug: string) {
  const topics = await getAllTopics();
  return topics.find((t) => t.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((t) => ({ topic: t.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = await findTopic(topicSlug);
  if (!topic) return {};
  return {
    title: `${topic} Devotionals — Scripture & Reflection`,
    description: `Daily devotionals on ${topic.toLowerCase()} — King James Version Scripture, reflection, and prayer from The Word of the Day.`,
    alternates: { canonical: `/devotionals/topic/${topicSlug}` },
  };
}

export default async function TopicPage({ params }: PageProps) {
  const { topic: topicSlug } = await params;
  const topic = await findTopic(topicSlug);
  if (!topic) notFound();

  const [allDevotionals, allTopics] = await Promise.all([getAllDevotionals(), getAllTopics()]);
  const devotionals = await resolveImages(allDevotionals);

  return (
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">TOPIC</p>
        <RevealText
          as="h1"
          text={topic}
          className="mt-4 block font-serif text-5xl leading-[1.02] text-charcoal sm:text-6xl"
        />
        <p className="mt-4 max-w-xl font-sans text-base text-charcoal/70">
          Devotionals on {topic.toLowerCase()}, rooted in Scripture and written for your morning.
        </p>

        <div className="mt-14">
          <DevotionalLibrary
            devotionals={devotionals}
            topics={allTopics}
            books={[...bibleBooks]}
            initialTopic={topic}
          />
        </div>
      </div>
    </div>
  );
}
