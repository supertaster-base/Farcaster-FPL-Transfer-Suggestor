import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId") || "619981";
    const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

    // Default fallback
    let display = {
      out: "Your team looks great 💪",
      in: "Save your transfer 😉",
      position: "—",
      form: "—",
    };

    // Try fetching a live suggestion
    try {
      const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.suggestion?.out && data?.suggestion?.in) {
          display = data.suggestion;
        }
      }
    } catch (e) {
      console.error("Suggestion fetch failed:", e);
    }

    const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;
    const shareText = encodeURIComponent(
      `FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`
    );
    const shareUrl = `https://warpcast.com/~/compose?text=${shareText}`;

    // ✅ Every div that has more than one child now has display:flex
    const image = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background:
              "radial-gradient(circle at 30% 40%, #312e81 0%, #0f172a 70%)",
            color: "white",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
          }}
        >
          {/* Title */}
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

          {/* Transfer line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              marginBottom: 20,
            }}
          >
            <span style={{ color: "#f87171" }}>{display.out}</span>
            <span style={{ margin: "0 30px", color: "#a5b4fc" }}>→</span>
            <span style={{ color: "#4ade80" }}>{display.in}</span>
          </div>

          {/* Position and form */}
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

          {/* Tip line */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 22,
              color: "#818cf8",
              opacity: 0.8,
            }}
          >
            Tap again for next suggestion →
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Content-Type": "image/png",
          "fc:frame": "vNext",
          "fc:frame:image": `${baseUrl}/api/frame?managerId=${managerId}`,
          "fc:frame:button:1": "Next Suggestion",
          "fc:frame:button:1:action": "post",
          "fc:frame:button:1:target": nextUrl,
          "fc:frame:button:2": "Share Transfer",
          "fc:frame:button:2:action": "post_redirect",
          "fc:frame:button:2:target": shareUrl,
          "fc:frame:button:3": "Open App",
          "fc:frame:button:3:action": "link",
          "fc:frame:button:3:target":
            "https://farcaster-fpl-transfer-suggestor.vercel.app",
        },
      }
    );

    return image;
  } catch (err) {
    console.error("Frame generation failed:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
