import React, { useState, useEffect } from "react";
import FarcasterHead from "../components/FarcasterHead";
import Head from "next/head";

export default function Home() {
  const [managerId, setManagerId] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [recent, setRecent] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function initFarcaster() {
      // Only run this in the browser (not on the server)
      if (typeof window !== "undefined") {
        try {
          // Dynamically import the SDK so Next.js doesn’t try to load it during SSR
          const { sdk } = await import("@farcaster/frame-sdk");
          // Let Warpcast know your mini app is ready
          sdk.actions.ready();
          console.log("✅ Farcaster Mini App ready");
        } catch (err) {
          console.error("Farcaster SDK init error:", err);
        }
      }
    }

    initFarcaster();
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
    <FarcasterHead />  
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between md:hidden p-4 border-b border-gray-800 bg-gray-900/90 backdrop-blur-md">
        <h1 className="text-lg font-semibold text-indigo-400">
          FPL Dashboard
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition"
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 p-6 transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-20 ${
          sidebarOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "-translate-x-full opacity-0 scale-95 md:translate-x-0 md:opacity-100 md:scale-100"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">
          Recent Suggestions
        </h2>
        <div className="space-y-3 overflow-y-auto max-h-[70vh]">
          {recent.length === 0 && (
            <p className="text-gray-500 text-sm">No suggestions yet</p>
          )}
          {recent.map((s, i) => (
            <div
              key={i}
              className="bg-gray-800/80 rounded-lg p-3 border border-gray-700 hover:border-indigo-500 transition"
            >
              <p className="text-sm">
                <strong className="text-indigo-300">Out:</strong> {s.out}
              </p>
              <p className="text-sm">
                <strong className="text-fuchsia-300">In:</strong>{" "}
                {s.in ? s.in : "—"}
              </p>
              <p className="text-xs text-gray-400">
                {s.form ? `Form: ${s.form}` : "Save transfer 😉"}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Frosted blur overlay for mobile */}
      <div
        className={`fixed inset-0 z-10 bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main content */}
      <main
        className={`flex-1 p-6 md:p-8 flex flex-col items-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sidebarOpen ? "scale-[0.97] blur-sm md:scale-100 md:blur-0" : ""
        }`}
      >
        <div className="w-full max-w-2xl bg-gray-900/90 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-800 mt-4 md:mt-0 backdrop-blur-md">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-indigo-400 text-center md:text-left">
            Farcaster FPL Dashboard
          </h1>
          <p className="text-gray-400 mb-6 text-center md:text-left text-sm md:text-base">
            Enter your public FPL Manager ID to view your team and get a
            same-position transfer suggestion.
          </p>

          <input
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="e.g. 1234567"
            className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={runSuggestion}
            disabled={loading || !managerId}
            className={`w-full py-2.5 rounded-lg font-medium mt-4 transition ${
              loading || !managerId
                ? "bg-gray-700 cursor-not-allowed text-gray-400"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {loading ? "Loading …" : "Suggest Transfer"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/40 border border-red-800 rounded-lg text-red-300 text-sm">
              ⚠️ <strong>Error:</strong> {error}
            </div>
          )}

          {suggestion && (
            <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-xl">
              <h2 className="text-lg font-semibold text-indigo-300 mb-3">
                Suggested Transfer
              </h2>
              <div className="space-y-1.5 text-sm md:text-base">
                <div>
                  <strong>Out:</strong> {suggestion.out}{" "}
                  {suggestion.out_cost && `(${suggestion.out_cost}m)`}
                </div>
                {suggestion.in ? (
                  <>
                    <div>
                      <strong>In:</strong> {suggestion.in}{" "}
                      {suggestion.in_cost && `(${suggestion.in_cost}m)`} — form{" "}
                      {suggestion.form}
                    </div>
                    <div className="text-gray-400 text-sm">
                      Position: {suggestion.position}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-fuchsia-300 font-medium animate-pulse">
                    💬{" "}
                    {suggestion.message ||
                      "Your team looks great — save your transfer instead of knee-jerking 😉"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Team snapshot */}
        {team.length > 0 && (
          <div className="mt-8 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300 text-center md:text-left">
              Your Current Team
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {team.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-800/80 p-3 rounded-lg border border-gray-700 text-center text-sm hover:border-indigo-400 transition"
                >
                  <p className="font-medium text-fuchsia-300">{p.name}</p>
                  <p className="text-xs text-gray-400">
                    {p.position} — {p.form}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      </div>
    </>
  );
}

// trigger redeploy
