import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePublicContent } from "@/lib/studio/revalidate";

/** Archiving removes a Word from the public site without deleting it — see brief section 18. */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const devotional = await db.devotional.update({
    where: { id },
    data: { status: "ARCHIVED", featured: false },
    include: { topics: true, series: true },
  });

  revalidatePublicContent(devotional);

  return NextResponse.json({ success: true, devotional });
}
