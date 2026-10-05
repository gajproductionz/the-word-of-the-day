import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateSocialCaptions } from "@/lib/socialCaptions";
import type { Devotional as PublicDevotional } from "@/content/types";

/** Regenerates all four captions from the current title/scripture/key message — overwrites any manual edits. */
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const devotional = await db.devotional.findUnique({ where: { id } });
  if (!devotional) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const publicShape = {
    slug: devotional.slug,
    title: devotional.title,
    scriptureReference: devotional.scriptureReference,
    keyMessage: devotional.keyMessage,
  } as PublicDevotional;

  const captions = generateSocialCaptions(publicShape);
  const updated = await db.devotional.update({
    where: { id },
    data: {
      socialCaptionInstagram: captions.instagram,
      socialCaptionFacebook: captions.facebook,
      socialCaptionStory: captions.story,
      socialCaptionShort: captions.short,
    },
  });

  return NextResponse.json({ devotional: updated });
}

/** Saves manually edited caption text. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: {
    socialCaptionInstagram?: string;
    socialCaptionFacebook?: string;
    socialCaptionStory?: string;
    socialCaptionShort?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const devotional = await db.devotional.update({ where: { id }, data: body });
  return NextResponse.json({ devotional });
}
