import React, { useState } from "react";

export default function PreviewFrame() {
  const [frameUrl, setFrameUrl] = useState(
    "https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame"
  );

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#0f172a",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", color: "#818cf8", marginBottom: 10 }}>
        🪄 Farcaster Frame Preview
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: 20 }}>
        Test your frame and buttons before posting on Warpcast.
      </p>

      <input
        value={frameUrl}
        onChange={(e) => setFrameUrl(e.target.value)}
        style={{
          width: "90%",
          maxWidth: 600,
          padding: "10px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "white",
          marginBottom: 20,
        }}
      />

 <img
  src={frameUrl}
  alt="Frame preview"
  style={{
    width: 600,
    height: 315,
    objectFit: "cover",
    borderRadius: 16,
    border: "2px solid #334155",
    background: "#1e1b4b",
  }}
  onError={(e) => {
    e.target.src = "";
    e.target.alt = "❌ Could not load frame image.";
  }}
/>


      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button
          onClick={() => setFrameUrl("/api/frame")}
          style={buttonStyle}
        >
          🟣 Initial Frame
        </button>
        <button
          onClick={() => setFrameUrl("/api/frame-next")}
          style={buttonStyle}
        >
          🔁 Next Frame
        </button>
        <button
          onClick={() => window.open(frameUrl, "_blank")}
          style={buttonStyle}
        >
          🌐 Open Directly
        </button>
      </div>

      <p style={{ marginTop: 30, fontSize: 13, color: "#64748b" }}>
        This preview simulates the Warpcast frame experience.
      </p>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  border: "none",
  borderRadius: 8,
  color: "white",
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(99,102,241,0.4)",
};
