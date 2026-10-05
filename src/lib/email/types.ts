export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailSendResult {
  success: boolean;
  /** The provider's own message/send id, for later status lookups. */
  providerId?: string;
  error?: string;
}

/**
 * Every email provider (Resend, Postmark, SES, ...) implements this one
 * method. Swapping providers is adding a new file under ./providers and
 * one line in providers/index.ts — nothing that calls sendEmail needs to
 * change. See providers/console.ts for the default (no real delivery).
 */
export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<EmailSendResult>;
}
