import React, { useState, useEffect } from "react";
import FarcasterHead from "../components/FarcasterHead";
import Head from "next/head";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function initFarcaster() {
      if (typeof window !== "undefined") {
        try {
          // ✅ Load the new Mini App SDK dynamically
          const miniapp = (await import("@farcaster/miniapp-sdk")).default;

          // ✅ Notify Farcaster that the Mini App is ready
          await miniapp.ready();

          console.log("✅ Farcaster Mini App ready (miniapp-sdk)");
        } catch (err) {
          console.error("Farcaster SDK init error:", err);
        }
      }
    }

    initFarcaster();
  }, []);

  async function runSuggestion() {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const res = await fetch(`/api/suggest?managerId=${encodeURIComponent(managerId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching suggestion");
      setSuggestion(data.suggestion);
      setRecent((prev) => [data.suggestion, ...prev.slice(0, 4)]);

      const teamRes = await fetch(`/api/team?managerId=${encodeURIComponent(managerId)}`);
      const teamData = await teamRes.json();
      setTeam(teamData.players || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Farcaster FPL Transfer Suggestor</title>
        <meta
          name="description"
          content="Get live Fantasy Premier League transfer suggestions directly inside Farcaster."
        />

        {/* ✅ Farcaster Mini App Embed Preview */}
        <meta
          name="fc:miniapp"
          content='{
            "version":"1",
            "imageUrl":"https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png",
            "button":{
              "title":"Open Mini App",
              "action":{
                "type":"launch_frame",
                "url":"https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
              }
            }
          }'
        />

        {/* ✅ OG fallback tags */}
        <meta property="og:title" content="Farcaster FPL Transfer Suggestor" />
        <meta
          property="og:description"
          content="Get smart FPL transfer suggestions directly in Farcaster."
        />
        <meta
          property="og:image"
          content="https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png"
        />
      </Head>

      <FarcasterHead />

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* rest of your page unchanged */}
      </div>
    </>
  );
}

