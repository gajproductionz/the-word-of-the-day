import { db } from "@/lib/db";
import type { PrayerRequest } from "@/content/types";
import type { PrayerRequest as PrismaPrayerRequest } from "@prisma/client";

function toPrayerRequest(row: PrismaPrayerRequest): PrayerRequest {
  return {
    id: row.id,
    name: row.name,
    request: row.request,
    isPrivate: row.isPrivate,
    shareOnWall: row.shareOnWall,
    prayerCount: row.prayerCount,
    createdAt: row.createdAt.toISOString(),
  };
}

/**
 * Only requests an admin has explicitly approved appear on the public
 * wall — a new submission with `shareOnWall: true` starts as `NEW` and
 * is invisible until someone in Studio moves it to APPROVED_FOR_WALL.
 * See /studio/prayers.
 */
export async function getWallPrayers(): Promise<PrayerRequest[]> {
  const rows = await db.prayerRequest.findMany({
    where: { status: "APPROVED_FOR_WALL" },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toPrayerRequest);
}

export async function createPrayerRequest(input: {
  name: string;
  request: string;
  isPrivate: boolean;
  shareOnWall: boolean;
}): Promise<PrayerRequest> {
  const row = await db.prayerRequest.create({
    data: {
      name: input.name || "Anonymous",
      request: input.request,
      isPrivate: input.isPrivate,
      // Never auto-publish — see getWallPrayers above.
      shareOnWall: input.isPrivate ? false : input.shareOnWall,
      status: input.isPrivate ? "PRIVATE" : "NEW",
    },
  });
  return toPrayerRequest(row);
}

export async function incrementPrayerCount(id: string): Promise<number | null> {
  try {
    const row = await db.prayerRequest.update({
      where: { id },
      data: { prayerCount: { increment: 1 } },
    });
    return row.prayerCount;
  } catch {
    return null;
  }
}
