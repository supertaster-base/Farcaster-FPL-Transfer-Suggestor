export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
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
}

