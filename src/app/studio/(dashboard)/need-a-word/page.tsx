import type { Metadata } from "next";
import { db } from "@/lib/db";
import NeedCategoryRow from "@/components/studio/NeedCategoryRow";

export const metadata: Metadata = { title: "I Need a Word" };
export const dynamic = "force-dynamic";

export default async function NeedAWordAdminPage() {
  const [categories, allDevotionals] = await Promise.all([
    db.needCategory.findMany({
      include: { devotionals: { include: { devotional: { select: { id: true, title: true } } } } },
      orderBy: { label: "asc" },
    }),
    db.devotional.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-charcoal">I Need a Word</h1>
      <p className="mt-2 font-sans text-sm text-charcoal/60">
        Each need can link multiple Words — one is chosen at random each time a visitor selects it, so
        they don&apos;t see the same recommendation every time.
      </p>

      <div className="mt-8 space-y-3">
        {categories.map((cat) => {
          const assignedIds = new Set(cat.devotionals.map((link) => link.devotional.id));
          return (
            <NeedCategoryRow
              key={cat.id}
              id={cat.id}
              label={cat.label}
              scriptureReference={cat.scriptureReference}
              assigned={cat.devotionals.map((link) => link.devotional)}
              available={allDevotionals.filter((d) => !assignedIds.has(d.id))}
            />
          );
        })}
      </div>
    </div>
  );
}
