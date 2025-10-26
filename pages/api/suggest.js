import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { managerId } = req.query;
    if (!managerId) {
      return res.status(400).json({ error: "Missing managerId" });
    }

    // Fetch player + event data
    const bootstrap = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    ).then((r) => r.json());
    const players = bootstrap.elements;
    const positions = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };

    // Get current or next gameweek
    const currentEvent =
      bootstrap.events.find((e) => e.is_current) ||
      bootstrap.events.find((e) => e.is_next);
    const currentGw = currentEvent.id;

    // Fetch user's team for that gameweek
    const teamData = await fetch(
      `https://fantasy.premierleague.com/api/entry/${managerId}/event/${currentGw}/picks/`
    ).then((r) => r.json());
    const picks = teamData.picks || [];

    const outPick = picks[Math.floor(Math.random() * picks.length)];
    const outPlayer = players.find((p) => p.id === outPick.element);
    if (!outPlayer)
      return res.status(500).json({ error: "Could not match player from team." });

    const samePosPlayers = players.filter(
      (p) => p.element_type === outPlayer.element_type && p.id !== outPlayer.id
    );

    const budget =
      100 - (teamData.entry_history?.value || 100) / 10 + outPlayer.now_cost / 10;

    const candidates = samePosPlayers
      .filter((p) => parseFloat(p.form) > parseFloat(outPlayer.form))
      .filter((p) => p.now_cost / 10 <= budget)
      .sort((a, b) => parseFloat(b.form) - parseFloat(a.form));

    // 🟢 If no better same-position player exists → compliment the team
    if (candidates.length === 0) {
      return res.status(200).json({
        suggestion: {
          out: outPlayer.web_name,
          out_cost: (outPlayer.now_cost / 10).toFixed(1),
          in: null,
          in_cost: null,
          form: null,
          position: positions[outPlayer.element_type],
          message:
            "Your team looks great — save your transfer instead of knee-jerking 😉",
        },
      });
    }

    const bestIn = candidates[0];
    res.status(200).json({
      suggestion: {
        out: outPlayer.web_name,
        out_cost: (outPlayer.now_cost / 10).toFixed(1),
        in: bestIn.web_name,
        in_cost: (bestIn.now_cost / 10).toFixed(1),
        form: bestIn.form,
        position: positions[outPlayer.element_type],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
}
