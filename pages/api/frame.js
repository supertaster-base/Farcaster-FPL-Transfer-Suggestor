import { createCanvas } from "canvas";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // draw simple SVG text path
    const text = "Hello Farcaster 👋";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "64px sans-serif";
    ctx.fillText(text, width / 2, height / 2);

    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
  } catch (err) {
    console.error("Frame error:", err);
    res.status(500).json({ error: err.message });
  }
}

