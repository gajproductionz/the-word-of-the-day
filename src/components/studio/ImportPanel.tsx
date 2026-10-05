"use client";

import { useState } from "react";
import { parsePastedDevotional, type ParsedDevotional } from "@/lib/importParser";

interface ImportPanelProps {
  onApply: (parsed: ParsedDevotional) => void;
  onClose: () => void;
}

/**
 * Local, non-AI heuristic import — see src/lib/importParser.ts. Every
 * suggestion is shown editable before it touches the real form; nothing
 * is applied until the admin clicks Apply.
 */
export default function ImportPanel({ onApply, onClose }: ImportPanelProps) {
  const [raw, setRaw] = useState("");
  const [parsed, setParsed] = useState<ParsedDevotional | null>(null);

  function handleParse() {
    setParsed(parsePastedDevotional(raw));
  }

  function updateField<K extends keyof ParsedDevotional>(key: K, value: ParsedDevotional[K]) {
    if (!parsed) return;
    setParsed({ ...parsed, [key]: value });
  }

  return (
    <div className="rounded-sm border border-gold/30 bg-gold/5 p-5">
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs font-semibold tracking-[0.14em] text-gold-ink">IMPORT A WORD</p>
        <button type="button" onClick={onClose} className="font-sans text-xs text-charcoal/50 hover:text-charcoal">
          CLOSE
        </button>
      </div>

      {!parsed ? (
        <>
          <p className="mt-2 font-sans text-sm text-charcoal/60">
            Paste an already-written devotional below. We&apos;ll suggest how it maps to each field —
            you can fix anything before it touches your draft.
          </p>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            placeholder="Paste your full devotional text here…"
            className="mt-3 w-full resize-y rounded-sm border border-charcoal/20 bg-white/70 px-4 py-3 font-sans text-sm text-charcoal outline-none focus:border-forest"
          />
          <button
            type="button"
            onClick={handleParse}
            disabled={!raw.trim()}
            className="mt-3 rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light disabled:opacity-50"
          >
            SUGGEST MAPPING
          </button>
        </>
      ) : (
        <div className="mt-4 space-y-4">
          {(
            [
              ["title", "Title", false],
              ["scriptureReference", "Scripture Reference", false],
              ["scriptureText", "Scripture Text", true],
              ["keyMessage", "Key Message", true],
              ["reflectionQuestion", "Today's Question", true],
              ["prayer", "Prayer", true],
            ] as const
          ).map(([key, label, multiline]) => (
            <div key={key}>
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                {label.toUpperCase()}
              </label>
              {multiline ? (
                <textarea
                  value={parsed[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  rows={3}
                  className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-forest"
                />
              ) : (
                <input
                  value={parsed[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-forest"
                />
              )}
            </div>
          ))}

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              REFLECTION (ONE PARAGRAPH PER LINE)
            </label>
            <textarea
              value={parsed.reflection.join("\n\n")}
              onChange={(e) =>
                updateField(
                  "reflection",
                  e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
                )
              }
              rows={6}
              className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/70 px-3 py-2 font-sans text-sm text-charcoal outline-none focus:border-forest"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onApply(parsed)}
              className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
            >
              APPLY TO DRAFT
            </button>
            <button
              type="button"
              onClick={() => setParsed(null)}
              className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest"
            >
              START OVER
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
