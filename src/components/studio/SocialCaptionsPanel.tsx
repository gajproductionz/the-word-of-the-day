"use client";

import { useEffect, useState } from "react";

interface Captions {
  socialCaptionInstagram: string;
  socialCaptionFacebook: string;
  socialCaptionStory: string;
  socialCaptionShort: string;
}

const fields: { key: keyof Captions; label: string }[] = [
  { key: "socialCaptionInstagram", label: "INSTAGRAM CAPTION" },
  { key: "socialCaptionFacebook", label: "FACEBOOK CAPTION" },
  { key: "socialCaptionStory", label: "STORY COPY" },
  { key: "socialCaptionShort", label: "SHORT CAPTION" },
];

export default function SocialCaptionsPanel({ devotionalId }: { devotionalId: string }) {
  const [captions, setCaptions] = useState<Captions | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/studio/devotionals/${devotionalId}`)
      .then((res) => res.json())
      .then((data) => {
        setCaptions({
          socialCaptionInstagram: data.devotional.socialCaptionInstagram ?? "",
          socialCaptionFacebook: data.devotional.socialCaptionFacebook ?? "",
          socialCaptionStory: data.devotional.socialCaptionStory ?? "",
          socialCaptionShort: data.devotional.socialCaptionShort ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [devotionalId]);

  async function save(field: keyof Captions, value: string) {
    if (!captions) return;
    const next = { ...captions, [field]: value };
    setCaptions(next);
    await fetch(`/api/studio/devotionals/${devotionalId}/social`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }

  async function regenerate() {
    setRegenerating(true);
    const res = await fetch(`/api/studio/devotionals/${devotionalId}/social`, { method: "POST" });
    const data = await res.json();
    setCaptions({
      socialCaptionInstagram: data.devotional.socialCaptionInstagram ?? "",
      socialCaptionFacebook: data.devotional.socialCaptionFacebook ?? "",
      socialCaptionStory: data.devotional.socialCaptionStory ?? "",
      socialCaptionShort: data.devotional.socialCaptionShort ?? "",
    });
    setRegenerating(false);
  }

  async function copy(field: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(field);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  if (loading || !captions) {
    return <p className="font-sans text-sm text-charcoal/40">Loading…</p>;
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={regenerate}
        disabled={regenerating}
        className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold tracking-[0.1em] text-charcoal hover:border-forest disabled:opacity-50"
      >
        {regenerating ? "REGENERATING…" : "REGENERATE TEMPLATE"}
      </button>

      {fields.map(({ key, label }) => (
        <div key={key}>
          <div className="flex items-center justify-between">
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              {label}
            </label>
            <button
              type="button"
              onClick={() => copy(key, captions[key])}
              className="font-sans text-[0.65rem] text-charcoal/50 hover:text-forest"
            >
              {copiedKey === key ? "COPIED" : "COPY"}
            </button>
          </div>
          <textarea
            value={captions[key]}
            onChange={(e) => save(key, e.target.value)}
            rows={key === "socialCaptionShort" ? 2 : 5}
            className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
          />
        </div>
      ))}
    </div>
  );
}
