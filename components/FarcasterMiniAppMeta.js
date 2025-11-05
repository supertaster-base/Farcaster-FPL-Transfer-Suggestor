import Head from "next/head";
import React from "react";

export default function FarcasterMiniAppMeta() {
  // Manually build raw string with proper double quotes
  const miniAppJSON = JSON.stringify({
    version: "1",
    imageUrl: "https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
    button: {
      title: "Open Mini App",
      action: {
        type: "launch_frame",
        url: "https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame",
      },
    },
  });

  // ✅ Inject meta tag via dangerouslySetInnerHTML inside <Head> but as full tag
  // This forces Next.js to render the meta tag verbatim, not escaped.
  return (
    <Head>
      <meta
        name="fc:miniapp"
        content={miniAppJSON}
        key="fc:miniapp"
      />
    </Head>
  );
}
