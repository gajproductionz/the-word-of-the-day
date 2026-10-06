import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePublicContent } from "@/lib/studio/revalidate";
import { generateSocialCaptions } from "@/lib/socialCaptions";
import { getPublishIssues } from "@/lib/validation";
import { toPublishCheckInput } from "@/lib/studio/saveDevotional";
import type { Devotional as PublicDevotional } from "@/content/types";

/**
 * Publishing a devotional does four things atomically: makes it the
 * featured Word (unsetting any previous one), marks it PUBLISHED, queues
 * a NotificationLog row per enabled channel (idempotency-keyed so a
 * retry can never double-send — see schema.prisma), and generates its
 * social captions. Actual email/push *sending* happens elsewhere (a
 * separate worker/cron reading NOT_SCHEDULED/SCHEDULED rows) — this
 * route only ever queues, and failures there never block publication
 * (see brief section 29).
 */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const devotional = await db.devotional.findUnique({
    where: { id },
    include: { topics: true, series: true },
  });
  if (!devotional) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const issues = getPublishIssues(toPublishCheckInput(devotional));
  if (issues.length > 0) {
    return NextResponse.json(
      { error: `Before publishing, fill in: ${issues.join(", ")}.` },
      { status: 400 }
    );
  }

  const now = new Date();

  const published = await db.$transaction(async (tx) => {
    // Only one devotional is ever "featured" at a time.
    await tx.devotional.updateMany({
      where: { featured: true, id: { not: id } },
      data: { featured: false },
    });

    return tx.devotional.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        featured: true,
        publishAt: devotional.publishAt ?? now,
      },
      include: { topics: true, series: true },
    });
  });

  // Queue distribution — idempotency key means re-publishing (or a
  // crashed retry) never creates a duplicate send for a channel that
  // already has one queued for this Word.
  const channels: Array<{ channel: "EMAIL" | "PUSH" | "SOCIAL"; enabled: boolean; sendAt: Date | null }> = [
    { channel: "EMAIL", enabled: published.emailEnabled, sendAt: published.emailSendAt },
    { channel: "PUSH", enabled: published.pushEnabled, sendAt: published.pushSendAt },
    { channel: "SOCIAL", enabled: published.socialEnabled, sendAt: null },
  ];

  for (const { channel, enabled, sendAt } of channels) {
    if (!enabled) continue;
    const idempotencyKey = `${published.id}:${channel}`;
    await db.notificationLog.upsert({
      where: { idempotencyKey },
      create: {
        devotionalId: published.id,
        channel,
        status: sendAt ? "SCHEDULED" : "NOT_SCHEDULED",
        scheduledAt: sendAt,
        idempotencyKey,
      },
      update: {}, // Already queued — never overwrite a row that may have since sent.
    });
  }

  if (published.socialEnabled && !published.socialCaptionInstagram) {
    const publicShape: Pick<
      PublicDevotional,
      "slug" | "title" | "scriptureReference" | "keyMessage"
    > = {
      slug: published.slug,
      title: published.title,
      scriptureReference: published.scriptureReference,
      keyMessage: published.keyMessage,
    };
    const captions = generateSocialCaptions(publicShape as PublicDevotional);
    await db.devotional.update({
      where: { id },
      data: {
        socialCaptionInstagram: captions.instagram,
        socialCaptionFacebook: captions.facebook,
        socialCaptionStory: captions.story,
        socialCaptionShort: captions.short,
      },
    });
  }

  revalidatePublicContent(published);

  return NextResponse.json({ success: true, devotional: published });
}
