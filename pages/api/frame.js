import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "nodejs",
};

export default function handler() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontSize: 60,
            fontFamily: "system-ui",
          }}
        >
          Frame OK
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    console.error("OG error:", e);
    return new Response(`OG error: ${e.message}`, { status: 500 });
  }
}
