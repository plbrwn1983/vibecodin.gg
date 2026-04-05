import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "vibecodin.gg — Open source skills & agents for LLMs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          <span>vibecodin</span>
          <span style={{ color: "#71717a" }}>.</span>
          <span>g</span>
          <span style={{ color: "#71717a" }}>g</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            marginTop: 24,
          }}
        >
          Open source skills & agents for LLMs
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: 48,
            marginTop: 48,
            fontSize: 20,
            color: "#71717a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3b82f6" }}>12</span>
            <span>Hubs</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#3b82f6" }}>Skills</span>
            <span>&</span>
            <span style={{ color: "#3b82f6" }}>Agents</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Community Curated</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
