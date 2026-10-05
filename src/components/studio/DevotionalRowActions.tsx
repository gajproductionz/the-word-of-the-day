"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function DevotionalRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDuplicate() {
    setLoading("duplicate");
    const res = await fetch(`/api/studio/devotionals/${id}/duplicate`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (res.ok) router.push(`/studio/devotionals/${data.devotional.id}`);
  }

  async function handleArchive() {
    if (!confirm("Archive this Word? It will come off the public site but won't be deleted.")) return;
    setLoading("archive");
    await fetch(`/api/studio/devotionals/${id}/archive`, { method: "POST" });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Link href={`/studio/devotionals/${id}`} className="font-sans text-xs font-semibold text-charcoal hover:text-forest">
        EDIT
      </Link>
      <button
        type="button"
        onClick={handleDuplicate}
        disabled={loading !== null}
        className="font-sans text-xs font-semibold text-charcoal/60 hover:text-forest disabled:opacity-50"
      >
        {loading === "duplicate" ? "…" : "DUPLICATE"}
      </button>
      {status !== "ARCHIVED" && (
        <button
          type="button"
          onClick={handleArchive}
          disabled={loading !== null}
          className="font-sans text-xs font-semibold text-charcoal/60 hover:text-red-700 disabled:opacity-50"
        >
          {loading === "archive" ? "…" : "ARCHIVE"}
        </button>
      )}
    </div>
  );
}
