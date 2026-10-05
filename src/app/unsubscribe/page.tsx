import type { Metadata } from "next";
import Link from "next/link";
import UnsubscribeConfirm from "@/components/UnsubscribeConfirm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24">
      {token ? (
        <UnsubscribeConfirm token={token} />
      ) : (
        <div className="text-center">
          <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">Link not found.</h1>
          <p className="mt-5 font-sans text-charcoal/70">
            This unsubscribe link is missing its token. Use the link from your email directly.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-forest px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-ivory hover:bg-forest-light"
          >
            VISIT THE SITE →
          </Link>
        </div>
      )}
    </div>
  );
}
