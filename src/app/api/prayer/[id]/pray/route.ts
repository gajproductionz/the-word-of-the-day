import { NextRequest, NextResponse } from "next/server";
import { readPrayers, writePrayers } from "@/lib/prayerStore";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prayers = await readPrayers();
  const target = prayers.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json({ error: "Prayer not found." }, { status: 404 });
  }

  target.prayerCount += 1;
  await writePrayers(prayers);

  return NextResponse.json({ success: true, prayerCount: target.prayerCount });
}
