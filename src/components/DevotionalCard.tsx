import Link from "next/link";
import type { DevotionalWithImage } from "@/lib/resolveImage";
import DevotionalImage from "./DevotionalImage";
import { formatShortDate } from "@/lib/date";

interface DevotionalCardProps {
  devotional: DevotionalWithImage;
  /** Alternate the layout so the library doesn't feel like a uniform grid. */
  layout?: "image-top" | "image-side" | "text-only";
}

export default function DevotionalCard({ devotional, layout = "image-top" }: DevotionalCardProps) {
  const d = devotional;

  if (layout === "text-only") {
    return (
      <Link
        href={`/devotional/${d.slug}`}
        className="group block border-t border-charcoal/10 py-8 transition-colors hover:border-forest/40"
      >
        <p className="font-sans text-[0.68rem] font-medium tracking-[0.14em] text-charcoal/60">
          {formatShortDate(d.date)} · {d.scriptureReference}
        </p>
        <h3 className="mt-3 font-serif text-2xl leading-snug text-charcoal transition-colors group-hover:text-forest sm:text-3xl">
          {d.title}
        </h3>
        <p className="mt-2 max-w-xl font-serif italic text-charcoal/60">{d.keyMessage}</p>
      </Link>
    );
  }

  if (layout === "image-side") {
    return (
      <Link href={`/devotional/${d.slug}`} className="group grid grid-cols-5 gap-5 sm:gap-8">
        <DevotionalImage
          image={d.resolvedImage}
          className="col-span-2 aspect-[4/5] rounded-sm"
          creditTone="light"
          creditLinked={false}
        />
        <div className="col-span-3 flex flex-col justify-center">
          <p className="font-sans text-[0.66rem] font-medium tracking-[0.14em] text-charcoal/60">
            {d.topics[0]?.toUpperCase()}
          </p>
          <h3 className="mt-2 font-serif text-xl leading-snug text-charcoal transition-colors group-hover:text-forest sm:text-2xl">
            {d.title}
          </h3>
          <p className="mt-2 hidden font-sans text-sm text-charcoal/60 sm:block">
            {d.scriptureReference}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/devotional/${d.slug}`} className="group block">
      <DevotionalImage image={d.resolvedImage} className="aspect-[4/3] rounded-sm" creditLinked={false} />
      <div className="mt-4">
        <p className="font-sans text-[0.66rem] font-medium tracking-[0.14em] text-charcoal/60">
          {formatShortDate(d.date)} · {d.topics[0]?.toUpperCase()}
        </p>
        <h3 className="mt-2 font-serif text-xl leading-snug text-charcoal transition-colors group-hover:text-forest">
          {d.title}
        </h3>
        <p className="mt-1 font-sans text-sm text-charcoal/60">{d.scriptureReference}</p>
      </div>
    </Link>
  );
}
