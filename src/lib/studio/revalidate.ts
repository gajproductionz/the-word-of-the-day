import { revalidatePath } from "next/cache";

/**
 * Called whenever a devotional's publish state changes, so every public
 * surface it affects (section 8 of the brief: homepage, archive, topic
 * pages, book pages, series, sitemap) updates immediately rather than
 * waiting for the page's own revalidate window — "no manual
 * duplication" only holds if publishing actually propagates right away.
 */
export function revalidatePublicContent(devotional: {
  slug: string;
  book: string;
  topics: { slug: string }[];
  series: { slug: string } | null;
}) {
  revalidatePath("/");
  revalidatePath("/devotionals");
  revalidatePath(`/devotional/${devotional.slug}`);
  revalidatePath(`/devotionals/book/${devotional.book.toLowerCase().replace(/\s+/g, "-")}`);
  for (const topic of devotional.topics) {
    revalidatePath(`/devotionals/topic/${topic.slug}`);
  }
  if (devotional.series) {
    revalidatePath(`/series/${devotional.series.slug}`);
  }
  revalidatePath("/sitemap.xml");
}
