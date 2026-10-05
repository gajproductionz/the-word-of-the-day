import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#15140F",
          backgroundImage:
            "radial-gradient(130% 90% at 50% 110%, rgba(184,146,75,0.45) 0%, rgba(184,146,75,0.05) 40%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 80,
            lineHeight: 1.05,
            color: "#F7F3EC",
            fontWeight: 600,
          }}
        >
          <span>THE WORD</span>
          <span>OF THE DAY</span>
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 30, color: "#C9A568" }}>
          A Word for today. Faith for the journey.
        </div>
      </div>
    ),
    { ...size }
  );
}
