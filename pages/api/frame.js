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
      if (data?.suggestion?.out && data?.suggestion?.in) display = data.suggestion;
    }
  } catch (err) {
    console.error("Error fetching suggestion:", err);
  }

  // ✅ Load a real font buffer (required or OG renders blank)
  const fontData = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/ibmplexsans/IBMPlexSans-Regular.ttf"
  ).then((res) => res.arrayBuffer());

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
          backgroundColor: "#1e1b4b",
          color: "white",
          fontFamily: "IBM Plex Sans",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            marginBottom: 40,
            color: "#a5b4fc",
          }}
        >
          FPL Transfer Suggestion 🔄
        </div>

        <div style={{ fontSize: 48, marginBottom: 20 }}>
          <span style={{ color: "#f87171" }}>{display.out}</span>
          <span style={{ margin: "0 30px" }}>→</span>
          <span style={{ color: "#4ade80" }}>{display.in}</span>
        </div>

        <div style={{ fontSize: 28, color: "#c7d2fe" }}>
          Position: {display.position} | Form: {display.form}
        </div>

        <div style={{ fontSize: 24, color: "#818cf8", marginTop: 40 }}>
          Tap again for next suggestion →
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "IBM Plex Sans",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}