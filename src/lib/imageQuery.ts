import type { Devotional, Topic } from "@/content/types";

/**
 * Maps each topic to an Unsplash search query that evokes the theme
 * through light, atmosphere, nature, and scale — deliberately avoiding
 * literal/cliché religious imagery (crosses, doves, stained glass,
 * praying hands) per the brand's visual direction.
 */
const topicQueries: Record<Topic, string> = {
  Faith: "forest light path morning",
  Purpose: "open road golden light",
  Relationships: "two chairs window light",
  Discipline: "still water dawn minimal",
  Forgiveness: "calm ocean horizon soft light",
  Prayer: "candle warm light dark room",
  Family: "warm home window light",
  Fear: "storm clouds breaking light",
  Anxiety: "quiet water still morning",
  Finances: "wheat field golden hour",
  Love: "soft light window curtain",
  Healing: "sunrise mist mountains",
  Temptation: "narrow path forest shadow",
  Leadership: "mountain summit view",
  Patience: "slow river misty morning",
  Obedience: "footpath forest light",
  Gratitude: "golden field harvest light",
  "Spiritual Growth": "tree sunlight forest",
  Waiting: "foggy mountains sunrise",
  Strength: "sunrise over mountain ridge",
  Peace: "still lake reflection dawn",
  Heartbreak: "empty shoreline dawn quiet",
  Direction: "lighthouse coast morning",
};

const fallbackQuery = "atmospheric nature light minimal";

/** Derives (or uses an explicit override for) a devotional's Unsplash search query. */
export function getImageQuery(devotional: Pick<Devotional, "topics" | "unsplashQuery">): string {
  if (devotional.unsplashQuery) return devotional.unsplashQuery;
  const topic = devotional.topics[0];
  return (topic && topicQueries[topic]) || fallbackQuery;
}
