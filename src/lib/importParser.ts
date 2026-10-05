/**
 * Local, non-AI heuristic parser for "Import a Word": pastes an
 * already-written devotional and suggests how it maps onto the editor's
 * fields. Deliberately conservative — every suggestion is editable, and
 * fields it can't find with confidence are just left blank rather than
 * guessed badly. Written so a smarter (AI-assisted) parser can slot in
 * later behind the same `ParsedDevotional` shape.
 */

export interface ParsedDevotional {
  title: string;
  scriptureReference: string;
  scriptureText: string;
  keyMessage: string;
  reflection: string[];
  reflectionQuestion: string;
  prayer: string;
}

const REFERENCE_PATTERN = /^[1-3]?\s?[A-Za-z][A-Za-z\s]{1,20}\s\d{1,3}:\d{1,3}(-\d{1,3})?\b/;
const PRAYER_OPENERS = /^(father|lord|dear god|heavenly father|god,)/i;

function splitParagraphs(input: string): string[] {
  return input
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function stripQuotes(text: string): string {
  return text.replace(/^[“"']|[”"']$/g, "").trim();
}

export function parsePastedDevotional(raw: string): ParsedDevotional {
  const paragraphs = splitParagraphs(raw);

  const result: ParsedDevotional = {
    title: "",
    scriptureReference: "",
    scriptureText: "",
    keyMessage: "",
    reflection: [],
    reflectionQuestion: "",
    prayer: "",
  };

  if (paragraphs.length === 0) return result;

  const used = new Set<number>();

  // Title: first short paragraph (one line, no closing sentence punctuation).
  const titleIndex = paragraphs.findIndex(
    (p, i) => !used.has(i) && !p.includes("\n") && p.length < 80 && !/[.!?]$/.test(p)
  );
  if (titleIndex !== -1) {
    result.title = paragraphs[titleIndex];
    used.add(titleIndex);
  }

  // Scripture reference: a short paragraph matching "Book Chapter:Verse".
  const refIndex = paragraphs.findIndex((p, i) => !used.has(i) && REFERENCE_PATTERN.test(p.trim()));
  if (refIndex !== -1) {
    result.scriptureReference = paragraphs[refIndex]
      .replace(/\bKJV\b/i, "")
      .trim()
      .toUpperCase();
    used.add(refIndex);
  }

  // Scripture text: a quoted paragraph, ideally right after the reference.
  const quoteIndex = paragraphs.findIndex(
    (p, i) => !used.has(i) && /^[“"']/.test(p.trim())
  );
  if (quoteIndex !== -1) {
    result.scriptureText = stripQuotes(paragraphs[quoteIndex]);
    used.add(quoteIndex);
  }

  // Prayer: a paragraph opening like a prayer, or containing "Amen" — prefer the last match.
  const prayerCandidates = paragraphs
    .map((p, i) => ({ p, i }))
    .filter(({ p, i }) => !used.has(i) && (PRAYER_OPENERS.test(p.trim()) || /\bamen\b/i.test(p)));
  if (prayerCandidates.length > 0) {
    const { p, i } = prayerCandidates[prayerCandidates.length - 1];
    result.prayer = p.replace(/\bamen\.?\s*$/i, "").trim();
    used.add(i);
  }

  // Reflection question: a short paragraph ending in "?", not already used.
  const questionIndex = paragraphs.findIndex(
    (p, i) => !used.has(i) && p.trim().endsWith("?") && p.length < 220
  );
  if (questionIndex !== -1) {
    result.reflectionQuestion = paragraphs[questionIndex].trim();
    used.add(questionIndex);
  }

  // Key message: the next remaining short paragraph after the scripture text.
  const remainingAfterQuote = paragraphs
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => !used.has(i) && (quoteIndex === -1 || i > quoteIndex));
  const keyMessageEntry = remainingAfterQuote.find(({ p }) => p.length < 160);
  if (keyMessageEntry) {
    result.keyMessage = keyMessageEntry.p.trim();
    used.add(keyMessageEntry.i);
  }

  // Everything else, in original order, becomes reflection paragraphs.
  result.reflection = paragraphs.filter((_, i) => !used.has(i));

  return result;
}
