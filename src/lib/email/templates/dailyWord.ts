import type { Devotional } from "@/content/types";
import { SITE_URL } from "@/lib/site";

interface DailyWordEmailInput {
  devotional: Devotional;
  unsubscribeUrl: string;
}

/**
 * The daily "come back to the site" nudge — deliberately short. It does
 * not contain the full devotional; its only job is getting the reader to
 * click through, per the product brief.
 */
export function buildDailyWordEmail({ devotional: d, unsubscribeUrl }: DailyWordEmailInput) {
  const wordUrl = `${SITE_URL}/devotional/${d.slug}`;
  const subject = `Good morning family ☀️ — ${d.title}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f7f3ec;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f3ec;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:28px;text-align:center;">
                <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;color:#7a5c28;text-transform:uppercase;">The Word of the Day</span>
              </td>
            </tr>
            <tr>
              <td style="background-color:#15140f;border-radius:4px;padding:40px 32px;text-align:center;">
                <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;color:#f7f3ec;opacity:0.85;">
                  GOOD MORNING FAMILY ☀️
                </p>
                <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#c9a568;text-transform:uppercase;">
                  Today&rsquo;s Word
                </p>
                <h1 style="margin:0 0 16px;font-size:30px;line-height:1.15;color:#f7f3ec;font-weight:normal;">
                  ${escapeHtml(d.title)}
                </h1>
                <p style="margin:0 0 20px;font-size:13px;letter-spacing:1px;color:#c9a568;">
                  ${escapeHtml(d.scriptureReference)}
                </p>
                <p style="margin:0 0 32px;font-size:18px;line-height:1.6;color:#f7f3ec;font-style:italic;">
                  &ldquo;${escapeHtml(d.keyMessage)}&rdquo;
                </p>
                <a href="${wordUrl}" style="display:inline-block;background-color:#f7f3ec;color:#0b0b09;text-decoration:none;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1.5px;font-weight:bold;padding:14px 28px;border-radius:999px;">
                  RECEIVE TODAY&rsquo;S WORD →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding-top:28px;text-align:center;">
                <p style="margin:0 0 4px;font-size:14px;color:#15140f;">— TheWordofTheDay</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:24px;text-align:center;font-family:Arial,sans-serif;">
                <a href="${unsubscribeUrl}" style="font-size:11px;color:#8a8370;text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "GOOD MORNING FAMILY",
    "",
    `Today's Word: ${d.title}`,
    d.scriptureReference,
    "",
    `"${d.keyMessage}"`,
    "",
    `Receive today's Word: ${wordUrl}`,
    "",
    "— TheWordofTheDay",
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
