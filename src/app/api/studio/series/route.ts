import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export async function POST(request: NextRequest) {
  let body: { title?: string; description?: string; totalDays?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const title = body.title?.trim();
  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  let slug = slugify(title);
  let n = 2;
  while (await db.series.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${n}`;
    n += 1;
  }

  const series = await db.series.create({
    data: {
      slug,
      title,
      description: body.description?.trim() || "",
      totalDays: body.totalDays || 7,
      status: "DRAFT",
    },
  });

  return NextResponse.json({ series });
}
