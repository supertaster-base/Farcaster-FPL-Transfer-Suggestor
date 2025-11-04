import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";

  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

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
      if (data?.suggestion?.out && data?.suggestion?.in) {
        display = data.suggestion;
      }
    }
  } catch (err) {
    console.error("Suggestion fetch failed:", err);
  }

  return new ImageResponse(
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
            fontSize: 26,
            color: "#c7d2fe",
          }}
        >
          Position: {display.position} | Form: {display.form}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

