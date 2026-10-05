import {
  getTodaysWord,
  getRecentDevotionals,
  getSeasonPick,
  getFeaturedSeries,
  getDevotionalsBySeries,
} from "@/content";
import { resolveImage, resolveImages } from "@/lib/resolveImage";
import { formatLongDate } from "@/lib/date";
import Hero from "@/components/home/Hero";
import TodaysWord from "@/components/home/TodaysWord";
import NeedAWordPreview from "@/components/home/NeedAWordPreview";
import RecentWords from "@/components/home/RecentWords";
import SeasonPick from "@/components/home/SeasonPick";
import SeriesFeature from "@/components/home/SeriesFeature";
import PrayerInvite from "@/components/home/PrayerInvite";
import ReceiveTheWord from "@/components/ReceiveTheWord";
import PushOptIn from "@/components/PushOptIn";
import ClosingScripture from "@/components/home/ClosingScripture";

export default async function HomePage() {
  const todaysWord = await getTodaysWord();
  const recent = await getRecentDevotionals(todaysWord.slug, 3);
  const seasonPick = await getSeasonPick();
  const featuredSeries = await getFeaturedSeries();
  const seriesDays = featuredSeries ? await getDevotionalsBySeries(featuredSeries.slug) : [];

  const [todaysWordWithImage, recentWithImages, seasonPickWithImage] = await Promise.all([
    resolveImage(todaysWord),
    resolveImages(recent),
    resolveImage(seasonPick),
  ]);

  return (
    <>
      <Hero dateLabel={formatLongDate(todaysWord.date)} image={todaysWordWithImage} />
      <TodaysWord devotional={{ ...todaysWord, resolvedImage: todaysWordWithImage }} />
      <NeedAWordPreview />
      <RecentWords devotionals={recentWithImages} />
      <SeasonPick devotional={{ ...seasonPick, resolvedImage: seasonPickWithImage }} />
      {featuredSeries && seriesDays.length > 0 && (
        <SeriesFeature series={featuredSeries} days={seriesDays} />
      )}
      <PrayerInvite />
      <section className="bg-ivory px-5 py-24 sm:px-10 sm:py-28">
        <ReceiveTheWord />
        <div className="mx-auto mt-16 max-w-md border-t border-charcoal/10 pt-12">
          <PushOptIn />
        </div>
      </section>
      <ClosingScripture />
    </>
  );
}
