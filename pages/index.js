import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterEmbedMeta from "../components/FarcasterEmbedMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
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
      </Head>

      {/* ✅ Required META for embed */}
      <FarcasterEmbedMeta />

      <div className="min-h-screen bg-gray-950 text-gray-100 p-4">
        <h1 className="text-xl font-bold mb-4 text-center">
          FPL Transfer Suggestor
        </h1>

        <label className="block mb-2 font-semibold">
          Enter Manager ID
        </label>

        <input
          type="text"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          placeholder="e.g. 619981"
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
        />

        <button
          onClick={runSuggestion}
          disabled={loading}
          className="mt-3 w-full p-3 rounded bg-purple-600 text-white font-bold disabled:opacity-50"
        >
          {loading ? "Loading…" : "Get Suggestion"}
        </button>

        {error && (
          <p className="mt-4 text-red-400 font-semibold">
            {error}
          </p>
        )}

        {suggestion && (
          <div className="mt-6 p-4 rounded bg-gray-800 border border-purple-600">
            <h2 className="font-bold text-lg mb-2 text-purple-300">
              Suggested Transfer
            </h2>
            <p>Out: {suggestion.out}</p>
            <p>In: {suggestion.in}</p>
            <p>Position: {suggestion.position}</p>
            <p>Form: {suggestion.form}</p>
          </div>
        )}

        {team?.length > 0 && (
          <div className="mt-6 p-4 rounded bg-gray-900 border border-gray-700">
            <h2 className="font-bold text-lg mb-2">Your Team</h2>
            {team.map((p, i) => (
              <p key={i}>
                {p.name} — {p.position}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

