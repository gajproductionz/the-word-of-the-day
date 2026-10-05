import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Schedules a devotional for a future publishAt — it only actually goes
 * live (status PUBLISHED) once a scheduled job calls the publish route
 * at that time. publishAt is stored as an absolute UTC instant computed
 * client-side from the chosen date/time/timezone — see Settings for the
 * configurable default timezone (never assumed from the admin's device).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { publishAt?: string; emailSendAt?: string; pushSendAt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.publishAt) {
    return NextResponse.json({ error: "A publish date and time are required." }, { status: 400 });
  }

  const devotional = await db.devotional.update({
    where: { id },
    data: {
      status: "SCHEDULED",
      publishAt: new Date(body.publishAt),
      emailSendAt: body.emailSendAt ? new Date(body.emailSendAt) : null,
      pushSendAt: body.pushSendAt ? new Date(body.pushSendAt) : null,
    },
  });

  return NextResponse.json({ success: true, devotional });
}
