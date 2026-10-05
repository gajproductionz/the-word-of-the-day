import type { EmailProvider, EmailMessage, EmailSendResult } from "../types";

/**
 * The default provider: logs instead of actually sending. This is what
 * ships until a real provider (Resend, Postmark, SES, ...) is connected
 * — it lets the whole scheduling/status/idempotency pipeline be built,
 * tested, and used for real right now, with no external account needed.
 *
 * To connect a real provider: implement EmailProvider in a new file
 * here, add it to the switch in ./index.ts, and set `emailProvider` in
 * Studio > Settings (or the Settings table) to its name. Nothing else
 * in the app needs to change.
 */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";

  async send(message: EmailMessage): Promise<EmailSendResult> {
    console.log(
      `[email:console] would send to ${message.to} — subject: "${message.subject}"`
    );
    return { success: true, providerId: `console-${Date.now()}` };
  }
}
