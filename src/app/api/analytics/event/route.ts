import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { logAnalyticsEvent } from "@/lib/analytics";

const VALID_TYPES = [
  "PAGE_VIEW",
  "WORD_RECEIVED",
  "SHARE",
  "SEARCH",
  "NEED_A_WORD_SELECTED",
  "EMAIL_CLICK",
] as const;

const SESSION_COOKIE = "wod_session";

/**
 * Anonymous, cookie-based engagement events from the public site (page
 * views, "I received this Word", shares, need-a-word picks). Never
 * identifies a person — the session id is just a random value so repeat
 * visits from the same browser can be told apart from new ones.
 */
export async function POST(request: NextRequest) {
  let body: { type?: string; devotionalId?: string; metadata?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.type || !VALID_TYPES.includes(body.type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ error: "Invalid event type." }, { status: 400 });
  }

  let sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  const isNewSession = !sessionId;
  if (!sessionId) sessionId = randomUUID();

  await logAnalyticsEvent({
    type: body.type as (typeof VALID_TYPES)[number],
    devotionalId: body.devotionalId,
    sessionId,
    metadata: body.metadata,
  });

  const response = NextResponse.json({ success: true });
  if (isNewSession) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}
