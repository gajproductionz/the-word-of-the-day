import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const source = await db.devotional.findUnique({ where: { id }, include: { topics: true } });
  if (!source) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let slug = `${source.slug}-copy`;
  let n = 2;
  while (await db.devotional.findUnique({ where: { slug } })) {
    slug = `${source.slug}-copy-${n}`;
    n += 1;
  }

  const copy = await db.devotional.create({
    data: {
      slug,
      date: new Date(),
      title: `${source.title} (Copy)`,
      book: source.book,
      chapter: source.chapter,
      verseStart: source.verseStart,
      verseEnd: source.verseEnd,
      scriptureReference: source.scriptureReference,
      scriptureText: source.scriptureText,
      keyMessage: source.keyMessage,
      reflection: source.reflection as string[],
      reflectionQuestion: source.reflectionQuestion,
      prayer: source.prayer,
      topics: { connect: source.topics.map((t) => ({ id: t.id })) },
      seriesId: source.seriesId,
      seriesDay: source.seriesDay,
      featuredImage: source.featuredImage,
      featuredImageAlt: source.featuredImageAlt,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      status: "DRAFT",
      featured: false,
      createdById: session.userId,
    },
  });

  return NextResponse.json({ devotional: copy });
}
