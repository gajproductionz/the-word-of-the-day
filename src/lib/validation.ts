import { z } from "zod";

/** Shared validation for the devotional editor and its autosave/publish API routes. */
export const devotionalInputSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  date: z.string().trim().min(1, "Date is required"),
  title: z.string().trim().min(1, "Title is required").max(200),
  book: z.string().trim().min(1, "Book is required"),
  chapter: z.coerce.number().int().positive(),
  verseStart: z.coerce.number().int().positive(),
  verseEnd: z.coerce.number().int().positive().nullable().optional(),
  scriptureReference: z.string().trim().min(1, "Scripture reference is required"),
  scriptureText: z.string().trim().min(1, "Scripture text is required"),
  keyMessage: z.string().trim().min(1, "Key message is required").max(300),
  reflection: z.array(z.string().trim().min(1)).min(1, "At least one reflection paragraph is required"),
  reflectionQuestion: z.string().trim().min(1, "Today's question is required"),
  prayer: z.string().trim().min(1, "Prayer is required"),
  topics: z.array(z.string()).default([]),
  seriesSlug: z.string().nullable().optional(),
  seriesDay: z.coerce.number().int().positive().nullable().optional(),
  featuredImage: z.string().trim().min(1, "Choose a fallback image treatment"),
  featuredImageAlt: z.string().trim().min(1, "Alt text is required"),
  unsplashQuery: z.string().trim().nullable().optional(),
  seoTitle: z.string().trim().min(1, "SEO title is required").max(200),
  seoDescription: z.string().trim().min(1, "SEO description is required").max(300),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  publishAt: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  emailEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(true),
  socialEnabled: z.boolean().default(false),
  audioUrl: z.string().trim().nullable().optional(),
  audioDuration: z.coerce.number().int().positive().nullable().optional(),
});

export type DevotionalInput = z.infer<typeof devotionalInputSchema>;

/**
 * A draft is allowed to be incomplete — this is what ordinary autosave
 * (create + every PATCH while writing) validates against, so the very
 * first keystroke in a brand-new Word can save immediately instead of
 * 400ing until every field is filled in. Structural fields (slug, date,
 * numbers, status) still validate for real, since those can never be
 * blank without corrupting the row. Only publishing enforces full
 * completeness — see getPublishIssues below.
 */
export const devotionalDraftSchema = devotionalInputSchema.extend({
  title: z.string().trim().max(200).default(""),
  book: z.string().trim().default("Psalm"),
  // A momentarily-cleared number field while retyping (e.g. backspacing
  // "8" before typing "9") would otherwise 400 an autosave mid-keystroke.
  chapter: z.coerce.number().int().positive().catch(1),
  verseStart: z.coerce.number().int().positive().catch(1),
  scriptureReference: z.string().trim().default(""),
  scriptureText: z.string().trim().default(""),
  keyMessage: z.string().trim().max(300).default(""),
  reflection: z.array(z.string()).default([""]),
  reflectionQuestion: z.string().trim().default(""),
  prayer: z.string().trim().default(""),
  featuredImage: z.string().trim().default("sunrise-ridge"),
  featuredImageAlt: z.string().trim().default(""),
  seoTitle: z.string().trim().max(200).default(""),
  seoDescription: z.string().trim().max(300).default(""),
});

const PUBLISH_FIELD_LABELS: Record<string, string> = {
  title: "Title",
  book: "Bible book",
  scriptureReference: "Scripture reference",
  scriptureText: "Scripture text",
  keyMessage: "Key message",
  reflection: "Reflection",
  reflectionQuestion: "Reflection question",
  prayer: "Prayer",
  featuredImage: "Fallback image",
  featuredImageAlt: "Image alt text",
  seoTitle: "SEO title",
  seoDescription: "SEO description",
};

/**
 * What's missing before a devotional can go live — used by the publish
 * and schedule routes so "didn't work" always comes with a specific,
 * actionable reason instead of a silent failure. Empty array means ready.
 */
export function getPublishIssues(data: unknown): string[] {
  const parsed = devotionalInputSchema.safeParse(data);
  if (parsed.success) return [];
  const labels = new Set<string>();
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "");
    labels.add(PUBLISH_FIELD_LABELS[key] ?? key);
  }
  return [...labels];
}

export const prayerSubmissionSchema = z.object({
  name: z.string().trim().max(60).optional().default(""),
  request: z.string().trim().min(1, "Please share your prayer request.").max(1000),
  isPrivate: z.boolean().default(true),
  shareOnWall: z.boolean().default(false),
});

export const subscribeSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  source: z.string().trim().default("unknown"),
});
