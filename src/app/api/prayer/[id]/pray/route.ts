import { NextRequest, NextResponse } from "next/server";
import { incrementPrayerCount } from "@/lib/prayerStore";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { logAnalyticsEvent } from "@/lib/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit({ routeKey: "prayer-pray", ip, limit: 60, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;
  const prayerCount = await incrementPrayerCount(id);

  if (prayerCount === null) {
    return NextResponse.json({ error: "Prayer not found." }, { status: 404 });
  }

  await logAnalyticsEvent({ type: "PRAYER_PRAYED", sessionId: ip });
  return NextResponse.json({ success: true, prayerCount });
}
