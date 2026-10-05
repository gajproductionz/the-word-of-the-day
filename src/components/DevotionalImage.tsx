import Image from "next/image";
import type { ReactNode } from "react";
import type { ResolvedImage } from "@/content/types";
import Atmosphere, { type AtmosphereTreatment } from "./Atmosphere";
import UnsplashCredit from "./UnsplashCredit";

interface DevotionalImageProps {
  image: ResolvedImage;
  className?: string;
  grain?: boolean;
  priority?: boolean;
  creditTone?: "light" | "dark";
  /** Pass false when this image sits inside another <a> (e.g. a clickable card) — see UnsplashCredit. */
  creditLinked?: boolean;
  children?: ReactNode;
}

/**
 * Renders a devotional's image: a real Unsplash photo (with required
 * attribution) when one has been resolved, or the Atmosphere gradient
 * treatment as a fallback — so every devotional always has a considered
 * visual, Unsplash key or not. See src/lib/resolveImage.ts.
 */
export default function DevotionalImage({
  image,
  className = "",
  grain = true,
  priority = false,
  creditTone = "light",
  creditLinked = true,
  children,
}: DevotionalImageProps) {
  if (image.kind === "atmosphere") {
    return (
      <Atmosphere
        treatment={image.treatment as AtmosphereTreatment}
        alt={image.alt}
        className={className}
        grain={grain}
      >
        {children}
      </Atmosphere>
    );
  }

  const hasOwnPosition = /\b(absolute|fixed|sticky|relative)\b/.test(className);

  return (
    <div className={`group overflow-hidden ${hasOwnPosition ? "" : "relative"} ${className}`}>
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
        priority={priority}
      />
      {grain && <div className="grain" aria-hidden="true" />}
      {children}
      <UnsplashCredit
        photographerName={image.photographerName}
        photographerProfileUrl={image.photographerProfileUrl}
        unsplashPhotoUrl={image.unsplashPhotoUrl}
        tone={creditTone}
        linked={creditLinked}
      />
    </div>
  );
}
