import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.endpoint) return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });

  await db.pushSubscription.updateMany({
    where: { endpoint: body.endpoint },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
