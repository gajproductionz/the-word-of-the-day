"use client";

import { useState } from "react";
import DevotionalReader, { type DevotionalReaderData } from "@/components/DevotionalReader";
import type { AtmosphereTreatment } from "@/components/Atmosphere";

const viewports = {
  desktop: { width: "100%", label: "DESKTOP" },
  tablet: { width: "768px", label: "TABLET" },
  mobile: { width: "390px", label: "MOBILE" },
} as const;

type ViewportKey = keyof typeof viewports;

interface LivePreviewProps {
  devotional: DevotionalReaderData;
  featuredImage: string;
  featuredImageAlt: string;
}

/**
 * Renders the exact public DevotionalReader component with the draft's
 * current fields — "what readers will see" is never a separate mockup
 * that can drift from the real template.
 */
export default function LivePreview({ devotional, featuredImage, featuredImageAlt }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportKey>("desktop");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-center gap-2 border-b border-charcoal/10 bg-ivory-deep/60 px-4 py-3">
        {(Object.keys(viewports) as ViewportKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setViewport(key)}
            className={`rounded-full px-4 py-1.5 font-sans text-[0.65rem] font-semibold tracking-[0.1em] transition-colors ${
              viewport === key ? "bg-forest text-ivory" : "text-charcoal/60 hover:bg-charcoal/5"
            }`}
          >
            {viewports[key].label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto bg-charcoal/5 p-6">
        <div
          className="mx-auto bg-ivory shadow-lg transition-[width] duration-300"
          style={{ width: viewports[viewport].width, maxWidth: "100%" }}
        >
          <DevotionalReader
            devotional={devotional}
            heroImage={{
              kind: "atmosphere",
              treatment: featuredImage as AtmosphereTreatment,
              alt: featuredImageAlt || devotional.title,
            }}
            showReadingProgress={false}
          />
        </div>
      </div>
    </div>
  );
}
