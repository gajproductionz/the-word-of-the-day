import type { Metadata } from "next";
import { db } from "@/lib/db";
import DevotionalEditor from "@/components/studio/DevotionalEditor";
import { emptyForm } from "@/components/studio/editorDefaults";

export const metadata: Metadata = { title: "New Word" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function NewWordPage({ searchParams }: PageProps) {
  const { date } = await searchParams;
  const [topics, series, settings] = await Promise.all([
    db.topic.findMany({ orderBy: { name: "asc" } }),
    db.series.findMany({ orderBy: { title: "asc" } }),
    db.settings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} }),
  ]);

  const initial = emptyForm();
  if (date) initial.date = date;

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
