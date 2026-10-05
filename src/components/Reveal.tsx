"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/**
 * Gentle, scroll-triggered fade-up — a progressive enhancement, not a
 * requirement for content to be visible. The server-rendered (and first
 * client-rendered) markup has no hidden state, so content is always
 * visible without JavaScript, to search crawlers, and if the animation
 * fails for any reason. A layout effect then hides the element
 * synchronously (before the browser paints, so there's no visible flash)
 * and an IntersectionObserver reveals it as it scrolls into view.
 * Respects prefers-reduced-motion by skipping the hide step entirely.
 */
export default function Reveal({ children, className = "", delay = 0, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    el.style.opacity = "0";
    el.style.transform = `translateY(${y}px)`;
    el.style.transition = `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
