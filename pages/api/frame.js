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
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.suggestion?.out && data?.suggestion?.in) {
        display = data.suggestion;
      }
    }
  } catch (err) {
    console.error("Error fetching suggestion:", err);
  }

  const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 30% 40%, #1e1b4b, #0f172a 70%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        color: "white",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(129,140,248,0.35), rgba(0,0,0,0))",
          top: "-100px",
          right: "-150px",
          filter: "blur(80px)",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.25), rgba(0,0,0,0))",
          bottom: "-120px",
          left: "-120px",
          filter: "blur(100px)",
        }}
      ></div>

      <div
        style={{
          fontSize: 54,
          color: "#a5b4fc",
          fontWeight: 700,
          letterSpacing: -1,
          marginBottom: 30,
          textShadow: "0 0 30px rgba(129,140,248,0.3)",
        }}
      >
        FPL Transfer Suggestion 🔄
      </div>

      <div
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(129,140,248,0.3)",
          borderRadius: 20,
          padding: "40px 80px",
          boxShadow: "0 0 40px rgba(79,70,229,0.25)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>
          <span style={{ color: "#f87171" }}>{display.out}</span>
          <span style={{ margin: "0 40px", color: "#a5b4fc" }}>→</span>
          <span style={{ color: "#4ade80" }}>{display.in}</span>
        </div>

        <div style={{ fontSize: 26, color: "#c7d2fe" }}>
          Position: {display.position} | Form: {display.form}
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          fontSize: 22,
          color: "#818cf8",
          opacity: 0.8,
        }}
      >
        Tap again for next suggestion →
      </div>
    </div>,
        {
      width: 1200,
      height: 630,
      contentType: "image/png",
      fonts: [
        {
          name: "IBM Plex Sans",
          data: await fetch(
            "https://cdn.jsdelivr.net/gh/IBM/plex@1.9.0/IBM-Plex-Sans/fonts/complete/ttf/IBM-Plex-Sans-Regular.ttf"
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}