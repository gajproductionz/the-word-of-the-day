import { ImageResponse } from "next/og";
import { getDevotionalBySlug } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getDevotionalBySlug(slug);

  const title = d?.title ?? "The Word of the Day";
  const reference = d?.scriptureReference ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#15140F",
          backgroundImage:
            "radial-gradient(120% 90% at 50% 110%, rgba(184,146,75,0.35) 0%, rgba(184,146,75,0.04) 40%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 4,
            color: "#C9A568",
            fontWeight: 600,
          }}
        >
          THE WORD OF THE DAY
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              lineHeight: 1.1,
              color: "#F7F3EC",
              fontWeight: 600,
              maxWidth: 950,
            }}
          >
            {title}
          </div>
          {reference && (
            <div style={{ display: "flex", fontSize: 28, color: "#C9A568", letterSpacing: 2 }}>
              {reference} — KJV
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
