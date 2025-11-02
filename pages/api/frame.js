// Non-edge fallback frame renderer
import { ImageResponse } from "@vercel/og";

// Force Node runtime (not Edge)
export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const img = new ImageResponse(
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
            fontFamily: "Arial, sans-serif",
          }}
        >
          OG Frame ✅ Node Runtime
        </div>
      ),
      { width: 1200, height: 630 }
    );

    // Convert the stream to a buffer and send it manually
    const arrayBuffer = await img.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating image");
  }
}

