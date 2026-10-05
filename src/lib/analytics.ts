import { db } from "@/lib/db";
import type { AnalyticsEventType, Prisma } from "@prisma/client";

/**
 * Analytics must never break the feature it's measuring — every call
 * site treats this as fire-and-forget and swallows failures.
 */
export async function logAnalyticsEvent(input: {
  type: AnalyticsEventType;
  devotionalId?: string;
  sessionId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: {
        type: input.type,
        devotionalId: input.devotionalId,
        sessionId: input.sessionId,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch {
    // Never let analytics failures surface to the user.
  }
}
