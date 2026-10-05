import type { Metadata } from "next";
import { getWallPrayers } from "@/lib/prayerStore";
import PrayerForm from "@/components/PrayerForm";
import PrayerWall from "@/components/PrayerWall";
import RevealText from "@/components/RevealText";

export const metadata: Metadata = {
  title: "Prayer",
  description:
    "You don't have to carry it alone. Submit a prayer request, privately or shared on the Prayer Wall, and let someone stand with you.",
  alternates: { canonical: "/prayer" },
};

export const dynamic = "force-dynamic";

export default async function PrayerPage() {
  const wallPrayers = await getWallPrayers();

  return (
    <div>
      <section className="bg-forest-deep px-5 py-24 text-center sm:px-10 sm:py-32">
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">PRAYER</p>
        <h1 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
          <RevealText as="span" text="YOU DON'T HAVE" className="block" />
          <RevealText as="span" text="TO CARRY IT ALONE." className="block" />
        </h1>
        <p className="mx-auto mt-6 max-w-md font-serif text-lg italic text-ivory/75">
          How can we pray for you?
        </p>
      </section>

      <section className="px-5 py-20 sm:px-10">
        <div className="mx-auto max-w-xl">
          <PrayerForm />
        </div>
      </section>

      <section className="border-t border-charcoal/10 bg-ivory-deep px-5 py-20 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">PRAYER WALL</p>
          <h2 className="mt-4 font-serif text-3xl text-charcoal sm:text-4xl">
            Carried together.
          </h2>
          <p className="mt-3 max-w-lg font-sans text-sm text-charcoal/60">
            Shared requests from the community. Tap to let someone know you prayed for them.
          </p>
          <div className="mt-12">
            <PrayerWall initialPrayers={wallPrayers} />
          </div>
        </div>
      </section>
    </div>
  );
}
