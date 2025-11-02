import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId") || "619981";
    const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

    // Default display data
    let display = {
      out: "Your team looks great 💪",
      in: "Save your transfer 😉",
      position: "—",
      form: "—",
    };

    try {
      const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.suggestion?.out && data?.suggestion?.in) display = data.suggestion;
      }
    } catch (err) {
      console.error("Fetch suggest failed:", err);
    }

    const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;
    const shareText = encodeURIComponent(
      `FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`
    );
    const shareUrl = `https://warpcast.com/~/compose?text=${shareText}`;

    // Generate image
    let image;
    try {
      image = new ImageResponse(
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
              }}
            >
              Tap again for next suggestion →
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    } catch (err) {
      console.error("Image generation failed:", err);
      return new Response(JSON.stringify({ error: "ImageResponse failed", details: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert image to buffer
    let arrayBuf;
    try {
      arrayBuf = await image.arrayBuffer();
    } catch (err) {
      console.error("arrayBuffer failed:", err);
      return new Response(JSON.stringify({ error: "arrayBuffer failed", details: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build headers safely
    const headers = new Headers();
    headers.set("Content-Type", "image/png");

    try {
      headers.set("fc:frame", "vNext");
      headers.set("fc:frame:image", `${baseUrl}/api/frame?managerId=${managerId}`);
      headers.set("fc:frame:button:1", "Next Suggestion");
      headers.set("fc:frame:button:1:action", "post");
      headers.set("fc:frame:button:1:target", nextUrl);
      headers.set("fc:frame:button:2", "Share Transfer");
      headers.set("fc:frame:button:2:action", "post_redirect");
      headers.set("fc:frame:button:2:target", shareUrl);
      headers.set("fc:frame:button:3", "Open App");
      headers.set("fc:frame:button:3:action", "link");
      headers.set("fc:frame:button:3:target", baseUrl);
    } catch (err) {
      console.error("Header assignment failed:", err);
      return new Response(
        JSON.stringify({ error: "Header assignment failed", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return final image
    return new Response(arrayBuf, { headers });

  } catch (err) {
    console.error("Unexpected top-level error:", err);
    return new Response(JSON.stringify({ error: "Top-level error", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

