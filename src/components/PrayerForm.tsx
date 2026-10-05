"use client";

import { useState, FormEvent } from "react";

export default function PrayerForm() {
  const [name, setName] = useState("");
  const [request, setRequest] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [shareOnWall, setShareOnWall] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, request, isPrivate, shareOnWall }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setName("");
      setRequest("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-fade-up rounded-sm border border-forest/20 bg-forest/5 px-8 py-10 text-center">
        <p className="font-serif text-2xl text-forest">Your prayer has been received.</p>
        <p className="mt-3 font-sans text-sm text-charcoal/60">
          You are not carrying this alone. We are standing with you.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60 hover:text-forest"
        >
          SUBMIT ANOTHER REQUEST
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prayer-name" className="font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60">
          FIRST NAME / INITIALS
        </label>
        <input
          id="prayer-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sarah, or S.T."
          maxLength={40}
          className="mt-2 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/40 outline-none focus:border-forest"
        />
      </div>

      <div>
        <label htmlFor="prayer-request" className="font-sans text-xs font-semibold tracking-[0.12em] text-charcoal/60">
          HOW CAN WE PRAY FOR YOU?
        </label>
        <textarea
          id="prayer-request"
          required
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          rows={5}
          maxLength={1000}
          placeholder="Share as much or as little as you'd like…"
          className="mt-2 w-full resize-none rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-sans text-sm text-charcoal placeholder:text-charcoal/40 outline-none focus:border-forest"
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => {
              setIsPrivate(e.target.checked);
              if (e.target.checked) setShareOnWall(false);
            }}
            className="mt-0.5 h-4 w-4 accent-forest"
          />
          <span className="font-sans text-sm text-charcoal/80">Keep my request private</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={shareOnWall}
            disabled={isPrivate}
            onChange={(e) => setShareOnWall(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-forest disabled:opacity-40"
          />
          <span className={`font-sans text-sm ${isPrivate ? "text-charcoal/30" : "text-charcoal/80"}`}>
            Share anonymously on the Prayer Wall
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-forest px-6 py-4 font-sans text-xs font-semibold tracking-[0.14em] text-ivory transition-colors hover:bg-forest-light disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "SENDING…" : "SUBMIT PRAYER"}
      </button>

      {status === "error" && (
        <p className="font-sans text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
