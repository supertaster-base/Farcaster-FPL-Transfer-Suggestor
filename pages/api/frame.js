import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

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
  } catch (e) {
    console.error("Error fetching suggestion:", e);
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
          backgroundColor: "#0f172a", // ✅ solid fallback
          backgroundImage:
            "radial-gradient(circle at 30% 40%, #312e81 0%, #0f172a 70%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glows */}
        <div
          style={{
            position: "absolute",
            width: "480px",
            height: "480px",
            display: "flex",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.3), transparent)",
            top: "-80px",
            right: "-150px",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "420px",
            height: "420px",
            display: "flex",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.25), transparent)",
            bottom: "-100px",
            left: "-100px",
            filter: "blur(100px)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 54,
            fontWeight: 700,
            color: "#a5b4fc",
            marginBottom: 30,
            textShadow: "0 0 20px rgba(129,140,248,0.3)",
          }}
        >
          FPL Transfer Suggestion 🔄
        </div>

        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(30, 41, 59, 0.85)",
            border: "1px solid rgba(129,140,248,0.4)",
            borderRadius: 20,
            padding: "40px 80px",
            boxShadow: "0 0 50px rgba(79,70,229,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 48,
              marginBottom: 10,
            }}
          >
            <span style={{ color: "#f87171" }}>{display.out}</span>
            <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
            <span style={{ color: "#4ade80" }}>{display.in}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 26,
              color: "#c7d2fe",
            }}
          >
            Position: {display.position} | Form: {display.form}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 40,
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
      contentType: "image/png",
    }
  );
}
