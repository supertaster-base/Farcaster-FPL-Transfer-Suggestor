import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Farcaster FPL Transfer Suggestor</title>
        <meta
          name="description"
          content="Get live Fantasy Premier League transfer suggestions directly inside Farcaster."
        />

        {/* ✅ Correct Farcaster miniapp meta JSON */}
        <meta
          name="fc:miniapp"
          content='{"version":"1","imageUrl":"https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png","button":{"title":"Open Mini App","action":{"type":"launch_frame","url":"https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"}}}'
        />

        {/* --- Open Graph tags --- */}
        <meta property="og:title" content="Farcaster FPL Transfer Suggestor" />
        <meta
          property="og:description"
          content="Get instant FPL transfer tips directly inside Warpcast."
        />
        <meta
          property="og:image"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://farcaster-fpl-transfer-suggestor.vercel.app" />

        {/* --- Farcaster Frame vNext --- */}
        <meta name="fc:frame" content="vNext" />
        <meta
          name="fc:frame:image"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
        />
        <meta
          name="fc:frame:post_url"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame-next"
        />

        {/* --- Buttons --- */}
        <meta name="fc:frame:button:1" content="Next Suggestion" />
        <meta name="fc:frame:button:1:action" content="post" />
        <meta
          name="fc:frame:button:1:target"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame-next"
        />

        <meta name="fc:frame:button:2" content="Share This Transfer" />
        <meta name="fc:frame:button:2:action" content="post_redirect" />
        <meta
          name="fc:frame:button:2:target"
          content="https://warpcast.com/~/compose?text=FPL%20Suggestion%20via%20farcaster-fpl-transfer-suggestor.vercel.app"
        />

        <meta name="fc:frame:button:3" content="Open App" />
        <meta name="fc:frame:button:3:action" content="link" />
        <meta
          name="fc:frame:button:3:target"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app"
        />
      </Head>

      <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* rest of UI */}
      </main>
    </>
  );
}

