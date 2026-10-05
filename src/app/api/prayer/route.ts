import { NextRequest, NextResponse } from "next/server";
import { readPrayers, writePrayers, getWallPrayers } from "@/lib/prayerStore";

export async function GET() {
  const wall = await getWallPrayers();
  return NextResponse.json({ prayers: wall });
}

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    request?: string;
    isPrivate?: boolean;
    shareOnWall?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const requestText = body.request?.trim();
  if (!requestText) {
    return NextResponse.json({ error: "Please share your prayer request." }, { status: 400 });
  }
  if (requestText.length > 1000) {
    return NextResponse.json({ error: "Please keep your request under 1000 characters." }, { status: 400 });
  }

  const name = body.name?.trim() || "Anonymous";
  const isPrivate = Boolean(body.isPrivate);
  const shareOnWall = isPrivate ? false : Boolean(body.shareOnWall);

  const prayers = await readPrayers();
  const newPrayer = {
    id: `p${Date.now()}`,
    name,
    request: requestText,
    isPrivate,
    shareOnWall,
    prayerCount: 0,
    createdAt: new Date().toISOString(),
  };
  prayers.unshift(newPrayer);
  await writePrayers(prayers);

  return NextResponse.json({ success: true, prayer: newPrayer });
}
