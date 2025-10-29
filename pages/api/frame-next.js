import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

// Fetch a suggestion from your existing API
async function getSuggestion(managerId) {
  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";
  const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Cannot fetch suggestion");
  const data = await res.json();
  return data.suggestion;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";
  const index = parseInt(searchParams.get("i") || "0", 10);

  let suggestion;
  try {
    const suggestions = [];
    for (let x = 0; x < 3; x++) {
      try {
        const s = await getSuggestion(managerId);
        if (s) suggestions.push(s);
      } catch {}
    }
    suggestion = suggestions[index % suggestions.length];
  } catch (err) {
    console.error("Error cycling suggestions:", err);
  }

  const display = suggestion || {
    out: "Your team looks great 💪",
    in: "Save your transfer 😉",
    position: "—",
    form: "—",
  };

  const nextIndex = (index + 1) % 3;
  const nextUrl = `https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame-next?managerId=${managerId}&i=${nextIndex}`;

  const shareText = encodeURIComponent(
    `FPL Suggestion (GW) — ${display.out} → ${display.in} via farcaster-fpl-transfer-suggestor.vercel.app`
  );
  const shareUrl = `https://warpcast.com/~/compose?text=${shareText}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(to bottom right, #0f172a, #1e293b)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 54, color: "#818cf8", marginBottom: 30 }}>
          FPL Transfer Suggestion 🔄
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 46 }}>
          <span style={{ color: "#f87171" }}>{display.out}</span>
          <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80" }}>{display.in}</span>
        </div>

        <div style={{ marginTop: 20, fontSize: 24, color: "#c7d2fe" }}>
          Position: {display.position} | Form: {display.form}
        </div>

        <div style={{ marginTop: 40, fontSize: 22, color: "#818cf8" }}>
          Tap again for next suggestion →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "fc:frame": "vNext",
        "fc:frame:image": nextUrl,

        "fc:frame:button:1": "Next Suggestion",
        "fc:frame:button:1:action": "post",
        "fc:frame:button:1:target": nextUrl,

        "fc:frame:button:2": "Share This Transfer",
        "fc:frame:button:2:action": "post_redirect",
        "fc:frame:button:2:target": shareUrl,

        "fc:frame:button:3": "Open App",
        "fc:frame:button:3:action": "link",
        "fc:frame:button:3:target":
          "https://farcaster-fpl-transfer-suggestor.vercel.app",
      },
    }
  );
}
