"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const transitions: Record<string, { label: string; to: string }[]> = {
  NEW: [
    { label: "MARK PRAYED FOR", to: "PRAYED_FOR" },
    { label: "APPROVE FOR WALL", to: "APPROVED_FOR_WALL" },
    { label: "ARCHIVE", to: "ARCHIVED" },
  ],
  PRAYED_FOR: [
    { label: "APPROVE FOR WALL", to: "APPROVED_FOR_WALL" },
    { label: "ARCHIVE", to: "ARCHIVED" },
  ],
  APPROVED_FOR_WALL: [{ label: "REMOVE FROM WALL", to: "PRAYED_FOR" }, { label: "ARCHIVE", to: "ARCHIVED" }],
  PRIVATE: [{ label: "MARK PRAYED FOR", to: "PRAYED_FOR" }, { label: "ARCHIVE", to: "ARCHIVED" }],
  ARCHIVED: [{ label: "RESTORE TO NEW", to: "NEW" }],
};

export default function PrayerStatusControl({ id, status, isPrivate }: { id: string; status: string; isPrivate: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setStatus(to: string) {
    setLoading(true);
    await fetch(`/api/studio/prayers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    setLoading(false);
    router.refresh();
  }

  const options = (transitions[status] ?? []).filter((t) => !(isPrivate && t.to === "APPROVED_FOR_WALL"));

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((t) => (
        <button
          key={t.to}
          type="button"
          onClick={() => setStatus(t.to)}
          disabled={loading}
          className="rounded-full border border-charcoal/20 px-3 py-1.5 font-sans text-[0.65rem] font-semibold tracking-[0.06em] text-charcoal hover:border-forest hover:text-forest disabled:opacity-50"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
