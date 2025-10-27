import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";

  // Base URL works both locally and on Vercel
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let suggestion = null;
  try {
    const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      suggestion = data?.suggestion;
    }
  } catch (e) {
    console.error("Suggest fetch failed:", e);
  }

  // fallback message
  const display = suggestion || {
    out: "Your team looks great 💪",
    in: "Save your transfer 😉",
    position: "—",
    form: "—",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 64, margin: 0, color: "#818cf8" }}>
            Farcaster FPL Suggestion
          </h1>
          <p style={{ fontSize: 28, color: "#a5b4fc", marginTop: 12 }}>
            Gameweek Transfer Advice
          </p>
        </div>

        {/* Transfer Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            background: "#1e293b",
            borderRadius: 24,
            padding: "40px 20px",
            margin: "0 40px",
            flex: 1,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 40, color: "#f87171", margin: 0 }}>Out</p>
            <p style={{ fontSize: 48, margin: "12px 0" }}>{display.out}</p>
          </div>

          <p style={{ fontSize: 80, color: "#a5b4fc" }}>→</p>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 40, color: "#4ade80", margin: 0 }}>In</p>
            <p style={{ fontSize: 48, margin: "12px 0" }}>{display.in}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#c7d2fe", fontSize: 28 }}>
          Position: {display.position} | Form: {display.form}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
