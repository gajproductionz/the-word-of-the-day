import { promises as fs } from "fs";
import path from "path";
import type { PrayerRequest } from "@/content/types";

/**
 * Prototype persistence for the Prayer Wall: a JSON file on disk.
 * Fine for a single-instance demo; swap these three functions for real
 * database calls (Postgres, etc.) when deploying for real — nothing
 * above this file needs to change.
 */
const DATA_PATH = path.join(process.cwd(), "src/data/prayers.json");

export async function readPrayers(): Promise<PrayerRequest[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as PrayerRequest[];
}

export async function writePrayers(prayers: PrayerRequest[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(prayers, null, 2), "utf-8");
}

export async function getWallPrayers(): Promise<PrayerRequest[]> {
  const all = await readPrayers();
  return all
    .filter((p) => p.shareOnWall && !p.isPrivate)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
