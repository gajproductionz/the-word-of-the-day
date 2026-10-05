"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetryNotificationButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function retry() {
    setLoading(true);
    await fetch(`/api/studio/notifications/${id}/retry`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={retry}
      disabled={loading}
      className="rounded-full border border-red-700/30 px-3 py-1 font-sans text-[0.65rem] font-semibold text-red-700 hover:bg-red-700/5 disabled:opacity-50"
    >
      {loading ? "RETRYING…" : "RETRY"}
    </button>
  );
}
