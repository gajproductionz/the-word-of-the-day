import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribeSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

/**
 * Subscription endpoint. Persists real subscribers now; actual email
 * delivery is a separate concern — see src/lib/email/ — so this route
 * only ever needs to change if the signup *form* changes, not if the
 * sending provider does.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = await checkRateLimit({ routeKey: "subscribe", ip, limit: 5, windowSeconds: 3600 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Please try again in a little while." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const { email, source } = parsed.data;
  const now = new Date();

  const existing = await db.subscriber.findUnique({ where: { email } });

  if (existing) {
    if (existing.emailStatus === "UNSUBSCRIBED") {
      // Re-subscribing counts as fresh consent.
      await db.subscriber.update({
        where: { email },
        data: { emailStatus: "SUBSCRIBED", unsubscribedAt: null, consentTimestamp: now, source },
      });
    }
    // Already subscribed — respond success either way so this endpoint
    // never leaks whether an email is already on the list.
    return NextResponse.json({ success: true });
  }

  await db.subscriber.create({
    data: { email, source, consentTimestamp: now },
  });

  return NextResponse.json({ success: true });
}
