import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { devotionalDraftSchema } from "@/lib/validation";
import { buildDevotionalData } from "@/lib/studio/saveDevotional";
import { revalidatePublicContent } from "@/lib/studio/revalidate";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotional = await db.devotional.findUnique({
    where: { id },
    include: { topics: true, series: true },
  });
  if (!devotional) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ devotional });
}

/** Autosave + explicit "Save Draft" both land here — a partial update, not a full replace. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const existing = await db.devotional.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Merge onto the existing row so autosave can send just the fields
  // that changed, not the entire form every time.
  const merged = {
    slug: existing.slug,
    date: existing.date.toISOString().slice(0, 10),
    title: existing.title,
    book: existing.book,
    chapter: existing.chapter,
    verseStart: existing.verseStart,
    verseEnd: existing.verseEnd,
    scriptureReference: existing.scriptureReference,
    scriptureText: existing.scriptureText,
    keyMessage: existing.keyMessage,
    reflection: existing.reflection,
    reflectionQuestion: existing.reflectionQuestion,
    prayer: existing.prayer,
    topics: (await db.topic.findMany({ where: { devotionals: { some: { id } } } })).map((t) => t.name),
    seriesSlug: existing.seriesId
      ? (await db.series.findUnique({ where: { id: existing.seriesId } }))?.slug
      : null,
    seriesDay: existing.seriesDay,
    featuredImage: existing.featuredImage,
    featuredImageAlt: existing.featuredImageAlt,
    unsplashQuery: existing.unsplashQuery,
    seoTitle: existing.seoTitle,
    seoDescription: existing.seoDescription,
    status: existing.status,
    publishAt: existing.publishAt?.toISOString() ?? null,
    featured: existing.featured,
    emailEnabled: existing.emailEnabled,
    pushEnabled: existing.pushEnabled,
    socialEnabled: existing.socialEnabled,
    audioUrl: existing.audioUrl,
    audioDuration: existing.audioDuration,
    ...body,
  };

  const parsed = devotionalDraftSchema.safeParse(merged);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const { fields, topicIds } = await buildDevotionalData(parsed.data);
  const devotional = await db.devotional.update({
    where: { id },
    data: {
      ...fields,
      topics: { set: topicIds.map((id) => ({ id })) },
    },
    include: { topics: true, series: true },
  });

  if (devotional.status === "PUBLISHED") {
    revalidatePublicContent(devotional);
  }

  return NextResponse.json({ devotional });
}
