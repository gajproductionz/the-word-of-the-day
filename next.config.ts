import type { NextConfig } from "next";

// Resolved at build time and inlined everywhere NEXT_PUBLIC_SITE_URL is
// referenced (server AND client bundles) — see src/lib/site.ts. Doing the
// Vercel-URL lookup here, rather than at runtime in site.ts, matters
// because only NEXT_PUBLIC_-prefixed values get inlined into client
// bundles; VERCEL_PROJECT_PRODUCTION_URL on its own would resolve fine in
// server-rendered metadata but silently be undefined in client components
// like ShareBar.
const resolvedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

const nextConfig: NextConfig = {
  env: {
    ...(resolvedSiteUrl ? { NEXT_PUBLIC_SITE_URL: resolvedSiteUrl } : {}),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
