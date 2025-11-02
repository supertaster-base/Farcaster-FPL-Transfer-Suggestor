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
        {/* Title */}
        <div
          style={{
            display: "flex", // ✅ added
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

        {/* Transfer line */}
        <div
          style={{
            display: "flex", // ✅ added
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

        {/* Meta info */}
        <div
          style={{
            display: "flex", // ✅ added
            justifyContent: "center",
            alignItems: "center",
            fontSize: 26,
            color: "#c7d2fe",
            marginBottom: 20,
          }}
        >
          Position: {display.position} | Form: {display.form}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex", // ✅ added
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

  const arrayBuffer = await img.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  res.setHeader("Content-Type", "image/png");
  res.send(buffer);
}

