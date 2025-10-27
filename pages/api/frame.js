import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0f172a",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          fontSize: 64,
          fontFamily: "sans-serif",
        }}
      >
        Frame baseline ✅
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

