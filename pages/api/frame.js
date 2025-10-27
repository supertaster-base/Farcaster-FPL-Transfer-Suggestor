import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  const outName = "Your team looks great 💪";
  const inName = "Save your transfer 😉";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          fontSize: 56,
        }}
      >
        <span style={{ color: "#f87171" }}>{outName}</span>
        <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
        <span style={{ color: "#4ade80" }}>{inName}</span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}





