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
    // ignore
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
          background: "linear-gradient(to bottom right,#0f172a,#1e293b)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 58, color: "#818cf8", marginBottom: 20 }}>
          FPL Suggestion
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            background: "#1e293b",
            borderRadius: 20,
            padding: 20,
            width: 900,
          }}
        >
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 36, color: "#f87171" }}>Out</div>
            <div style={{ fontSize: 44 }}>{display.out}</div>
          </div>

          <div style={{ fontSize: 60, color: "#a5b4fc" }}>→</div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 36, color: "#4ade80" }}>In</div>
            <div style={{ fontSize: 44 }}>{display.in}</div>
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#c7d2fe", marginTop: 30 }}>
          Pos: {display.position} | Form: {display.form}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}



