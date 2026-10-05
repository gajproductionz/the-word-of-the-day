import { NextRequest, NextResponse } from "next/server";
import { getWallPrayers, createPrayerRequest } from "@/lib/prayerStore";
import { prayerSubmissionSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { logAnalyticsEvent } from "@/lib/analytics";

export async function GET() {
  const wall = await getWallPrayers();
  return NextResponse.json({ prayers: wall });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit({ routeKey: "prayer-submit", ip, limit: 5, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "You've submitted a few requests already — please try again in a bit." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = prayerSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const prayer = await createPrayerRequest(parsed.data);
  await logAnalyticsEvent({ type: "PRAYER_SUBMITTED", sessionId: ip });
  return NextResponse.json({ success: true, prayer });
}
