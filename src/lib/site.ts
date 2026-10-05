/**
 * The canonical site URL — feeds canonical links, the sitemap, Open Graph
 * tags, and share links. Resolved in next.config.ts (so the same value is
 * inlined into both server and client bundles): NEXT_PUBLIC_SITE_URL if
 * set, else Vercel's stable production domain, else this placeholder for
 * local development.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thewordoftheday.example";
