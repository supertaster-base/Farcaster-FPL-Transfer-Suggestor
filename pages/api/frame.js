import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const managerId = searchParams.get("managerId") || "619981";

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://farcaster-fpl-suggestor.vercel.app";
  const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`);
  const data = await res.json();

  const suggestion = data?.suggestion || {
    out: "Player A",
    in: "Player B",
    form: "6.3",
    position: "MID",
  };

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontFamily: "system-ui",
          padding: "40px",
        }}
      >
        <h1 style={{ fontSize: 48, color: "#818cf8" }}>Farcaster FPL Suggestion</h1>
        <p style={{ fontSize: 28, marginTop: 20 }}>
          💬 Out: {suggestion.out} → In: {suggestion.in}
        </p>
        <p style={{ fontSize: 24, color: "#a5b4fc" }}>
          Position: {suggestion.position} | Form: {suggestion.form}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
