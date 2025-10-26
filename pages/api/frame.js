import { ImageResponse } from "@vercel/og";

// ✅ Use Node runtime for stability
export const config = {
  runtime: "nodejs",
};

// ✅ Main Frame endpoint
export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId") || "619981";

    // Determine base URL (works both locally and on Vercel)
    const baseUrl =
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    // Attempt to fetch live FPL suggestion
    let suggestion = null;
    try {
      const res = await fetch(`${baseUrl}/api/suggest?managerId=${managerId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        suggestion = data?.suggestion || null;
      }
    } catch (err) {
      console.error("Suggest API fetch failed:", err);
    }

    // ✅ Fallback message if no transfer found or fetch fails
    const display = suggestion || {
      out: "Your team looks great 💪",
      in: "Save your transfer 😉",
      position: "—",
      form: "—",
    };

    // ✅ Return OG image
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
            fontFamily: "system-ui, sans-serif",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 48, color: "#818cf8" }}>
            Farcaster FPL Suggestion
          </h1>
          <p style={{ fontSize: 28, marginTop: 24 }}>
            💬 Out: {display.out}
          </p>
          <p style={{ fontSize: 28 }}>
            ➡️ In: {display.in}
          </p>
          <p style={{ fontSize: 22, color: "#a5b4fc", marginTop: 12 }}>
            Position: {display.position} | Form: {display.form}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Frame rendering error:", e);
    // ✅ Always return a safe fallback image if anything breaks
    return new ImageResponse(
      (
        <div
          style={{
            background: "#111827",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 42,
            fontFamily: "system-ui",
          }}
        >
          Oops! Frame error — try again later ⚙️
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
