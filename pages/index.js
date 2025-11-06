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

  // ✅ Initialize Farcaster Mini App SDK (browser only)
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

  // ✅ Fetch suggestion and team data
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

        {/* ✅ Only inject meta client-side (prevents build errors) */}
        {typeof window !== "undefined" && (
          <script
            id="farcaster-miniapp-meta"
            dangerouslySetInnerHTML={{
              __html: `
                const meta = document.createElement('meta');
                meta.name = 'fc:miniapp';
                meta.content = '{"version":"1","imageUrl":"https://farcaster-fpl-transfer-suggestor.vercel.app/cover.png","button":{"title":"Open Mini App","action":{"type":"launch_frame","url":"https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"}}}';
                document.head.appendChild(meta);
              `,
            }}
          />
        )}

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

      {/* ✅ Farcaster frame tags */}
      <FarcasterHead />

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Farcaster FPL Transfer Suggestor
        </h1>

        <div className="flex flex-col items-center space-y-3 w-full max-w-md">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
            placeholder="Enter FPL Manager ID"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          />

          <button
            onClick={runSuggestion}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Suggestion"}
          </button>

          {error && <p className="text-red-400 mt-2">{error}</p>}

          {suggestion && (
            <div className="w-full bg-gray-800 mt-6 p-4 rounded-lg shadow-lg text-left">
              <h2 className="text-xl font-semibold mb-2">Suggested Transfer</h2>
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {JSON.stringify(suggestion, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
