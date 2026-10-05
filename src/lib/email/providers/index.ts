import type { EmailProvider } from "../types";
import { ConsoleEmailProvider } from "./console";

/**
 * Resolves which provider to send through. Add real providers (Resend,
 * Postmark, SES, ...) as new cases here once their API keys are
 * configured — the rest of the app only ever calls EmailProvider.send,
 * so nothing else changes.
 */
export function getEmailProvider(providerName: string): EmailProvider {
  switch (providerName) {
    case "console":
    default:
      return new ConsoleEmailProvider();
  }
}
