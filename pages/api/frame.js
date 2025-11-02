import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1e1b4b",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 60,
        }}
      >
        Test Frame ✅
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
