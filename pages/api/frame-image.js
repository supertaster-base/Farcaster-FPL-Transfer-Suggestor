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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 40% 30%, #312e81 0%, #0f172a 70%)",
          color: "white",
          fontFamily: "'Inter', Arial, sans-serif",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
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
            background: "rgba(15,23,42,0.85)",
            border: "2px solid rgba(129,140,248,0.4)",
            borderRadius: 20,
            padding: "30px 60px",
            boxShadow: "0 0 40px rgba(79,70,229,0.25)",
            backdropFilter: "blur(8px)",
            fontSize: 48,
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#f87171", fontWeight: 700 }}>{display.out}</span>
          <span style={{ margin: "0 30px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80", fontWeight: 700 }}>{display.in}</span>
        </div>

        <div style={{ fontSize: 26, color: "#c7d2fe" }}>
          Position: {display.position} | Form: {display.form}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: await fetch(
            "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmME.ttf"
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
