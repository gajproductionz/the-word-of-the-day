import Link from "next/link";
import Reveal from "../Reveal";

export default function PrayerInvite() {
  return (
    <section className="bg-ivory px-5 py-20 sm:px-10">
      <Reveal>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 border-y border-charcoal/10 py-12 sm:flex-row sm:items-center">
          <p className="max-w-md font-serif text-2xl leading-snug text-charcoal sm:text-3xl">
            Need someone to stand with you in prayer?
          </p>
          <Link
            href="/prayer"
            className="whitespace-nowrap rounded-full border border-charcoal/25 px-6 py-3 font-sans text-xs font-semibold tracking-[0.14em] text-charcoal transition-colors hover:border-forest hover:text-forest"
          >
            SUBMIT A PRAYER →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
