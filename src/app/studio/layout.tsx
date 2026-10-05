import type { Metadata } from "next";

// Never index the private admin — belt-and-suspenders alongside the
// auth gate in middleware.ts.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory text-charcoal">{children}</div>;
}
