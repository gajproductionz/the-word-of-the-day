"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { atmosphereTreatments } from "@/components/Atmosphere";
import type { ParsedDevotional } from "@/lib/importParser";
import ImportPanel from "./ImportPanel";
import LivePreview from "./LivePreview";
import PublishModal from "./PublishModal";
import ScheduleModal from "./ScheduleModal";
import SocialCaptionsPanel from "./SocialCaptionsPanel";

export interface EditorFormState {
  id: string | null;
  slug: string;
  date: string;
  title: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  scriptureReference: string;
  scriptureText: string;
  keyMessage: string;
  reflection: string[];
  reflectionQuestion: string;
  prayer: string;
  topics: string[];
  seriesSlug: string | null;
  seriesDay: number | null;
  featuredImage: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  publishAt: string | null;
  featured: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  socialEnabled: boolean;
}

interface DevotionalEditorProps {
  initial: EditorFormState;
  allTopics: string[];
  allSeries: { slug: string; title: string }[];
  defaultTimezone?: string;
  defaultEmailDelayMinutes?: number;
}

export default function DevotionalEditor({
  initial,
  allTopics,
  allSeries,
  defaultTimezone,
  defaultEmailDelayMinutes,
}: DevotionalEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<EditorFormState>(initial);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    initial.id ? "saved" : "idle"
  );
  const [showImport, setShowImport] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);

  const idRef = useRef(initial.id);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  function update<K extends keyof EditorFormState>(key: K, value: EditorFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  const save = useCallback(async () => {
    setSaveState("saving");
    try {
      if (!idRef.current) {
        const res = await fetch("/api/studio/devotionals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        idRef.current = data.devotional.id;
        setForm((prev) => ({ ...prev, id: data.devotional.id, slug: data.devotional.slug }));
        router.replace(`/studio/devotionals/${data.devotional.id}`);
      } else {
        const res = await fetch(`/api/studio/devotionals/${idRef.current}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      }
      setSaveState("saved");
      setDirty(false);
    } catch {
      setSaveState("error");
    }
  }, [form, router]);

  // Debounced autosave — skips the very first render so navigating into
  // an existing draft doesn't immediately re-save it.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      save();
    }, 1500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function applyImport(parsed: ParsedDevotional) {
    setForm((prev) => ({
      ...prev,
      title: parsed.title || prev.title,
      scriptureReference: parsed.scriptureReference || prev.scriptureReference,
      scriptureText: parsed.scriptureText || prev.scriptureText,
      keyMessage: parsed.keyMessage || prev.keyMessage,
      reflection: parsed.reflection.length > 0 ? parsed.reflection : prev.reflection,
      reflectionQuestion: parsed.reflectionQuestion || prev.reflectionQuestion,
      prayer: parsed.prayer || prev.prayer,
    }));
    setDirty(true);
    setShowImport(false);
  }

  function toggleTopic(topic: string) {
    update(
      "topics",
      form.topics.includes(topic) ? form.topics.filter((t) => t !== topic) : [...form.topics, topic]
    );
  }

  async function handlePublishConfirm() {
    setPublishing(true);
    await save();
    try {
      const res = await fetch(`/api/studio/devotionals/${idRef.current}/publish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm((prev) => ({ ...prev, status: "PUBLISHED", featured: true }));
      setShowPublishModal(false);
    } finally {
      setPublishing(false);
    }
  }

  async function handleScheduleConfirm(publishAt: string, emailSendAt: string | null, pushSendAt: string | null) {
    await save();
    const res = await fetch(`/api/studio/devotionals/${idRef.current}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishAt, emailSendAt, pushSendAt }),
    });
    if (res.ok) {
      setForm((prev) => ({ ...prev, status: "SCHEDULED", publishAt }));
      setShowScheduleModal(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
      <div className="max-h-screen overflow-y-auto px-1 py-2 lg:pr-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span
              className={`rounded-full px-3 py-1 font-sans text-[0.65rem] font-semibold tracking-[0.1em] ${
                form.status === "PUBLISHED"
                  ? "bg-forest/10 text-forest"
                  : form.status === "SCHEDULED"
                    ? "bg-gold/10 text-gold-ink"
                    : "bg-charcoal/10 text-charcoal/60"
              }`}
            >
              {form.status}
            </span>
            <span className="ml-3 font-sans text-xs text-charcoal/40">
              {saveState === "saving" && "Saving…"}
              {saveState === "saved" && "SAVED"}
              {saveState === "error" && "Couldn't save — check your connection"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowImport((v) => !v)}
            className="rounded-full border border-charcoal/20 px-4 py-2 font-sans text-xs font-semibold tracking-[0.1em] text-charcoal hover:border-forest hover:text-forest"
          >
            {showImport ? "HIDE IMPORT" : "IMPORT A WORD"}
          </button>
        </div>

        {showImport && (
          <div className="mt-4">
            <ImportPanel onApply={applyImport} onClose={() => setShowImport(false)} />
          </div>
        )}

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">DATE</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                SLUG
              </label>
              <input
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="auto-generated from title"
                className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">TITLE</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="God Is Still Working"
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-xl outline-none focus:border-forest"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                BOOK
              </label>
              <input
                value={form.book}
                onChange={(e) => update("book", e.target.value)}
                className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                CHAPTER
              </label>
              <input
                type="number"
                value={form.chapter}
                onChange={(e) => update("chapter", Number(e.target.value))}
                className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                VERSE(S)
              </label>
              <div className="mt-1 flex gap-1">
                <input
                  type="number"
                  value={form.verseStart}
                  onChange={(e) => update("verseStart", Number(e.target.value))}
                  className="w-full rounded-sm border border-charcoal/20 bg-white/60 px-2 py-2 font-sans text-sm outline-none focus:border-forest"
                />
                <input
                  type="number"
                  value={form.verseEnd ?? ""}
                  onChange={(e) => update("verseEnd", e.target.value ? Number(e.target.value) : null)}
                  placeholder="end"
                  className="w-full rounded-sm border border-charcoal/20 bg-white/60 px-2 py-2 font-sans text-sm outline-none focus:border-forest"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              SCRIPTURE REFERENCE (DISPLAY FORM)
            </label>
            <input
              value={form.scriptureReference}
              onChange={(e) => update("scriptureReference", e.target.value)}
              placeholder="ROMANS 8:28"
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-2.5 font-sans text-sm outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              SCRIPTURE TEXT
            </label>
            <textarea
              value={form.scriptureText}
              onChange={(e) => update("scriptureText", e.target.value)}
              rows={3}
              className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-lg italic outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              KEY MESSAGE
            </label>
            <input
              value={form.keyMessage}
              onChange={(e) => update("keyMessage", e.target.value)}
              className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-lg text-forest outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              REFLECTION (BLANK LINE BETWEEN PARAGRAPHS)
            </label>
            <textarea
              value={form.reflection.join("\n\n")}
              onChange={(e) =>
                update(
                  "reflection",
                  e.target.value.split(/\n\s*\n/).map((p) => p)
                )
              }
              rows={10}
              className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-base leading-relaxed outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              TODAY&apos;S QUESTION
            </label>
            <textarea
              value={form.reflectionQuestion}
              onChange={(e) => update("reflectionQuestion", e.target.value)}
              rows={2}
              className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-base italic outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
              PRAYER
            </label>
            <textarea
              value={form.prayer}
              onChange={(e) => update("prayer", e.target.value)}
              rows={4}
              className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-4 py-3 font-serif text-base italic outline-none focus:border-forest"
            />
          </div>

          <details className="rounded-sm border border-charcoal/10 p-4">
            <summary className="cursor-pointer font-sans text-xs font-semibold tracking-[0.1em] text-charcoal/70">
              TOPICS, SERIES & IMAGE
            </summary>
            <div className="mt-4 space-y-5">
              <div>
                <p className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">TOPICS</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleTopic(topic)}
                      className={`rounded-full border px-3 py-1 font-sans text-xs ${
                        form.topics.includes(topic)
                          ? "border-forest bg-forest text-ivory"
                          : "border-charcoal/20 text-charcoal/70"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                    SERIES
                  </label>
                  <select
                    value={form.seriesSlug ?? ""}
                    onChange={(e) => update("seriesSlug", e.target.value || null)}
                    className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
                  >
                    <option value="">None</option>
                    {allSeries.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                    SERIES DAY
                  </label>
                  <input
                    type="number"
                    value={form.seriesDay ?? ""}
                    onChange={(e) => update("seriesDay", e.target.value ? Number(e.target.value) : null)}
                    disabled={!form.seriesSlug}
                    className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                    FEATURED IMAGE (FALLBACK TREATMENT)
                  </label>
                  <select
                    value={form.featuredImage}
                    onChange={(e) => update("featuredImage", e.target.value)}
                    className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
                  >
                    {atmosphereTreatments.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 font-sans text-[0.65rem] text-charcoal/40">
                    Real photo is sourced automatically by topic — run{" "}
                    <code className="rounded bg-charcoal/5 px-1">npm run fetch-images</code> after publishing.
                  </p>
                </div>
                <div>
                  <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                    IMAGE ALT TEXT
                  </label>
                  <input
                    value={form.featuredImageAlt}
                    onChange={(e) => update("featuredImageAlt", e.target.value)}
                    className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                  SEO TITLE
                </label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  className="mt-1 w-full rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                  SEO DESCRIPTION
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  rows={2}
                  className="mt-1 w-full resize-y rounded-sm border border-charcoal/20 bg-white/60 px-3 py-2 font-sans text-sm outline-none focus:border-forest"
                />
              </div>
            </div>
          </details>

          <details className="rounded-sm border border-charcoal/10 p-4">
            <summary className="cursor-pointer font-sans text-xs font-semibold tracking-[0.1em] text-charcoal/70">
              DISTRIBUTION
            </summary>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2 font-sans text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.emailEnabled}
                  onChange={(e) => update("emailEnabled", e.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                Notify subscribers by email
              </label>
              <label className="flex items-center gap-2 font-sans text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.pushEnabled}
                  onChange={(e) => update("pushEnabled", e.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                Notify subscribers by push
              </label>
              <label className="flex items-center gap-2 font-sans text-sm text-charcoal/80">
                <input
                  type="checkbox"
                  checked={form.socialEnabled}
                  onChange={(e) => update("socialEnabled", e.target.checked)}
                  className="h-4 w-4 accent-forest"
                />
                Prepare social content
              </label>

              {form.socialEnabled && form.id && (
                <div className="border-t border-charcoal/10 pt-4">
                  <p className="font-sans text-[0.65rem] font-semibold tracking-[0.1em] text-charcoal/50">
                    SOCIAL CAPTIONS
                  </p>
                  <p className="mt-1 font-sans text-xs text-charcoal/50">
                    Generated on publish. Edit freely, or regenerate from the template — nothing posts
                    automatically.
                  </p>
                  <div className="mt-3">
                    <SocialCaptionsPanel devotionalId={form.id} />
                  </div>
                </div>
              )}
            </div>
          </details>
        </div>

        <div className="sticky bottom-0 mt-8 flex flex-wrap gap-3 border-t border-charcoal/10 bg-ivory py-4">
          <button
            type="button"
            onClick={save}
            className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest hover:text-forest"
          >
            SAVE DRAFT
          </button>
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="rounded-full border border-charcoal/20 px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-charcoal hover:border-forest hover:text-forest"
          >
            SCHEDULE
          </button>
          <button
            type="button"
            onClick={() => setShowPublishModal(true)}
            className="rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-semibold tracking-[0.12em] text-ivory hover:bg-forest-light"
          >
            PUBLISH NOW
          </button>
        </div>
      </div>

      <div className="hidden border-l border-charcoal/10 lg:block">
        <LivePreview
          devotional={{
            title: form.title,
            date: form.date,
            scriptureReference: form.scriptureReference,
            scriptureText: form.scriptureText,
            keyMessage: form.keyMessage,
            reflection: form.reflection,
            reflectionQuestion: form.reflectionQuestion,
            prayer: form.prayer,
          }}
          featuredImage={form.featuredImage}
          featuredImageAlt={form.featuredImageAlt}
        />
      </div>

      {showPublishModal && (
        <PublishModal
          title={form.title}
          scriptureReference={form.scriptureReference}
          date={form.date}
          loading={publishing}
          onConfirm={handlePublishConfirm}
          onCancel={() => setShowPublishModal(false)}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          defaultTimezone={defaultTimezone}
          defaultEmailDelayMinutes={defaultEmailDelayMinutes}
          onConfirm={handleScheduleConfirm}
          onCancel={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}
