import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterEmbedMeta from "../components/FarcasterEmbedMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FARCASTER READY — CLIENT-ONLY
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function initFarcaster() {
      try {
        const sdkModule = await import("@farcaster/miniapp-sdk");
        const sdk = sdkModule.default || sdkModule;

        if (!sdk?.actions?.ready) {
          console.warn("⚠ miniapp.actions.ready not found");
          return;
        }

        if (cancelled) return;

        await sdk.actions.ready();
        console.log("✅ Farcaster Mini App ready");
      } catch (err) {
        console.error("❌ Farcaster SDK init failed:", err);
      }
    }

    initFarcaster();
    return () => {
      cancelled = true;
    };
  }, []);

  async function runSuggestion() {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    setTeam([]);

    try {
      const res = await fetch(`/api/suggest?managerId=${encodeURIComponent(managerId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error fetching suggestion");
      setSuggestion(data.suggestion);

      const teamRes = await fetch(`/api/team?managerId=${encodeURIComponent(managerId)}`);
      const teamData = await teamRes.json();
      setTeam(teamData.players || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function shareSuggestion() {
    if (!suggestion) return;

    const text = `I just improved my FPL team for next GW! ✅

Suggested transfer:
${suggestion.out} → ${suggestion.in} (${suggestion.position} • ${suggestion.form})

See your recommended transfer:
https://farcaster-fpl-transfer-suggestor.vercel.app
`;

    try {
      const sdkModule = await import("@farcaster/miniapp-sdk");
      const sdk = sdkModule.default || sdkModule;

      await sdk.actions.openUrl(
        `https://farcaster.xyz/compose?text=${encodeURIComponent(text)}`
      );
    } catch (err) {
      console.error("❌ Share failed:", err);
    }
  }

  // ✅ Group players by position
  function groupTeam(players) {
    const groups = { GK: [], DEF: [], MID: [], FWD: [] };
    players.forEach((p) => {
      if (groups[p.position]) groups[p.position].push(p);
    });
    return groups;
  }

  return (
    <>
      <Head>
        <title>Farcaster FPL Transfer Suggestor</title>
        <meta
          name="description"
          content="Get live Fantasy Premier League transfer suggestions directly inside Farcaster."
        />
      </Head>

      <FarcasterEmbedMeta />

      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 mx-auto w-full max-w-md space-y-6">

        {/* ✅ Header */}
        <header className="text-center space-y-1">
          <h1 className="text-xl font-bold">FPL Transfer Suggestor</h1>
          <p className="text-gray-300 text-sm">
            Get a smart transfer based on your manager ID
          </p>
        </header>

        {/* ✅ Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Enter Manager ID
          </label>

          <input
            type="text"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="e.g. 619981"
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:border-purple-500 outline-none"
          />

          <button
            onClick={runSuggestion}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Loading…" : "Get Suggestion"}
          </button>
        </div>

        {/* ✅ Error */}
        {error && (
          <p className="text-red-400 font-semibold text-sm">{error}</p>
        )}

        {/* ✅ Suggested Transfer */}
        {suggestion && (
          <div className="p-4 rounded-md bg-gray-800 border border-purple-600 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-green-300">
                Suggested Transfer
              </h2>
              <span className="text-xs text-gray-400 px-2 py-1 rounded bg-gray-700">
                Live
              </span>
            </div>

            <p className="text-md font-semibold">
              <span className="text-gray-200">{suggestion.out}</span>
              {" → "}
              <span className="text-green-400">{suggestion.in}</span>
            </p>

            <p className="text-sm text-gray-300">
              Position: {suggestion.position} • Form: {suggestion.form}
            </p>

            <button
              onClick={shareSuggestion}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md"
            >
              Share Transfer
            </button>
          </div>
        )}

        {/* ✅ Full Squad */}
        {team?.length > 0 && (() => {
          const grouped = groupTeam(team);

          return (
            <div className="p-4 rounded-md bg-gray-900 border border-gray-700 space-y-4">
              <h2 className="font-bold text-lg text-gray-200">
                Full Squad
              </h2>

              {Object.entries(grouped).map(([pos, players]) =>
                players.length > 0 ? (
                  <div key={pos} className="space-y-1">
                    <h3 className="text-purple-300 font-semibold text-sm">
                      {pos}
                    </h3>

                    {players.map((p, i) => (
                      <p key={i} className="text-sm text-gray-300 ml-2">
                        {p.name}
                      </p>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          );
        })()}

        {/* ✅ Footer */}
        <footer className="text-center text-gray-500 text-xs pt-6">
          Built for Farcaster Mini Apps • v1
        </footer>
      </div>
    </>
  );
}

