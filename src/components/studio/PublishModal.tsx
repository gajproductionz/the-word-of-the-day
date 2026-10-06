"use client";

import { formatLongDate } from "@/lib/date";

interface PublishModalProps {
  title: string;
  scriptureReference: string;
  date: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  error?: string | null;
}

export default function PublishModal({
  title,
  scriptureReference,
  date,
  onConfirm,
  onCancel,
  loading,
  error,
}: PublishModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-near-black/60 px-5">
      <div className="w-full max-w-md rounded-sm bg-ivory p-8">
        <p className="font-sans text-xs font-semibold tracking-[0.18em] text-gold-ink">READY TO PUBLISH?</p>
        <h2 className="mt-3 font-serif text-2xl text-charcoal">{title || "Untitled Word"}</h2>
        <p className="mt-1 font-sans text-sm text-charcoal/60">
          {scriptureReference ? `${scriptureReference} KJV` : ""}
        </p>
        <p className="mt-1 font-sans text-sm text-charcoal/60">{date ? formatLongDate(date) : ""}</p>

        <div className="mt-6 space-y-1.5 font-sans text-sm text-charcoal/80">
          <p>Publishing will:</p>
          <ul className="list-disc space-y-1 pl-5 text-charcoal/70">
            <li>Make this today&apos;s featured Word</li>
            <li>Add it to the devotional archive</li>
            <li>Add it to relevant topic pages</li>
            <li>Add it to Scripture/book pages</li>
            <li>Make it searchable</li>
            <li>Update homepage content</li>
          </ul>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-sm bg-red-700/10 px-4 py-3 font-sans text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-forest px-5 py-3 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light disabled:opacity-60"
          >
            {loading ? "PUBLISHING…" : "PUBLISH WORD"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-charcoal/20 px-5 py-3 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
