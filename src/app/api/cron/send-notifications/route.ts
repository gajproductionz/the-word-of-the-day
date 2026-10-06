import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDevotionalBySlug } from "@/content";
import { buildDailyWordEmail } from "@/lib/email/templates/dailyWord";
import { getEmailProvider } from "@/lib/email/providers";
import { sendPushToAllSubscribers } from "@/lib/push/sendPush";
import { SITE_URL } from "@/lib/site";
import type { Devotional as PrismaDevotional } from "@prisma/client";

// web-push needs Node's crypto APIs — this can never run on the Edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The actual send step the publish route only ever queues for (see
 * src/app/api/studio/devotionals/[id]/publish/route.ts). Triggered on a
 * schedule by Vercel Cron (see vercel.json) — never by a public request,
 * so every invocation must present CRON_SECRET.
 *
 * Only EMAIL and PUSH are sent automatically here. SOCIAL is deliberately
 * excluded: captions are generated for a human to copy and post, and the
 * product brief is explicit that nothing should auto-post to social
 * networks. A queued SOCIAL row just stays queued as a reminder.
 *
 * Each row is claimed with a conditional update (status must still match
 * what was read) before sending, so two overlapping invocations — or a
 * retry racing a still-running send — can never send the same channel
 * twice. A row is only ever marked SENT after its provider call actually
 * resolves successfully; a failure leaves an errorMessage for the
 * Distribution page's retry button, and never touches the Word's other
 * channels.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const due = await db.notificationLog.findMany({
    where: {
      channel: { in: ["EMAIL", "PUSH"] },
      status: { in: ["NOT_SCHEDULED", "SCHEDULED"] },
      OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
    },
    include: { devotional: true },
  });

  const results: { id: string; channel: string; outcome: string }[] = [];

  for (const log of due) {
    const claim = await db.notificationLog.updateMany({
      where: { id: log.id, status: log.status },
      data: { status: "SENDING" },
    });
    if (claim.count === 0) continue; // another invocation already claimed this row

    try {
      const outcome =
        log.channel === "EMAIL"
          ? await sendEmailChannel(log.devotional)
          : await sendPushChannel(log.devotional);

      await db.notificationLog.update({
        where: { id: log.id },
        data: {
          status: outcome.status,
          sentAt: new Date(),
          recipientCount: outcome.recipientCount,
          failureCount: outcome.failureCount,
          errorMessage: outcome.errorMessage,
        },
      });
      results.push({ id: log.id, channel: log.channel, outcome: outcome.status });
    } catch (err) {
      await db.notificationLog.update({
        where: { id: log.id },
        data: {
          status: "FAILED",
          errorMessage: err instanceof Error ? err.message : "Unknown error",
        },
      });
      results.push({ id: log.id, channel: log.channel, outcome: "FAILED" });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}

interface ChannelOutcome {
  status: "SENT" | "PARTIALLY_FAILED" | "FAILED";
  recipientCount: number;
  failureCount: number;
  errorMessage: string | null;
}

function statusFor(sent: number, failed: number): ChannelOutcome["status"] {
  if (failed === 0) return "SENT";
  return sent > 0 ? "PARTIALLY_FAILED" : "FAILED";
}

async function sendEmailChannel(devotionalRow: PrismaDevotional): Promise<ChannelOutcome> {
  const devotional = await getDevotionalBySlug(devotionalRow.slug);
  if (!devotional) {
    return { status: "FAILED", recipientCount: 0, failureCount: 0, errorMessage: "Devotional not found or not published." };
  }

  const [subscribers, settings] = await Promise.all([
    db.subscriber.findMany({ where: { emailStatus: "SUBSCRIBED" } }),
    db.settings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} }),
  ]);

  const provider = getEmailProvider(settings.emailProvider);

  let sent = 0;
  let failed = 0;
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`;
    const { subject, html, text } = buildDailyWordEmail({ devotional, unsubscribeUrl });
    const result = await provider.send({ to: subscriber.email, subject, html, text });
    if (result.success) {
      sent++;
      await db.subscriber.update({ where: { id: subscriber.id }, data: { lastNotifiedAt: new Date() } });
    } else {
      failed++;
    }
  }

  return {
    status: statusFor(sent, failed),
    recipientCount: sent,
    failureCount: failed,
    errorMessage: failed > 0 ? `${failed} of ${subscribers.length} email send(s) failed.` : null,
  };
}

async function sendPushChannel(devotionalRow: PrismaDevotional): Promise<ChannelOutcome> {
  const { sent, failed } = await sendPushToAllSubscribers({
    title: "Today's Word is ready",
    body: devotionalRow.title,
    url: `${SITE_URL}/devotional/${devotionalRow.slug}`,
  });

  return {
    status: statusFor(sent, failed),
    recipientCount: sent,
    failureCount: failed,
    errorMessage: failed > 0 ? `${failed} push send(s) failed.` : null,
  };
}
