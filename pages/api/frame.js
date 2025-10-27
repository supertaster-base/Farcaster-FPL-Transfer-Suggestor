import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: 64, margin: 0 }}>Farcaster FPL</h1>
        <p style={{ fontSize: 36, marginTop: 20, color: "#a5b4fc" }}>
          Frame Gradient Test 🎨
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}


