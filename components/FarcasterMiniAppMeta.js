import Head from "next/head";

export default function FarcasterMiniAppMeta() {
  const miniAppJson = JSON.stringify({
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

  return (
    <Head>
      <meta name="fc:miniapp" content={miniAppJson} />
    </Head>
  );
}

