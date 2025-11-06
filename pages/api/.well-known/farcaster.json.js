export const runtime = "nodejs"; // optional

export default async function handler() {
  const manifest = {
    version: "1",
    accountAssociation: {
      header:
        "eyJmaWQiOjI5NzA2NiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE3MmE3N0Q0MDljMGFBNDIyZUU4ODUxNDE4MTc2NTM3MmMxZWI4RjEifQ",
      payload:
        "eyJkb21haW4iOiJmYXJjYXN0ZXItZnBsLXRyYW5zZmVyLXN1Z2dlc3Rvci52ZXJjZWwuYXBwIn0",
      signature:
        "IHDaFrM+CxzKNmYCMzXjzx2MyoSZrRJiRxdnJaAUq/ptMnRzOi8MWrpuPIUaj9fTa+q1sVGS8A/sVjRNAiEm+Bs=",
    },
    miniapp: {
      version: "1",
      name: "Farcaster FPL Transfer Suggestor",
      description:
        "Get live Fantasy Premier League transfer suggestions directly inside Farcaster.",
      iconUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app/icon.png",
      homeUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app",
      imageUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
      buttonTitle: "Open Mini App",
      splashImageUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app/icon.png",
      splashBackgroundColor: "#0F172A",
      themeColor: "#4F46E5",
      privacyPolicyUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app/privacy",
      termsOfServiceUrl:
        "https://farcaster-fpl-transfer-suggestor.vercel.app/terms",
      categories: ["sports", "fantasy", "football", "analytics"],
    },
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}


