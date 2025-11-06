import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const out = searchParams.get("out") ?? "";
  const inn = searchParams.get("in") ?? "";
  const position = searchParams.get("position") ?? "";
  const form = searchParams.get("form") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#0A1321",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 60,
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            FPL Transfer Suggestion
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              fontSize: 50,
              fontWeight: 600,
            }}
          >
            <span style={{ color: "#ff7676" }}>{out}</span>
            <span style={{ color: "#ffffff" }}>→</span>
            <span style={{ color: "#7CFF7C" }}>{inn}</span>
          </div>

          <div
            style={{
              fontSize: 40,
              color: "#cccccc",
              display: "flex",
            }}
          >
            {position} • Form: {form}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

