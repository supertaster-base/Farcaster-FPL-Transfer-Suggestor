import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";

  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

  let display = {
    out: "Your team looks great 💪",
    in: "Save your transfer 😉",
  };

  try {
    const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.suggestion?.out && data?.suggestion?.in) {
        display = data.suggestion;
      }
    }
  } catch {
    // network or API error: use fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 54, color: "#818cf8", marginBottom: 40 }}>
          FPL Transfer Suggestion
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: 46 }}>
          <span style={{ color: "#f87171" }}>{display.out}</span>
          <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80" }}>{display.in}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}



