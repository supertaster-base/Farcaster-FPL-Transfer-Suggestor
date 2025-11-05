import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterHead from "../components/FarcasterHead";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Initialize Farcaster Mini App SDK
  useEffect(() => {
    async function initFarcaster() {
      if (typeof window !== "undefined") {
        try {
          const miniappModule = await import("@farcaster/miniapp-sdk");
          const miniapp = miniappModule.default || miniappModule;
          await miniapp.actions.ready();
          console.log("✅ Farcaster Mini App ready (miniapp-sdk)");
        } catch (err) {
          console.error("Farcaster SDK init error:", err);
        }
      }
    }
    initFarcaster();
  }, []);

  // ✅ Fetch FPL suggestion
  async function runSuggestion() {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const res = await fetch(
        `/api/suggest?managerId=${encodeURIComponent(managerId)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching suggestion");

      setSuggestion(data.suggestion);
      setRecent((prev) => [data.suggestion, ...prev.slice(0, 4)]);

      const teamRes = await fetch(
        `/api/team?managerId=${encodeURIComponent(managerId)}`
      );
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

        {/* ✅ OG fallback tags */}
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

      {/* ✅ Keep this outside <Head> */}
      <FarcasterHead />

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        <main className="p-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6">
            Farcaster FPL Transfer Suggestor
          </h1>

          <input
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Enter your FPL Manager ID"
            className="w-full max-w-sm p-2 rounded-lg text-gray-900"
          />

          <button
            onClick={runSuggestion}
            disabled={loading || !managerId}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-600"
          >
            {loading ? "Loading..." : "Suggest Transfer"}
          </button>

          {error && <div className="mt-4 text-red-400">⚠️ {error}</div>}

          {suggestion && (
            <div className="mt-6 text-gray-200">
              <p>
                <strong>Out:</strong> {suggestion.out}
              </p>
              <p>
                <strong>In:</strong> {suggestion.in}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}


