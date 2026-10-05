import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const VALID_STATUSES = ["NEW", "PRAYED_FOR", "APPROVED_FOR_WALL", "PRIVATE", "ARCHIVED"] as const;

/**
 * The only path a prayer request can reach the public wall — see brief
 * section 21: nothing auto-publishes. A request marked PRIVATE can never
 * be set to APPROVED_FOR_WALL here, regardless of what's requested.
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const existing = await db.prayerRequest.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (existing.isPrivate && body.status === "APPROVED_FOR_WALL") {
    return NextResponse.json(
      { error: "This request was marked private by the requester and can't be shown on the wall." },
      { status: 400 }
    );
  }

  const prayer = await db.prayerRequest.update({
    where: { id },
    data: { status: body.status as (typeof VALID_STATUSES)[number] },
  });

  revalidatePath("/prayer");
  return NextResponse.json({ prayer });
}
