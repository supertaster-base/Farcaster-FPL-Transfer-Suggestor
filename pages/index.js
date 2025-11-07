import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterEmbedMeta from "../components/FarcasterEmbedMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [team, setTeam] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize + Prefill manager ID
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("fpl_manager_id");
    if (stored) setManagerId(stored);

    import("@farcaster/miniapp-sdk")
      .then((mod) => (mod.default || mod).actions?.ready?.())
      .catch(() => null);
  }, []);

  // ✅ Fetch popular transfers
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/popular");
        const data = await res.json();
        setPopular(data?.popular || []);
      } catch (err) {
        console.error("❌ popular error", err);
      }
    }
    load();
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

      if (!data.suggestion?.in || !data.suggestion?.out) {
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

      {/* ✅ full-width safe container */}
      <div
        className="min-h-screen text-gray-100 w-full mx-auto flex flex-col items-center"
        style={{
          background: "linear-gradient(#040a1a, #02040b)",
        }}
      >
        <div className="w-full max-w-sm px-3 py-6 flex flex-col space-y-6">

          {/* HEADER */}
          <header className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">
              FPL Transfer Suggestor
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-snug max-w-xs mx-auto">
              Get a smart transfer based on your Fantasy Premier League squad.
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              🔮 Powered by AI • Fixtures • Form • Injury risk
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
              You can find your Manager ID in your
              <br />
              FPL Gameweek History URL
            </p>
          </div>

          {/* POPULAR TRANSFERS */}
          <div className="w-full text-center text-sm text-gray-300 space-y-1">
            <p className="font-medium">🔥 Popular moves this week:</p>

            {popular?.length > 0 ? (
              popular.slice(0, 4).map((move, i) => (
                <p key={i}>
                  {move.out} → {move.in}
                </p>
              ))
            ) : (
              <p className="text-gray-600 text-xs">Loading…</p>
            )}
          </div>

          {/* FOOTER */}
          <footer className="text-center text-gray-500 text-[11px] pt-2 pb-6">
            Built for Farcaster Mini Apps • v1
          </footer>
        </div>
      </div>
    </>
  );
}

