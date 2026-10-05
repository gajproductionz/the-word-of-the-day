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
