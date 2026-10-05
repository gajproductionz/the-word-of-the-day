"use client";

import { useEffect } from "react";

/** Fires one PAGE_VIEW event on mount — see /api/analytics/event. */
export default function TrackPageView({ devotionalId }: { devotionalId: string }) {
  useEffect(() => {
    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PAGE_VIEW", devotionalId }),
      keepalive: true,
    }).catch(() => {
      // Analytics failures should never be visible to the reader.
    });
  }, [devotionalId]);

  return null;
}
