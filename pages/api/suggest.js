import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { managerId } = req.query;
    if (!managerId) {
      return res.status(400).json({ error: "Missing managerId" });
    }

    // Fetch bootstrap + fixtures
    const bootstrap = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    ).then((r) => r.json());

    const fixtures = await fetch(
      "https://fantasy.premierleague.com/api/fixtures/"
    ).then((r) => r.json());

    const players = bootstrap.elements;
    const positions = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };

    // Get current or next gameweek
    const currentEvent =
      bootstrap.events.find((e) => e.is_current) ||
      bootstrap.events.find((e) => e.is_next);

    if (!currentEvent) {
      return res.status(500).json({ error: "Cannot detect gameweek" });
    }

    const currentGw = currentEvent.id;

    // Fetch user's team picks
    const teamData = await fetch(
      `https://fantasy.premierleague.com/api/entry/${managerId}/event/${currentGw}/picks/`
    ).then((r) => r.json());

    const picks = teamData.picks || [];

    if (picks.length === 0) {
      return res.status(200).json({
        suggestion: null,
        message: "Could not load your squad. Check your Manager ID.",
      });
    }

    // Build full squad list
    const squad = picks.map((pick) => {
      const pl = players.find((p) => p.id === pick.element);
      return {
        id: pl.id,
        name: pl.web_name,
        pos: positions[pl.element_type],
      };
    });

    // Pick outgoing player randomly
    const outPick = picks[Math.floor(Math.random() * picks.length)];
    const outPlayer = players.find((p) => p.id === outPick.element);

    if (!outPlayer) {
      return res
        .status(500)
        .json({ error: "Could not match player from team." });
    }

    const outCost = outPlayer.now_cost / 10;

    // Same-position pool
    let samePosPlayers = players.filter(
      (p) => p.element_type === outPlayer.element_type && p.id !== outPlayer.id
    );

    // ✅ Remove already-owned players
    const owned = new Set(squad.map((p) => p.name.toLowerCase()));
    samePosPlayers = samePosPlayers.filter(
      (p) => !owned.has(p.web_name.toLowerCase())
    );

    // ✅ Avoid unavailable/injured
    samePosPlayers = samePosPlayers.filter((p) => {
      return (
        p.chance_of_playing_next_round == null || // Many have null
        p.chance_of_playing_next_round > 75       // “Likely to play”
      );
    });

    // ✅ Budget — only equal or cheaper replacement
    samePosPlayers = samePosPlayers.filter(
      (p) => p.now_cost / 10 <= outCost
    );

    // ---- FIXTURE DIFFICULTY SCORE ----
    function calcFixtureScore(playerId) {
      // lower score = easier fixtures
      const f = fixtures
        .filter(
          (fx) =>
            (fx.team_h === players[playerId - 1]?.team ||
             fx.team_a === players[playerId - 1]?.team) &&
            fx.event >= currentGw &&
            fx.event < currentGw + 3
        )
        .slice(0, 3);

      if (f.length === 0) return 10; // no info → default high difficulty

      let total = 0;
      for (const game of f) {
        // difficulty for player’s team
        total +=
          game.team_h === players[playerId - 1]?.team
            ? game.team_h_difficulty
            : game.team_a_difficulty;
      }
      return total / f.length;
    }

    // Work candidates
    let candidates = samePosPlayers.map((p) => ({
      ...p,
      formScore: parseFloat(p.form),
      fixtureScore: calcFixtureScore(p.id),
    }));

    // ✅ Require better form
    candidates = candidates.filter(
      (c) => c.formScore > parseFloat(outPlayer.form)
    );

    if (candidates.length === 0) {
      return res.status(200).json({
        suggestion: {
          out: outPlayer.web_name,
          out_cost: outCost.toFixed(1),
          in: null,
          in_cost: null,
          form: null,
          position: positions[outPlayer.element_type],
          message:
            "✅ No stronger upgrade found. Your squad looks solid — consider saving your transfer!",
        },
      });
    }

    // ✅ Sort: best form first, then easiest fixtures
    candidates.sort((a, b) => {
      if (b.formScore !== a.formScore)
        return b.formScore - a.formScore;
      return a.fixtureScore - b.fixtureScore; // easier fixtures rank higher
    });

    const bestIn = candidates[0];

    return res.status(200).json({
      suggestion: {
        out: outPlayer.web_name,
        out_cost: outCost.toFixed(1),
        in: bestIn.web_name,
        in_cost: (bestIn.now_cost / 10).toFixed(1),
        form: bestIn.form,
        position: positions[outPlayer.element_type],
        fixtures: bestIn.fixtureScore,
        message: null,
      },
    });
  } catch (err) {
    console.error("❌ /api/suggest failed:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}


