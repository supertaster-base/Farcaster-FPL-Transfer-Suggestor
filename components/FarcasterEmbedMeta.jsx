import Head from "next/head";

export default function FarcasterEmbedMeta() {
  return (
    <Head>
      <meta
        name="fc:miniapp"
        content='{
          "version":"1",
          "imageUrl":"https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
          "button":{
            "title":"Open Mini App",
            "action":{
              "type":"launch_miniapp",
              "url":"https://farcaster-fpl-transfer-suggestor.vercel.app"
            }
          }
        }'
      />
    </Head>
  );
}
