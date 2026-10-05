import type { EditorFormState } from "./DevotionalEditor";

/** Plain (non-client) module so Server Components can call this too — see /studio/new/page.tsx. */
export function emptyForm(): EditorFormState {
  return {
    id: null,
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    title: "",
    book: "Psalm",
    chapter: 1,
    verseStart: 1,
    verseEnd: null,
    scriptureReference: "",
    scriptureText: "",
    keyMessage: "",
    reflection: [""],
    reflectionQuestion: "",
    prayer: "",
    topics: [],
    seriesSlug: null,
    seriesDay: null,
    featuredImage: "sunrise-ridge",
    featuredImageAlt: "",
    seoTitle: "",
    seoDescription: "",
    status: "DRAFT",
    publishAt: null,
    featured: false,
    emailEnabled: true,
    pushEnabled: true,
    socialEnabled: false,
  };
}
