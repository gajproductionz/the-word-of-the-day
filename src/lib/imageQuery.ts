import type { Devotional, Topic } from "@/content/types";

/**
 * Maps each topic to an Unsplash search query that evokes the theme
 * through light, shadow, human emotion, texture, and atmosphere —
 * deliberately avoiding both literal religious iconography (crosses,
 * doves, stained glass, praying hands) and generic inspirational
 * nature-wallpaper (mountain ridges, wheat fields) per the brand's
 * visual direction: light as the metaphor, not landscape as filler.
 */
const topicQueries: Record<Topic, string> = {
  Faith: "silhouette figure doorway light",
  Purpose: "hands open light texture",
  Relationships: "two silhouettes window light",
  Discipline: "empty chair morning light shadow",
  Forgiveness: "hand releasing water light",
  Prayer: "candle warm light dark room",
  Family: "home window light silhouette",
  Fear: "shadow figure light breaking",
  Anxiety: "rain window glass blur",
  Finances: "worn hands texture light",
  Love: "soft light curtain fabric texture",
  Healing: "light through fingers shadow",
  Temptation: "narrow alley shadow light",
  Leadership: "figure silhouette vast light",
  Patience: "slow water texture light",
  Obedience: "footsteps path shadow light",
  Gratitude: "open hands warm light",
  "Spiritual Growth": "light through leaves texture",
  Waiting: "empty room window light",
  Strength: "figure silhouette architecture light",
  Peace: "still water dawn minimal",
  Heartbreak: "empty room quiet shadow",
  Direction: "lighthouse architecture dusk",
};

const fallbackQuery = "light shadow silhouette atmosphere minimal";

/** Derives (or uses an explicit override for) a devotional's Unsplash search query. */
export function getImageQuery(devotional: Pick<Devotional, "topics" | "unsplashQuery">): string {
  if (devotional.unsplashQuery) return devotional.unsplashQuery;
  const topic = devotional.topics[0];
  return (topic && topicQueries[topic]) || fallbackQuery;
}
