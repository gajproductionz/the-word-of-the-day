import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPublishIssues } from "@/lib/validation";
import { toPublishCheckInput } from "@/lib/studio/saveDevotional";

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

  const existing = await db.devotional.findUnique({
    where: { id },
    include: { topics: true, series: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const issues = getPublishIssues(toPublishCheckInput(existing));
  if (issues.length > 0) {
    return NextResponse.json(
      { error: `Before scheduling, fill in: ${issues.join(", ")}.` },
      { status: 400 }
    );
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
