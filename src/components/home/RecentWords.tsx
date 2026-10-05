import Link from "next/link";
import type { DevotionalWithImage } from "@/lib/resolveImage";
import DevotionalCard from "../DevotionalCard";
import Reveal from "../Reveal";

export default function RecentWords({ devotionals }: { devotionals: DevotionalWithImage[] }) {
  return (
    <section className="bg-ivory px-5 py-24 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">Recent Words</h2>
            <Link
              href="/devotionals"
              className="font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60 transition-colors hover:text-forest"
            >
              VIEW ALL →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {devotionals.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.08}>
              <DevotionalCard devotional={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
