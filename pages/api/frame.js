import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontSize: 64,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Frame Fixed ✅
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG error:", err);
    res.status(500).json({ error: err.message });
  }
}
