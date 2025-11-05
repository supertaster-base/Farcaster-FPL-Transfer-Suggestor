import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function handler(req) {
  // Log ping for analytics
  try {
    const ua = req.headers.get("user-agent") || "unknown";
    const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
    console.log(`[Frame View] ${new Date().toISOString()} | IP: ${ip} | UA: ${ua}`);
  } catch (err) {
    console.warn("Analytics log failed:", err);
  }

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

  const imageUrl = `${baseUrl}/api/frame-image?managerId=${managerId}`;
  const nextUrl = `${baseUrl}/api/frame-next?managerId=${managerId}`;
  const shareText = encodeURIComponent(
    `FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`
  );
  const shareUrl = `https://farcaster.com/~/compose?text=${shareText}`;

  // --- ✅ Return clean JSON metadata ---
  const responseBody = {
    frame: "vNext",
    image: imageUrl,
    buttons: [
      { label: "Next Suggestion", action: "post", target: nextUrl },
      { label: "Share Transfer", action: "post_redirect", target: shareUrl },
      { label: "Open App", action: "link", target: baseUrl },
    ],
  };

  return new Response(JSON.stringify(responseBody, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}


