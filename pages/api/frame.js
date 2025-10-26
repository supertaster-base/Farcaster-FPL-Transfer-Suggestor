import { ImageResponse } from "@vercel/og";

// Use Node runtime (Edge can silently fail)
export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    // Simple test render first
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
            color: "white",
            fontFamily: "system-ui",
            fontSize: 48,
          }}
        >
          Hello Farcaster 👋
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("Frame error:", err);
    res.status(500).json({ error: err.message });
  }
}