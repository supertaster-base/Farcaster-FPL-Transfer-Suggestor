import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const miniAppMetaTag = `
    <meta name="fc:miniapp" content='{"version":"1","imageUrl":"https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png","button":{"title":"Open Mini App","action":{"type":"launch_frame","url":"https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"}}}'>
  `;

  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Get live Fantasy Premier League transfer suggestions directly inside Farcaster."
        />

        {/* ✅ Inject literal <meta> markup — not escaped */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.head.insertAdjacentHTML("beforeend", \`${miniAppMetaTag}\`);
            `,
          }}
        />

        {/* Open Graph tags */}
        <meta property="og:title" content="Farcaster FPL Transfer Suggestor" />
        <meta
          property="og:description"
          content="Get smart FPL transfer suggestions directly inside Farcaster."
        />
        <meta
          property="og:image"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


