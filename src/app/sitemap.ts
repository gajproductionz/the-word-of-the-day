import type { MetadataRoute } from "next";
import { getAllDevotionals, getAllTopics, bibleBooks, getAllSeries } from "@/content";
import { SITE_URL as siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [devotionals, allTopics, seriesList] = await Promise.all([
    getAllDevotionals(),
    getAllTopics(),
    getAllSeries(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/devotionals`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/need-a-word`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/prayer`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const devotionalRoutes: MetadataRoute.Sitemap = devotionals.map((d) => ({
    url: `${siteUrl}/devotional/${d.slug}`,
    lastModified: d.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const topicRoutes: MetadataRoute.Sitemap = allTopics.map((t) => ({
    url: `${siteUrl}/devotionals/topic/${t.toLowerCase().replace(/\s+/g, "-")}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const bookRoutes: MetadataRoute.Sitemap = bibleBooks.map((b) => ({
    url: `${siteUrl}/devotionals/book/${b.toLowerCase().replace(/\s+/g, "-")}`,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = seriesList.map((s) => ({
    url: `${siteUrl}/series/${s.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...devotionalRoutes, ...topicRoutes, ...bookRoutes, ...seriesRoutes];
}
