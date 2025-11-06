import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="fc:miniapp"
          content='{
            "version": "1",
            "imageUrl": "https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
            "button": {
              "title": "Open Mini App",
              "action": {
                "type": "launch_frame",
                "url": "https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
              }
            }
          }'
        />
      </Head>

      {/* rest of UI */}
    </>
  );
}
