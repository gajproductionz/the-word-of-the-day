"use client";

import { useLayoutEffect, useRef } from "react";

interface RevealTextProps {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "blockquote" | "span";
  className?: string;
  /** Milliseconds between each word's reveal. */
  stagger?: number;
  /** Starting offset (px) each word rises from. */
  y?: number;
}

/**
 * Reveals text word-by-word as it scrolls into view — Scripture and major
 * headings "coming alive" rather than appearing all at once. Built on the
 * same progressive-enhancement approach as Reveal.tsx: the server-rendered
 * (and first client-rendered) markup is the plain, fully visible text —
 * nothing is hidden until a layout effect imperatively hides each word
 * right before paint, so there's no flash and no dependency on JS for the
 * text to simply be there (no-JS, slow JS, and crawlers all just see the
 * full sentence). Respects prefers-reduced-motion by skipping the
 * hide-and-reveal entirely.
 */
export default function RevealText({
  text,
  as = "span",
  className = "",
  stagger = 35,
  y = 16,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = Array.from(container.querySelectorAll<HTMLSpanElement>("[data-reveal-word]"));
    words.forEach((word, i) => {
      word.style.opacity = "0";
      word.style.transform = `translateY(${y}px)`;
      word.style.transition = `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            words.forEach((word) => {
              word.style.opacity = "1";
              word.style.transform = "translateY(0)";
            });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [stagger, y]);

  const tokens = text.split(/(\s+)/);
  const Tag = as;

  return (
    <Tag ref={containerRef as never} className={className}>
      {tokens.map((token, i) =>
        /^\s+$/.test(token) ? (
          token
        ) : (
          <span key={i} className="inline-block overflow-hidden align-top">
            <span data-reveal-word className="inline-block">
              {token}
            </span>
          </span>
        )
      )}
    </Tag>
  );
}
