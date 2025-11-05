import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function handler(req) {
  // --- Analytics ping ---
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

  // --- Suggestion fetch ---
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

  const jsonResponse = {
    frame: "vNext",
    image: imageUrl,
    buttons: [
      { label: "Next Suggestion", action: "post", target: nextUrl },
      { label: "Share Transfer", action: "post_redirect", target: shareUrl },
      { label: "Open App", action: "link", target: baseUrl },
    ],
  };

  // --- Detect if validator expects HTML ---
  const ua = req.headers.get("user-agent") || "";
  const accept = req.headers.get("accept") || "";

  const isHtmlCheck =
    ua.includes("Farcaster") ||
    ua.includes("curl") ||
    accept.includes("text/html");

  if (isHtmlCheck) {
    // --- ✅ Return HTML meta tags version (for preview & validation)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="og:title" content="FPL Transfer Suggestion 🔄" />
          <meta property="og:description" content="${display.out} → ${display.in}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Next Suggestion" />
          <meta property="fc:frame:button:1:action" content="post" />
          <meta property="fc:frame:button:1:target" content="${nextUrl}" />
          <meta property="fc:frame:button:2" content="Share Transfer" />
          <meta property="fc:frame:button:2:action" content="post_redirect" />
          <meta property="fc:frame:button:2:target" content="${shareUrl}" />
          <meta property="fc:frame:button:3" content="Open App" />
          <meta property="fc:frame:button:3:action" content="link" />
          <meta property="fc:frame:button:3:target" content="${baseUrl}" />
        </head>
        <body style="background-color:#0f172a;color:white;font-family:sans-serif;text-align:center;padding-top:20%">
          <h1>FPL Transfer Suggestion</h1>
          <p>${display.out} → ${display.in}</p>
          <p>Frame metadata active ✅</p>
        </body>
      </html>
    `;
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  }

  // --- ✅ Normal JSON response for frame clients ---
  return new Response(JSON.stringify(jsonResponse, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}



