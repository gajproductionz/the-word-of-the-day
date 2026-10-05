import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getDevotionalForEdit } from "@/lib/studio/queries";
import DevotionalEditor, { type EditorFormState } from "@/components/studio/DevotionalEditor";

export const metadata: Metadata = { title: "Edit Word" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWordPage({ params }: PageProps) {
  const { id } = await params;
  const [devotional, topics, series, settings] = await Promise.all([
    getDevotionalForEdit(id),
    db.topic.findMany({ orderBy: { name: "asc" } }),
    db.series.findMany({ orderBy: { title: "asc" } }),
    db.settings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} }),
  ]);

  if (!devotional) notFound();

  const initial: EditorFormState = {
    id: devotional.id,
    slug: devotional.slug,
    date: devotional.date.toISOString().slice(0, 10),
    title: devotional.title,
    book: devotional.book,
    chapter: devotional.chapter,
    verseStart: devotional.verseStart,
    verseEnd: devotional.verseEnd,
    scriptureReference: devotional.scriptureReference,
    scriptureText: devotional.scriptureText,
    keyMessage: devotional.keyMessage,
    reflection: devotional.reflection as string[],
    reflectionQuestion: devotional.reflectionQuestion,
    prayer: devotional.prayer,
    topics: devotional.topics.map((t) => t.name),
    seriesSlug: devotional.series?.slug ?? null,
    seriesDay: devotional.seriesDay,
    featuredImage: devotional.featuredImage,
    featuredImageAlt: devotional.featuredImageAlt,
    seoTitle: devotional.seoTitle,
    seoDescription: devotional.seoDescription,
    status: devotional.status,
    publishAt: devotional.publishAt?.toISOString() ?? null,
    featured: devotional.featured,
    emailEnabled: devotional.emailEnabled,
    pushEnabled: devotional.pushEnabled,
    socialEnabled: devotional.socialEnabled,
  };

  return (
    <DevotionalEditor
      initial={initial}
      allTopics={topics.map((t) => t.name)}
      allSeries={series.map((s) => ({ slug: s.slug, title: s.title }))}
      defaultTimezone={settings.defaultTimezone}
      defaultEmailDelayMinutes={settings.defaultEmailDelayMinutes}
    />
  );
}
