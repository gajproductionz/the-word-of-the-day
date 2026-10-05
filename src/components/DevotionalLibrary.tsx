"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@/content/types";
import type { DevotionalWithImage } from "@/lib/resolveImage";
import DevotionalCard from "./DevotionalCard";

interface DevotionalLibraryProps {
  devotionals: DevotionalWithImage[];
  topics: Topic[];
  books: string[];
  initialTopic?: string;
  initialBook?: string;
}

export default function DevotionalLibrary({
  devotionals,
  topics,
  books,
  initialTopic,
  initialBook,
}: DevotionalLibraryProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [book, setBook] = useState(initialBook ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return devotionals.filter((d) => {
      const matchesQuery =
        !q ||
        [d.title, d.scriptureReference, d.scriptureText, d.keyMessage, ...d.topics]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesTopic = !topic || d.topics.includes(topic as Topic);
      const matchesBook = !book || d.book === book;
      return matchesQuery && matchesTopic && matchesBook;
    });
  }, [devotionals, query, topic, book]);

  const booksInUse = useMemo(
    () => books.filter((b) => devotionals.some((d) => d.book === b)),
    [books, devotionals]
  );

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="relative max-w-xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Scripture, topics, or devotionals…"
            aria-label="Search devotionals"
            className="w-full rounded-full border border-charcoal/20 bg-white/60 px-6 py-4 font-sans text-sm text-charcoal placeholder:text-charcoal/40 outline-none transition-colors focus:border-forest"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-sans text-[0.68rem] font-semibold tracking-[0.14em] text-charcoal/60">
            TOPIC
          </span>
          <button
            type="button"
            onClick={() => setTopic("")}
            className={`rounded-full border px-4 py-1.5 font-sans text-xs transition-colors ${
              topic === "" ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70 hover:border-forest"
            }`}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(topic === t ? "" : t)}
              className={`rounded-full border px-4 py-1.5 font-sans text-xs transition-colors ${
                topic === t ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/70 hover:border-forest"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-sans text-[0.68rem] font-semibold tracking-[0.14em] text-charcoal/60">
            SCRIPTURE
          </span>
          <label className="sr-only" htmlFor="book-filter">
            Filter by Bible book
          </label>
          <select
            id="book-filter"
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className="rounded-full border border-charcoal/20 bg-white/60 px-4 py-1.5 font-sans text-xs text-charcoal outline-none focus:border-forest"
          >
            <option value="">All books</option>
            {booksInUse.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-10 font-sans text-xs text-charcoal/60">
        {filtered.length} {filtered.length === 1 ? "devotional" : "devotionals"}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-6 font-serif text-xl italic text-charcoal/60">
          No devotionals found yet — try a different word or topic.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <DevotionalCard key={d.id} devotional={d} layout={i % 5 === 2 ? "text-only" : "image-top"} />
          ))}
        </div>
      )}
    </div>
  );
}
