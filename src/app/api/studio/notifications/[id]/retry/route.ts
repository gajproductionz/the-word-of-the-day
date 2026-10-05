import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Resets a failed notification back to queued so the sending worker
 * picks it up again. Never touches rows that already succeeded — a
 * devotional's other channels aren't re-queued just because one failed
 * (brief section 29: channels operate independently).
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const log = await db.notificationLog.findUnique({ where: { id } });
  if (!log) return NextResponse.json({ error: "Not found." }, { status: 404 });

  if (log.status !== "FAILED" && log.status !== "PARTIALLY_FAILED") {
    return NextResponse.json({ error: "Only failed notifications can be retried." }, { status: 400 });
  }

  const updated = await db.notificationLog.update({
    where: { id },
    data: { status: log.scheduledAt ? "SCHEDULED" : "NOT_SCHEDULED", errorMessage: null },
  });

  return NextResponse.json({ notification: updated });
}
