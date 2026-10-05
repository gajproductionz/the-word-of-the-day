import webpush from "web-push";
import { db } from "@/lib/db";

interface PushPayload {
  title: string;
  body: string;
  url: string;
}

interface WebPushError extends Error {
  statusCode?: number;
}

/**
 * Sends one push notification to every active subscriber. Unlike email
 * (which ships a no-op console provider — no account needed to try it),
 * this is a real, working sender: VAPID keys are generated locally with
 * no external service required (see .env.local.example). Not wired to
 * run automatically on publish — call it from a cron route or an admin
 * action once you're ready to actually notify people.
 */
export async function sendPushToAllSubscribers(
  payload: PushPayload
): Promise<{ sent: number; failed: number }> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.warn("[push] VAPID keys not configured — see .env.local.example. Skipping send.");
    return { sent: 0, failed: 0 };
  }

  webpush.setVapidDetails("mailto:hello@thewordoftheday.example", publicKey, privateKey);

  const subscriptions = await db.pushSubscription.findMany({ where: { revokedAt: null } });

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
      sent++;
    } catch (err) {
      failed++;
      const statusCode = (err as WebPushError).statusCode;
      // 404/410 means the subscription is gone for good — stop trying it.
      if (statusCode === 404 || statusCode === 410) {
        await db.pushSubscription.update({ where: { id: sub.id }, data: { revokedAt: new Date() } });
      }
    }
  }

  return { sent, failed };
}
