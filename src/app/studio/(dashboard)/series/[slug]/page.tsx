import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import SeriesManager from "@/components/studio/SeriesManager";

export const metadata: Metadata = { title: "Manage Series" };
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = await db.series.findUnique({
    where: { slug },
    include: { devotionals: { select: { id: true, title: true, seriesDay: true, status: true } } },
  });
  if (!series) notFound();

  const unassigned = await db.devotional.findMany({
    where: { seriesId: null },
    select: { id: true, title: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <SeriesManager
      seriesId={series.id}
      seriesSlug={series.slug}
      title={series.title}
      description={series.description}
      totalDays={series.totalDays}
      status={series.status}
      devotionals={series.devotionals}
      unassigned={unassigned}
    />
  );
}
