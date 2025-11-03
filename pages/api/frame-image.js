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
      if (data?.suggestion?.out && data?.suggestion?.in) display = data.suggestion;
    }
  } catch (err) {
    console.error("Suggestion fetch failed:", err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "radial-gradient(circle at 40% 30%, #2e1065 0%, #0f172a 70%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glowing gradient background accents */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.3), rgba(0,0,0,0))",
            top: "-150px",
            right: "-150px",
            filter: "blur(100px)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.25), rgba(0,0,0,0))",
            bottom: "-120px",
            left: "-120px",
            filter: "blur(100px)",
          }}
        ></div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#a5b4fc",
            textShadow: "0 0 40px rgba(99,102,241,0.5)",
            marginBottom: 50,
          }}
        >
          FPL Transfer Suggestion 🔄
        </div>

        {/* Suggestion Box */}
        <div
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "2px solid rgba(99,102,241,0.3)",
            borderRadius: 24,
            padding: "50px 80px",
            boxShadow: "0 0 50px rgba(99,102,241,0.25)",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 52 }}>
            <span style={{ color: "#f87171", fontWeight: 700 }}>{display.out}</span>
            <span style={{ margin: "0 35px", color: "#a5b4fc" }}>→</span>
            <span style={{ color: "#4ade80", fontWeight: 700 }}>{display.in}</span>
          </div>

          <div style={{ fontSize: 28, color: "#c7d2fe", marginTop: 8 }}>
            Position: {display.position} &nbsp;|&nbsp; Form: {display.form}
          </div>
        </div>

        {/* Tip line */}
        <div
          style={{
            fontSize: 24,
            color: "#818cf8",
            opacity: 0.85,
            marginTop: 60,
            letterSpacing: 0.3,
          }}
        >
          Tap again for next suggestion →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

