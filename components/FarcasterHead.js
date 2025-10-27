import Head from "next/head";

export default function FarcasterHead() {
  return (
    <Head>
      {/* Standard OG tags */}
      <meta property="og:title" content="Farcaster FPL Transfer Suggestor" />
      <meta
        property="og:description"
        content="Get instant FPL transfer tips directly inside Warpcast."
      />
      <meta
        property="og:image"
        content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
      />

      {/* Farcaster frame meta tags */}
      <meta name="fc:frame" content="vNext" />
      <meta
        name="fc:frame:image"
        content="https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
      />
      <meta name="fc:frame:button:1" content="Next Suggestion" />
      <meta name="fc:frame:button:1:action" content="post" />
      <meta name="fc:frame:button:2" content="Open App" />
      <meta name="fc:frame:button:2:action" content="link" />
      <meta
        name="fc:frame:button:2:target"
        content="https://farcaster-fpl-transfer-suggestor.vercel.app"
      />
    </Head>
  );
}