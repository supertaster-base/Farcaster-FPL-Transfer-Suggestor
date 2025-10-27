import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let suggestion;
  try {
    const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      suggestion = data?.suggestion;
    }
  } catch (e) {
    console.error("Failed to fetch suggestion:", e);
  }

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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <h1 style={{ fontSize: 56, color: "#818cf8", margin: 0 }}>
          FPL Transfer Suggestion
        </h1>
        <p style={{ fontSize: 28, color: "#a5b4fc", margin: "8px 0 40px" }}>
          Gameweek Advice
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            maxWidth: 900,
            background: "#1e293b",
            borderRadius: 24,
            padding: "30px 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 36, color: "#f87171", margin: 0 }}>Out</p>
            <p style={{ fontSize: 44, margin: "8px 0" }}>{display.out}</p>
          </div>

          <p style={{ fontSize: 60, color: "#a5b4fc" }}>→</p>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 36, color: "#4ade80", margin: 0 }}>In</p>
            <p style={{ fontSize: 44, margin: "8px 0" }}>{display.in}</p>
          </div>
        </div>

        <p style={{ marginTop: 40, fontSize: 24, color: "#c7d2fe" }}>
          Position: {display.position} | Form: {display.form}
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}


