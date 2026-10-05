import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  let body: { defaultTimezone?: string; defaultEmailDelayMinutes?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const settings = await db.settings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      defaultTimezone: body.defaultTimezone ?? "America/New_York",
      defaultEmailDelayMinutes: body.defaultEmailDelayMinutes ?? 30,
    },
    update: {
      ...(body.defaultTimezone ? { defaultTimezone: body.defaultTimezone } : {}),
      ...(body.defaultEmailDelayMinutes !== undefined
        ? { defaultEmailDelayMinutes: body.defaultEmailDelayMinutes }
        : {}),
    },
  });

  return NextResponse.json({ settings });
}
