import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { devotionalInputSchema } from "@/lib/validation";
import { buildDevotionalData } from "@/lib/studio/saveDevotional";

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) || `word-${Date.now()}`
  );
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 2;
  while (await db.devotional.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

/**
 * Creates a new devotional, called once by the editor's autosave on the
 * very first edit (see DevotionalEditor.tsx) — every edit after that
 * PATCHes this same row by id.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // A brand-new draft may not have a title/slug yet — fill in sane
  // placeholders so the row can be created, then edited freely.
  const title = typeof body.title === "string" && body.title.trim() ? body.title : "Untitled Word";
  const slugBase = typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);
  const slug = await uniqueSlug(slugBase);

  const parsed = devotionalInputSchema.safeParse({
    date: new Date().toISOString().slice(0, 10),
    book: "Psalm",
    chapter: 1,
    verseStart: 1,
    scriptureReference: "",
    scriptureText: "",
    keyMessage: "",
    reflection: [""],
    reflectionQuestion: "",
    prayer: "",
    featuredImage: "sunrise-ridge",
    featuredImageAlt: "",
    seoTitle: title,
    seoDescription: "",
    status: "DRAFT",
    ...body,
    title,
    slug,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid data." }, { status: 400 });
  }

  const { fields, topicIds } = await buildDevotionalData(parsed.data);
  const devotional = await db.devotional.create({
    data: {
      ...fields,
      createdById: session.userId,
      topics: { connect: topicIds.map((id) => ({ id })) },
    },
    include: { topics: true, series: true },
  });

  return NextResponse.json({ devotional });
}
