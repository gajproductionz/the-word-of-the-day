import { db } from "./db";

interface RateLimitOptions {
  /** Identifies the route being limited, e.g. "prayer", "subscribe". */
  routeKey: string;
  ip: string;
  /** Max requests allowed per window. */
  limit: number;
  windowSeconds: number;
}

/**
 * Fixed-window rate limiter backed by the database (not in-memory) so it
 * works correctly across serverless instances, which don't share memory.
 * Fails open (allows the request) if the DB write itself errors, so a
 * database hiccup never blocks legitimate traffic — only the deliberate
 * limit does.
 */
export async function checkRateLimit({
  routeKey,
  ip,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const id = `${routeKey}:${ip}`;
  const now = new Date();

  try {
    const existing = await db.rateLimitBucket.findUnique({ where: { id } });

    if (!existing || now.getTime() - existing.windowStart.getTime() > windowSeconds * 1000) {
      await db.rateLimitBucket.upsert({
        where: { id },
        create: { id, count: 1, windowStart: now },
        update: { count: 1, windowStart: now },
      });
      return { allowed: true };
    }

    if (existing.count >= limit) {
      const retryAfterSeconds = Math.ceil(
        (existing.windowStart.getTime() + windowSeconds * 1000 - now.getTime()) / 1000
      );
      return { allowed: false, retryAfterSeconds };
    }

    await db.rateLimitBucket.update({
      where: { id },
      data: { count: { increment: 1 } },
    });
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

/** Best-effort real client IP from standard proxy headers (Vercel sets x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
