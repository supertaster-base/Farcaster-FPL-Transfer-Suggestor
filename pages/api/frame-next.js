{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ ImageResponse \} from "@vercel/og";\
\
export const config = \{ runtime: "edge" \};\
\
async function getSuggestion(managerId) \{\
  const baseUrl = "https://farcaster-fpl-transfer-suggestor.vercel.app";\
  const res = await fetch(`$\{baseUrl\}/api/suggest?managerId=$\{managerId\}`, \{\
    cache: "no-store",\
  \});\
  if (!res.ok) throw new Error("Cannot fetch suggestion");\
  const data = await res.json();\
  return data.suggestion;\
\}\
\
export default async function handler(req) \{\
  const \{ searchParams \} = new URL(req.url);\
  const managerId = searchParams.get("managerId") || "619981";\
  const index = parseInt(searchParams.get("i") || "0", 10);\
\
  let suggestion;\
  try \{\
    const suggestions = [];\
    for (let x = 0; x < 3; x++) \{\
      try \{\
        const s = await getSuggestion(managerId);\
        if (s) suggestions.push(s);\
      \} catch \{\}\
    \}\
    suggestion = suggestions[index % suggestions.length];\
  \} catch (err) \{\
    console.error("Error cycling suggestions:", err);\
  \}\
\
  const display = suggestion || \{\
    out: "Your team looks great \uc0\u55357 \u56490 ",\
    in: "Save your transfer \uc0\u55357 \u56841 ",\
    position: "\'97",\
    form: "\'97",\
  \};\
\
  const nextIndex = (index + 1) % 3;\
  const nextUrl = `https://farcaster-fpl-transfer-suggestor.vercel.app/api/frame-next?managerId=$\{managerId\}&i=$\{nextIndex\}`;\
\
  return new ImageResponse(\
    (\
      <div\
        style=\{\{\
          width: "100%",\
          height: "100%",\
          backgroundImage:\
            "linear-gradient(to bottom right, #0f172a, #1e293b)",\
          display: "flex",\
          flexDirection: "column",\
          justifyContent: "center",\
          alignItems: "center",\
          fontFamily: "system-ui, sans-serif",\
          color: "white",\
          textAlign: "center",\
        \}\}\
      >\
        <div style=\{\{ fontSize: 54, color: "#818cf8", marginBottom: 30 \}\}>\
          FPL Transfer Suggestion \uc0\u55357 \u56580 \
        </div>\
\
        <div style=\{\{ display: "flex", alignItems: "center", fontSize: 46 \}\}>\
          <span style=\{\{ color: "#f87171" \}\}>\{display.out\}</span>\
          <span style=\{\{ margin: "0 40px", color: "#a5b4fc" \}\}>\uc0\u8594 </span>\
          <span style=\{\{ color: "#4ade80" \}\}>\{display.in\}</span>\
        </div>\
\
        <div style=\{\{ marginTop: 20, fontSize: 24, color: "#c7d2fe" \}\}>\
          Position: \{display.position\} | Form: \{display.form\}\
        </div>\
\
        <div style=\{\{ marginTop: 40, fontSize: 22, color: "#818cf8" \}\}>\
          Tap again for next suggestion \uc0\u8594 \
        </div>\
      </div>\
    ),\
    \{\
      width: 1200,\
      height: 630,\
      headers: \{\
        "fc:frame": "vNext",\
        "fc:frame:image": nextUrl,\
\
        "fc:frame:button:1": "Next Suggestion",\
        "fc:frame:button:1:action": "post",\
        "fc:frame:button:1:target": nextUrl,\
\
        "fc:frame:button:2": "Open App",\
        "fc:frame:button:2:action": "link",\
        "fc:frame:button:2:target":\
          "https://farcaster-fpl-transfer-suggestor.vercel.app",\
      \},\
    \}\
  );\
\}}