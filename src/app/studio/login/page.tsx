import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/studio/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Studio",
  robots: { index: false, follow: false },
};

export default function StudioLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <p className="font-serif text-lg leading-tight text-charcoal">
        THE WORD
        <br />
        OF THE DAY
      </p>
      <p className="mt-2 font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">STUDIO</p>

      <div className="mt-10 w-full max-w-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
