import type { Metadata } from "next";
import Atmosphere from "@/components/Atmosphere";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import ReceiveTheWord from "@/components/ReceiveTheWord";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of The Word of the Day — how a morning message to family and friends became a daily invitation to begin the day with God.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <section className="px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-ink">ABOUT</p>
          </Reveal>
          <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-charcoal sm:text-5xl lg:text-6xl">
            <RevealText as="span" text="IT STARTED WITH" className="block" />
            <RevealText as="span" text="A MORNING MESSAGE." className="block" />
          </h1>

          <Reveal delay={0.1}>
            <div className="mt-12 space-y-6 font-serif text-lg leading-[1.8] text-charcoal/85 sm:text-xl">
              <p className="drop-cap">
                It began the way most meaningful things do — small, quiet, and without any plan
                to become more than it was. A short Scripture. A few honest thoughts. A prayer.
                Sent early in the morning to family and friends, before the day had a chance to
                get loud.
              </p>
              <p>
                The messages always began the same way:{" "}
                <span className="italic">Good Morning Family</span>. And they always ended the
                same way, too — a simple signature at the bottom, after the amen:{" "}
                <span className="italic">— TheWordofTheDay</span>.
              </p>
              <p>
                There was no strategy behind it. Just a conviction that Scripture read first
                thing in the morning changes the shape of a day — and a willingness to share
                whatever God placed on the heart before anything else could crowd it out.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-near-black px-5 py-28 text-center sm:px-10 sm:py-36">
        <div className="grain" aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <p className="font-sans text-xs font-semibold tracking-[0.2em] text-gold-soft">
              THE MESSAGE BECAME
              <br />
              A MISSION.
            </p>
          </Reveal>
          <RevealText
            as="p"
            text="Help people intentionally begin their day with God."
            stagger={45}
            className="mt-8 block font-serif text-3xl italic leading-relaxed text-ivory sm:text-4xl"
          />
        </div>
      </section>

      <section className="px-5 py-24 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-5 sm:gap-14">
          <Reveal className="sm:col-span-2">
            <Atmosphere
              treatment="window-light"
              alt="Placeholder portrait space reserved for founder photography"
              className="aspect-[4/5] rounded-sm"
            />
          </Reveal>
          <Reveal delay={0.1} className="sm:col-span-3">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-ink">
              MEET GEORGE
            </p>
            <div className="mt-5 space-y-5 font-serif text-lg leading-[1.8] text-charcoal/85">
              <p>
                George isn&apos;t a pastor or a theologian — just someone trying to walk closely
                with God, one morning at a time, and willing to share what that walk looks like
                along the way.
              </p>
              <p>
                What started as messages to the people closest to him has grown into The Word of
                the Day, but the heart behind it hasn&apos;t changed: honest reflection on
                Scripture, offered freely, for anyone who needs a Word for today.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-charcoal/10 bg-ivory-deep px-5 py-24 sm:px-10">
        <ReceiveTheWord />
      </section>
    </div>
  );
}
