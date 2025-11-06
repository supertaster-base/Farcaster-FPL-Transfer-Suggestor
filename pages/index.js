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

      {/* ✅ Required META for Mini App embed */}
      <FarcasterEmbedMeta />

      <div className="min-h-screen w-full bg-[#0F172A] text-slate-100 p-4">
        <div className="max-w-lg mx-auto space-y-6">

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              FPL Transfer Suggestor
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Get a smart transfer based on your manager ID
            </p>
          </div>

          {/* Card: Input */}
          <div className="bg-[#1E293B] p-4 rounded-2xl shadow-md border border-slate-800">
            <label className="block mb-2 font-semibold">
              Enter Manager ID
            </label>

            <input
              type="text"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              placeholder="e.g. 619981"
              className="w-full p-3 rounded-lg bg-slate-900/60 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            />

            <button
              onClick={runSuggestion}
              disabled={loading || !managerId}
              className="mt-3 w-full py-3 rounded-xl bg-[#4F46E5] hover:opacity-95 font-bold disabled:opacity-40 transition"
            >
              {loading ? "Fetching suggestion…" : "Get Suggestion"}
            </button>

            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Card: Result */}
          {suggestion && (
            <div className="bg-[#1E293B] p-4 rounded-2xl shadow-md border border-[#10B981]/40">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-[#10B981]">
                  Suggested Transfer
                </h2>
                <span className="text-xs text-slate-400">Live</span>
              </div>

              <div className="text-xl">
                <span className="font-semibold">{suggestion.out}</span>
                <span className="mx-2 text-slate-400">→</span>
                <span className="font-semibold text-[#10B981]">
                  {suggestion.in}
                </span>
              </div>

              <p className="text-sm text-slate-400 mt-2">
                Position: {suggestion.position ?? "—"} • Form:{" "}
                {suggestion.form ?? "—"}
              </p>
            </div>
          )}

          {/* Card: Recent */}
          {recent.length > 0 && (
            <div className="bg-[#1E293B] p-4 rounded-2xl shadow-md border border-slate-800">
              <h3 className="font-bold mb-2">Recent Suggestions</h3>
              <div className="divide-y divide-slate-800">
                {recent.map((r, i) => (
                  <div key={i} className="py-2 text-sm">
                    <span className="font-medium">{r.out}</span>
                    <span className="mx-2 text-slate-500">→</span>
                    <span className="font-medium text-[#10B981]">
                      {r.in}
                    </span>
                    <span className="ml-2 text-slate-500">
                      ({r.position ?? "—"} • {r.form ?? "—"})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-slate-500">
            Built for Farcaster Mini Apps • v1
          </p>
        </div>
      </div>
    </>
  );
}


