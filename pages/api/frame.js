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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 54, color: "#818cf8", marginBottom: 40 }}>
          FPL Transfer Suggestion
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 46 }}>
          <span style={{ color: "#f87171" }}>{outName}</span>
          <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80" }}>{inName}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}





