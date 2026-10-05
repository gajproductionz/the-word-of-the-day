"use client";

import { useState } from "react";
import Link from "next/link";

export default function UnsubscribeConfirm({ token }: { token: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleUnsubscribe() {
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center">
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">YOU&apos;VE BEEN UNSUBSCRIBED.</h1>
        <p className="mt-5 font-serif text-lg italic text-charcoal/70">
          You can still visit The Word of the Day anytime.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-forest px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-ivory hover:bg-forest-light"
        >
          VISIT THE SITE →
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">Unsubscribe from The Word of the Day?</h1>
      <p className="mt-5 font-sans text-charcoal/70">You&apos;ll no longer receive the morning email.</p>
      {status === "error" && (
        <p className="mt-4 font-sans text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={status === "loading"}
        className="mt-8 inline-flex rounded-full border border-charcoal/30 px-7 py-3.5 font-sans text-xs font-semibold tracking-[0.14em] text-charcoal hover:border-forest hover:text-forest disabled:opacity-60"
      >
        {status === "loading" ? "UNSUBSCRIBING…" : "YES, UNSUBSCRIBE ME"}
      </button>
    </div>
  );
}
