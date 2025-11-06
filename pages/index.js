export const runtime = "nodejs";

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

  // ✅ FARCASTER READY
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
          .catch((err) => console.error("❌ ready() failed:", err));
      }

      // ✅ initial call
      callReady();

      // ✅ fallback if shell loads slower
      window.addEventListener("focus", callReady);
      window.addEventListener("visibilitychange", () => {
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


    initFarcaster();
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
      if (!res.ok) throw new Error(data.error || "Suggestion failed");

      setSuggestion(data.suggestion);
      setRecent((prev) => [data.suggestion, ...prev.slice(0, 4)]);

      const teamRes = await fetch(
        `/api/team?managerId=${encodeURIComponent(managerId)}`
      );
      const teamData = await teamRes.json();
      setTeam(teamData.players || []);
    } catch (err) {
      console.error(err);
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

      {/* ✅ Required Farcaster Mini App meta */}
      <FarcasterMiniAppMeta />

      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
        {/* TODO: your UI */}
      </div>
    </>
  );
}

// ✅ This prevents Next from prerendering and avoids SSR `useEffect` break
export async function getServerSideProps() {
  return { props: {} };
}

