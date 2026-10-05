import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  let body: { devotionalId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.devotionalId) return NextResponse.json({ error: "devotionalId required." }, { status: 400 });

  await db.needCategoryDevotional.upsert({
    where: { needCategoryId_devotionalId: { needCategoryId: categoryId, devotionalId: body.devotionalId } },
    create: { needCategoryId: categoryId, devotionalId: body.devotionalId },
    update: {},
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const devotionalId = request.nextUrl.searchParams.get("devotionalId");
  if (!devotionalId) return NextResponse.json({ error: "devotionalId required." }, { status: 400 });

  await db.needCategoryDevotional.deleteMany({
    where: { needCategoryId: categoryId, devotionalId },
  });

  return NextResponse.json({ success: true });
}
