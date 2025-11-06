import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterEmbedMeta from "../components/FarcasterEmbedMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FARCASTER READY — CLIENT-ONLY + Prefill manager ID
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Prefill previously stored manager ID
    const stored = localStorage.getItem("fpl_manager_id");
    if (stored) {
      setManagerId(stored);
    }

    let cancelled = false;

    async function initFarcaster() {
      try {
        const sdkModule = await import("@farcaster/miniapp-sdk");
        const sdk = sdkModule.default || sdkModule;

        if (!sdk?.actions?.ready) return;
        if (cancelled) return;

        await sdk.actions.ready();
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
    if (managerId) {
      localStorage.setItem("fpl_manager_id", managerId);
    }

    setLoading(true);
    setError(null);
    setSuggestion(null);
    setTeam([]);

    try {
      const res = await fetch(
        `/api/suggest?managerId=${encodeURIComponent(managerId)}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error fetching suggestion");

      if (!data.suggestion || !data.suggestion.in || !data.suggestion.out) {
        setSuggestion({
          none: true,
          message:
            "✅ Your squad looks solid — no obvious transfers needed this GW!",
        });
        return;
      }

      setSuggestion(data.suggestion);

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

  async function shareSuggestion() {
    if (!suggestion) return;

    const shareUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";

    const text = `I just improved my FPL team for next GW! ✅

Suggested transfer:
${suggestion.out} → ${suggestion.in} (${suggestion.position} • ${suggestion.form})

Check out your suggested transfer:

${shareUrl}
`;

    try {
      const sdkModule = await import("@farcaster/miniapp-sdk");
      const sdk = sdkModule.default || sdkModule;

      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
      );
    } catch (err) {
      console.error("❌ Share failed:", err);
    }
  }

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
          content="Get smart Fantasy Premier League transfer suggestions inside Farcaster."
        />
      </Head>

      <FarcasterEmbedMeta />

      <div className="min-h-screen bg-gray-950 text-gray-100 px-3 py-6 w-full mx-auto flex flex-col space-y-6">

        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            FPL Transfer Suggestor
          </h1>
          <p className="text-gray-400 text-sm mt-2 leading-snug max-w-xs mx-auto">
            Get a smart transfer based on your Fantasy Premier League squad.
          </p>
        </header>

        {/* INPUT BLOCK */}
        <div className="w-full rounded-lg bg-gray-900 border border-gray-800 p-4 space-y-3 shadow-sm">
          <label className="text-xs font-medium text-gray-400">
            Manager ID
          </label>

          <input
            type="text"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="e.g. 619981"
            className="w-full p-2 text-sm rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 outline-none"
          />

          <button
            onClick={runSuggestion}
            disabled={loading}
            className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-md disabled:opacity-50"
          >
            {loading
              ? "Loading…"
              : suggestion
              ? "Get Another Suggestion"
              : "Get Suggestion"}
          </button>

          <p className="text-[11px] text-gray-500 text-center mt-1 leading-tight">
            You can find your Manager ID in your FPL profile
            <br />
            (Gameweek History URL)
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 font-medium text-xs">{error}</p>
        )}

        {/* SUGGESTED TRANSFER */}
        {suggestion && (
          <div className="p-4 rounded-lg bg-gray-800 border border-purple-600 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-base text-green-300">
                Suggested Transfer
              </h2>
              <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded bg-gray-700">
                Live
              </span>
            </div>

            {suggestion.in ? (
              <>
                <p className="text-sm font-semibold leading-snug">
                  <span className="text-gray-200">{suggestion.out}</span>
                  {" → "}
                  <span className="text-green-400">{suggestion.in}</span>
                </p>

                <p className="text-xs text-gray-300">
                  Position: {suggestion.position} • Form: {suggestion.form}
                </p>

                <button
                  onClick={shareSuggestion}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md text-sm"
                >
                  Share Transfer
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-300 italic">
                ✅ Your squad is already strong! Best to save your transfer this GW.
              </p>
            )}
          </div>
        )}

        {/* TEAM */}
        {team?.length > 0 && (() => {
          const grouped = groupTeam(team);
          return (
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 space-y-4 shadow-sm">
              <h2 className="font-semibold text-base text-gray-200">
                Full Squad
              </h2>

              {Object.entries(grouped).map(([pos, players]) =>
                players?.length > 0 ? (
                  <div key={pos} className="space-y-1">
                    <h3 className="text-purple-300 font-semibold text-xs tracking-wider">
                      {pos}
                    </h3>
                    {players.map((p, i) => (
                      <p
                        key={i}
                        className="text-xs text-gray-300 ml-2 leading-tight"
                      >
                        {p.name}
                      </p>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          );
        })()}

        <footer className="text-center text-gray-500 text-[11px] pt-2 pb-6">
          Built for Farcaster Mini Apps • v1
        </footer>
      </div>
    </>
  );
}

