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

    {/* Required META for embed */}
    <FarcasterEmbedMeta />

    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 space-y-6">

      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold">FPL Transfer Suggestor</h1>
        <p className="text-gray-300 text-sm">
          Get a smart transfer based on your manager ID
        </p>
      </header>

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

      {error && (
        <p className="text-red-400 font-semibold text-sm">
          {error}
        </p>
      )}

      {suggestion && (
        <div className="p-4 rounded-md bg-gray-800 border border-purple-600 space-y-2">
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
        </div>
      )}

      {recent?.length > 0 && (
        <div className="p-4 rounded-md bg-gray-900 border border-gray-700 space-y-2">
          <h2 className="font-bold text-lg text-gray-200">
            Recent Suggestions
          </h2>

          {recent.map((p, i) => (
            <p key={i} className="text-sm text-gray-300">
              {p.out} → <span className="text-green-400">{p.in}</span>
