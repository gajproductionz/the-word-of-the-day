import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ error: "Missing unsubscribe token." }, { status: 400 });
  }

  const subscriber = await db.subscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!subscriber) {
    return NextResponse.json({ error: "This unsubscribe link is no longer valid." }, { status: 404 });
  }

  if (subscriber.emailStatus !== "UNSUBSCRIBED") {
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: { emailStatus: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
  }

  return NextResponse.json({ success: true });
}
