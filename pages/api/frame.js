import { ImageResponse } from "@vercel/og";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, "http://localhost");
  const managerId = searchParams.get("managerId") || "619981";
  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

  let display = {
    out: "Your team looks great 💪",
    in: "Save your transfer 😉",
    position: "—",
    form: "—",
  };

  try {
    const r = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
      cache: "no-store",
    });
    if (r.ok) {
      const d = await r.json();
      if (d?.suggestion?.out && d?.suggestion?.in) display = d.suggestion;
    }
  } catch (e) {
    console.error("fetch error", e);
  }

  const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;
  const shareText = encodeURIComponent(
    `FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`
  );
  const shareUrl = `https://warpcast.com/~/compose?text=${shareText}`;

  // --- generate image (same visual layout as before) ---
  const img = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 30% 40%, #312e81 0%, #0f172a 70%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 54,
            color: "#a5b4fc",
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          FPL Transfer Suggestion 🔄
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 48,
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#f87171" }}>{display.out}</span>
          <span style={{ margin: "0 30px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80" }}>{display.in}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 26,
            color: "#c7d2fe",
            marginBottom: 20,
          }}
        >
          Position: {display.position} | Form: {display.form}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 22,
            color: "#818cf8",
            opacity: 0.8,
            marginTop: 40,
          }}
        >
          Tap again for next suggestion →
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  // --- convert and send with Farcaster headers ---
  const arrayBuffer = await img.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader("Content-Type", "image/png");

  // 🔸 Farcaster mini-app / frame metadata
  res.setHeader("fc:frame", "vNext");
  res.setHeader("fc:frame:image", `${baseUrl}/api/frame?managerId=${managerId}`);
  res.setHeader("fc:frame:button:1", "Next Suggestion");
  res.setHeader("fc:frame:button:1:action", "post");
  res.setHeader("fc:frame:button:1:target", nextUrl);
  res.setHeader("fc:frame:button:2", "Share Transfer");
  res.setHeader("fc:frame:button:2:action", "post_redirect");
  res.setHeader("fc:frame:button:2:target", shareUrl);
  res.setHeader("fc:frame:button:3", "Open App");
  res.setHeader("fc:frame:button:3:action", "link");
  res.setHeader(
    "fc:frame:button:3:target",
    "https://farcaster-fpl-transfer-suggestor.vercel.app"
  );

  res.send(buffer);
}

