// pages/api/frame.js
export default async function handler(req, res) {
  // --- Safe header access in Pages API ---
  const ua = req.headers["user-agent"] || "";
  const accept = req.headers["accept"] || "";
  const host = req.headers.host || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${proto}://${host}`;

  // --- Parse managerId from query ---
  const managerId = (req.query?.managerId && String(req.query.managerId)) || "619981";

  // --- Analytics ping (won’t throw) ---
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "0.0.0.0";
    console.log(`[Frame View] ${new Date().toISOString()} | IP: ${ip} | UA: ${ua}`);
  } catch (_) {}

  // --- Fetch suggestion (don’t break response if it fails) ---
  let display = {
    out: "Your team looks great 💪",
    in: "Save your transfer 😉",
    position: "—",
    form: "—",
  };
  try {
    const r = await fetch(`${baseUrl}/api/suggest?managerId=${encodeURIComponent(managerId)}`, {
      cache: "no-store",
    });
    if (r.ok) {
      const data = await r.json();
      if (data?.suggestion?.out && data?.suggestion?.in) display = data.suggestion;
    }
  } catch (e) {
    console.warn("Suggestion fetch failed:", e?.message || e);
  }

  // --- Frame payload (vNext) ---
  // If you removed /api/frame-image and /api/frame-next, point buttons elsewhere.
  const imageUrl = `${baseUrl}/cover.png`; // fallback image
  const nextUrl = `${baseUrl}/api/frame`;  // simple "post" that re-hits this endpoint
  const shareText = encodeURIComponent(`FPL Suggestion — ${display.out} → ${display.in} via ${baseUrl}`);
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

  // --- If a validator/browser is requesting HTML, send meta tags version
  const isHtmlCheck = accept.includes("text/html") || ua.includes("Farcaster") || ua.includes("curl");
  if (isHtmlCheck) {
    const html = `<!doctype html>
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
  <body style="background:#0f172a;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,sans-serif;display:grid;place-items:center;min-height:100vh">
    <main style="text-align:center">
      <h1>FPL Transfer Suggestion</h1>
      <p>${display.out} → ${display.in}</p>
      <p>Frame metadata active ✅</p>
    </main>
  </body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
    res.status(200).send(html);
    return;
  }

  // --- Default: JSON for frame clients
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(jsonResponse);
}

