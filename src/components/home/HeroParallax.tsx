"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Gives the hero's text block real movement tied to scrolling, not just
 * an entrance: as the page scrolls, the text drifts upward slightly
 * faster than the page itself and softens out — a subtle depth/parallax
 * effect, on top of the one-time entrance animation and the continuous
 * "breathing" scale on the headline. Transform + opacity only (GPU
 * composited, no layout thrash). Skipped entirely for
 * prefers-reduced-motion.
 */
export default function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    const range = 600; // px of scroll over which the effect fully resolves
    let ticking = false;

    function update() {
      ticking = false;
      const progress = Math.min(1, window.scrollY / range);
      if (el) {
        el.style.transform = `translateY(${progress * -160}px) scale(${1 + progress * 0.08})`;
        el.style.opacity = `${1 - progress}`;
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={ref}>{children}</div>;
}
