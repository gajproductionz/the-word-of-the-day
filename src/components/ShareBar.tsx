"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site";

interface ShareBarProps {
  title: string;
  url: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  // Built from a fixed site constant (not window.location) so the server
  // and client render identical markup — avoids a hydration mismatch.
  const fullUrl = new URL(url, SITE_URL).toString();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
      } catch {
        // user cancelled share — no-op
      }
    }
  }

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-medium tracking-wide text-charcoal transition-colors hover:border-forest hover:text-forest"
      >
        {copied ? "LINK COPIED" : "COPY LINK"}
      </button>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-medium tracking-wide text-charcoal transition-colors hover:border-forest hover:text-forest"
        >
          {l.label.toUpperCase()}
        </a>
      ))}
      <button
        type="button"
        onClick={nativeShare}
        className="hidden rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-medium tracking-wide text-charcoal transition-colors hover:border-forest hover:text-forest [@media(hover:none)]:inline-flex"
      >
        SHARE
      </button>
    </div>
  );
}
