import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { title?: string; description?: string; totalDays?: number; status?: "DRAFT" | "PUBLISHED" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const series = await db.series.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.totalDays !== undefined ? { totalDays: body.totalDays } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
  });

  revalidatePath(`/series/${series.slug}`);
  revalidatePath("/");

  return NextResponse.json({ series });
}
