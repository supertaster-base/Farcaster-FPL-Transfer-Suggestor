import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 64,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Farcaster Frame ✅
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
