import type { Devotional } from "@/content/types";
import { SITE_URL } from "@/lib/site";

export interface SocialCaptionSet {
  instagram: string;
  facebook: string;
  story: string;
  short: string;
}

/**
 * Template-based social copy generated at publish time — editable and
 * regenerable afterward (see the Studio editor's Social panel), never
 * posted automatically. Posting to external networks is explicitly out
 * of scope until a provider is connected and authorized.
 */
export function generateSocialCaptions(d: Devotional): SocialCaptionSet {
  const url = `${SITE_URL}/devotional/${d.slug}`;

  const instagram = [
    "GOOD MORNING FAMILY ☀️",
    "",
    `Today's Word is ${d.title}.`,
    "",
    `${d.scriptureReference} reminds us: ${d.keyMessage}`,
    "",
    "Today's full Word is waiting.",
    `Read today's devotional → ${url}`,
    "",
    "— TheWordofTheDay",
  ].join("\n");

  const facebook = [
    `GOOD MORNING FAMILY ☀️ Today's Word is "${d.title}."`,
    "",
    `${d.scriptureReference} — ${d.keyMessage}`,
    "",
    `Read today's full devotional: ${url}`,
  ].join("\n");

  const story = [d.title.toUpperCase(), d.scriptureReference, "", "Tap to read →"].join("\n");

  const short = `${d.title} — ${d.scriptureReference}. ${d.keyMessage} ${url}`;

  return { instagram, facebook, story, short };
}
