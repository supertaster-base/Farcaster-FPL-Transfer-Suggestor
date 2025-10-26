import Head from "next/head";

export default function FarcasterHead() {
  return (
    <Head>
      <meta property="og:title" content="Farcaster FPL Suggestor" />
      <meta
        property="og:description"
        content="Get instant FPL transfer suggestions directly inside Warpcast."
      />
      <meta
        property="og:image"
        content="https://your-vercel-domain.vercel.app/api/frame"
      />
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content="https://your-vercel-domain.vercel.app/api/frame"
      />
      <meta property="fc:frame:button:1" content="💡 New Suggestion" />
      <meta property="fc:frame:button:1:action" content="post" />
      <meta
        property="fc:frame:post_url"
        content="https://your-vercel-domain.vercel.app/api/frame"
      />
      <meta property="fc:frame:button:2" content="⚽ Open Dashboard" />
      <meta property="fc:frame:button:2:action" content="link" />
      <meta
        property="fc:frame:button:2:target"
        content="https://your-vercel-domain.vercel.app/"
      />
    </Head>
  );
}
