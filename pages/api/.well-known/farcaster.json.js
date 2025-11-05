export const config = { runtime: "edge" };

export default async function handler() {
  const manifest = {
    name: "Farcaster FPL Transfer Suggestor",
    description:
      "Get live Fantasy Premier League transfer suggestions directly inside Farcaster. Smarter transfers, fewer knee-jerks ⚽️",
    icon: "https://farcaster-fpl-transfer-suggestor.vercel.app/icon.png",
    home_url: "https://farcaster-fpl-transfer-suggestor.vercel.app",
    frame_url: "https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame",
    cover_image:
      "https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
    developer: "supertaster.base.eth",
    supported_actions: ["post", "post_redirect", "link"],
    theme_color: "#4F46E5",
    splash_background_color: "#0F172A",
    splash_foreground_color: "#FFFFFF",
    categories: ["sports", "fantasy", "football", "analytics"],
    privacy_policy_url:
      "https://farcaster-fpl-transfer-suggestor.vercel.app/privacy",
    terms_of_service_url:
      "https://farcaster-fpl-transfer-suggestor.vercel.app/terms",
    accountAssociation: {
      header:
        "eyJmaWQiOjI5NzA2NiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDE3MmE3N0Q0MDljMGFBNDIyZUU4ODUxNDE4MTc2NTM3MmMxZWI4RjEifQ",
      payload:
        "eyJkb21haW4iOiJmYXJjYXN0ZXItZnBsLXRyYW5zZmVyLXN1Z2dlc3Rvci52ZXJjZWwuYXBwIn0",
      signature:
        "IHDaFrM+CxzKNmYCMzXjzx2MyoSZrRJiRxdnJaAUq/ptMnRzOi8MWrpuPIUaj9fTa+q1sVGS8A/sVjRNAiEm+Bs=",
    },
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}



