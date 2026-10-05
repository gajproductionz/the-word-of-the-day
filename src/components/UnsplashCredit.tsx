interface UnsplashCreditProps {
  photographerName: string;
  photographerProfileUrl: string;
  unsplashPhotoUrl: string;
  /** Use on dark/photo backdrops (default) vs. light surfaces. */
  tone?: "light" | "dark";
  /**
   * Render as real, clickable links (default). Set to false when this
   * image sits inside another link (e.g. a whole clickable card) — HTML
   * forbids nesting <a> inside <a>, so those contexts get plain credit
   * text instead. The same photo's full-size use elsewhere (its own
   * devotional page, the hero, etc.) always carries the clickable form,
   * so attribution is still reachable.
   */
  linked?: boolean;
}

/**
 * Small, unobtrusive photo credit required by Unsplash's API Guidelines
 * whenever a photo sourced through the API is displayed: it must credit
 * the photographer and link back to Unsplash.
 */
export default function UnsplashCredit({
  photographerName,
  photographerProfileUrl,
  unsplashPhotoUrl,
  tone = "light",
  linked = true,
}: UnsplashCreditProps) {
  const color = tone === "light" ? "text-ivory/70 hover:text-ivory" : "text-charcoal/50 hover:text-charcoal";

  if (!linked) {
    return (
      <p
        className={`absolute bottom-2 right-2.5 z-10 font-sans text-[0.6rem] tracking-wide ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      >
        Photo by {photographerName} on Unsplash
      </p>
    );
  }

  return (
    <p
      className={`absolute bottom-2 right-2.5 z-10 font-sans text-[0.6rem] tracking-wide ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100`}
    >
      Photo by{" "}
      <a href={photographerProfileUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        {photographerName}
      </a>{" "}
      on{" "}
      <a href={unsplashPhotoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        Unsplash
      </a>
    </p>
  );
}
