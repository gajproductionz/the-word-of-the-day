import type { Metadata } from "next";
import { emotionWords } from "@/content";
import NeedAWordExperience from "@/components/NeedAWordExperience";
import RevealText from "@/components/RevealText";

export const metadata: Metadata = {
  title: "I Need a Word",
  description:
    "Whatever you're facing today — discouragement, fear, waiting, grief — there is Scripture for it. Find a Word for exactly where you are.",
  alternates: { canonical: "/need-a-word" },
};

export default function NeedAWordPage() {
  return (
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">I NEED A WORD</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-charcoal sm:text-6xl lg:text-7xl">
          <RevealText as="span" text="WHAT ARE YOU" className="block" />
          <RevealText as="span" text="FACING TODAY?" className="block" />
        </h1>
        <p className="mt-6 max-w-lg font-serif text-xl italic text-charcoal/70">
          Whatever you&apos;re carrying, there is Scripture for it.
        </p>

        <div className="mt-16">
          <NeedAWordExperience emotions={emotionWords} />
        </div>
      </div>
    </div>
  );
}
