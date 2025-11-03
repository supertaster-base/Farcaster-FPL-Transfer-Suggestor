import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function handler(req) {
  // --- 🧮 Simple analytics ping ---
  try {
    const ua = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
    console.log(`[Frame View] ${new Date().toISOString()} | IP: ${ip} | UA: ${ua}`);
  } catch (err) {
    console.warn("Analytics log failed:", err);
  }

  // --- Existing logic below ---
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";
  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

  // --- Fetch suggestion ---
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
    console.error("Suggestion fetch failed:", err);
  }

  const imageUrl = `${baseUrl}/api/frame-image?managerId=${managerId}`;
  const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;
  const shareText = encodeURIComponent(
    `FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`
  );
  const shareUrl = `https://warpcast.com/~/compose?text=${shareText}`;

  // --- Create OG Image ---
  const image = new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
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

  // --- JSON frame metadata response ---
  return new Response(
    JSON.stringify({
      frame: "vNext",
      image: imageUrl,
      buttons: [
        { label: "Next Suggestion", action: "post", target: nextUrl },
        { label: "Share Transfer", action: "post_redirect", target: shareUrl },
        { label: "Open App", action: "link", target: baseUrl },
      ],
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

