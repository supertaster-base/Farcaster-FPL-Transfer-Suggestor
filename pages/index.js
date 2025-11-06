export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import FarcasterMiniAppMeta from "../components/FarcasterMiniAppMeta";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ FARCASTER `ready()` FIX — CLIENT-ONLY
  useEffect(() => {
    let cancelled = false;

    async function initFarcaster() {
      if (typeof window === "undefined") return;

      try {
        const mod = await import("@farcaster/miniapp-sdk");
        const miniapp = mod.default || mod;

        function callReady() {
          if (cancelled) return;

          if (!miniapp?.actions?.ready) {
            console.warn("⚠ miniapp.actions.ready missing");
            return;
          }

          miniapp.actions
            .ready()
            .then(() => console.log("✅ Farcaster Mini App ready"))
            .catch((err) =>
              console.error("❌ ready() failed:", err)
            );
        }

        // First attempt
        callReady();

        // Fallbacks — helps delayed shell load
        window.addEventListener("focus", callReady);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") callReady();
        });
      } catch (err) {
        console.error("❌ Farcaster SDK import failed:", err);
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

      <FarcasterMiniAppMeta />

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* your page */}
      </div>
    </>
  );
}
