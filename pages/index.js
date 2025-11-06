import React, { useState, useEffect } from "react";
import Head from "next/head";

// ✅ ADD THIS — NEW MINIAPP META COMPONENT
import FarcasterEmbedMeta from "../components/FarcasterEmbedMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      </Head>

      {/* ✅ INSERT HERE */}
      <FarcasterEmbedMeta />

{/* --- SMOKE TEST BANNER --- */}
<div
  id="smoke-test"
  style={{
    padding: '16px',
    margin: '16px',
    borderRadius: '12px',
    background: '#22C55E',
    color: '#000',
    fontWeight: 700,
    textAlign: 'center',
  }}
>
  ✅ Mini App UI rendered
</div>

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* your page */}
      </div>
    </>
  );
}
