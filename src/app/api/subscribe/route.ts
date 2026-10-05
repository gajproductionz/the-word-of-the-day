import { NextRequest, NextResponse } from "next/server";

/**
 * Subscription endpoint, prepared for future email/SMS/push delivery.
 * No external paid provider is configured — this validates and accepts
 * the request so the frontend architecture is ready to connect a real
 * provider (e.g. Resend, Mailchimp, Twilio) later without changing the
 * client contract.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; channel?: "email" | "sms" | "push" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // TODO: connect a real provider here (Resend/Mailchimp/etc.) and persist
  // the subscriber. For now, the request is accepted and logged server-side.
  console.log(`[subscribe] new signup: ${email} via ${body.channel ?? "email"}`);

  return NextResponse.json({ success: true });
}
