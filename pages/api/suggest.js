import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { managerId } = req.query;
    if (!managerId) {
      return res.status(400).json({ error: "Missing managerId" });
    }

    // ---- BOOTSTRAP + FIXTURES ----
    const bootstrap = await fetch(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    ).then((r) => r.json());

    const fixtures = await fetch(
      "https://fantasy.premierleague.com/api/fixtures/"
    ).then((r) => r.json());

    const players = bootstrap.elements;
    const positions = { 1: "GK", 2: "DEF", 3: "MID", 4: "FWD" };

    // Get current or next GW for upcoming fixtures / form horizon
    const currentEvent =
      bootstrap.events.find((e) => e.is_current) ||
      bootstrap.events.find((e) => e.is_next);

    if (!currentEvent) {
      return res.status(500).json({ error: "Cannot detect gameweek" });
    }

    const currentGw = currentEvent.id;

    // ---- ENTRY HISTORY (FOR FREE HIT + BASE TEAM GW) ----
    const historyData = await fetch(
      `https://fantasy.premierleague.com/api/entry/${managerId}/history/`
    ).then((r) => r.json());

    const historyCurrent = historyData.current || [];
    const chips = historyData.chips || [];

    // Last round the manager has actually played
    const lastGw = historyCurrent.length
      ? historyCurrent[historyCurrent.length - 1].event
      : currentGw;

    const lastChip = chips[chips.length - 1];
    const usedFreeHitLastRound =
      lastChip && lastChip.name === "freehit" && lastChip.event === lastGw;

    // 👇 If Free Hit used in last round → use team from GW-1
    const baseGw = usedFreeHitLastRound ? Math.max(1, lastGw - 1) : lastGw;

    // ---- FETCH TEAM PICKS FOR BASE GW (NOT NECESSARILY CURRENT GW) ----
    const teamData = await fetch(
      `https://fantasy.premierleague.com/api/entry/${managerId}/event/${baseGw}/picks/`
    ).then((r) => r.json());

    const picks = teamData.picks || [];

    if (picks.length === 0) {
      return res.status(200).json({
        suggestion: null,
        message: "Could not load your squad. Check your Manager ID.",
      });
    }

    // ---- WEIGHTED LAST-3-MATCHES SCORE ----
    async function getWeightedLast3Score(playerId, gwLimit) {
      const summary = await fetch(
        `https://fantasy.premierleague.com/api/element-summary/${playerId}/`
      ).then((r) => r.json());

      const games = (summary.history || [])
        .filter((h) => h.round <= gwLimit)
        .slice(-3); // last 3 matches (oldest → newest)

      if (games.length === 0) return 0;

      const weights = [0.15, 0.25, 0.6]; // three ago, two ago, last
      const offset = weights.length - games.length;

      return games.reduce((total, game, idx) => {
        const w = weights[offset + idx];
        return total + (game.total_points || 0) * w;
      }, 0);
    }

    // Build full squad list (for "owned" checks and friendly names)
    const squad = picks.map((pick) => {
      const pl = players.find((p) => p.id === pick.element);
      return {
        id: pl.id,
        name: pl.web_name,
        pos: positions[pl.element_type],
      };
    });

    // ---- PICK OUTGOING PLAYER (STILL RANDOM, BUT WEIGHTED FORM WILL GATE UPGRADES) ----
    const outPick = picks[Math.floor(Math.random() * picks.length)];
    const outPlayer = players.find((p) => p.id === outPick.element);

    if (!outPlayer) {
      return res
        .status(500)
        .json({ error: "Could not match player from team." });
    }

    const outCost = outPlayer.now_cost / 10;

    // Weighted form for outgoing player, based on games up to currentGw
    const outWeightedForm = await getWeightedLast3Score(outPlayer.id, currentGw);

    // ---- SAME-POSITION CANDIDATE POOL ----
    let samePosPlayers = players.filter(
      (p) => p.element_type === outPlayer.element_type && p.id !== outPlayer.id
    );

    // Remove already-owned players
    const owned = new Set(squad.map((p) => p.name.toLowerCase()));
    samePosPlayers = samePosPlayers.filter(
      (p) => !owned.has(p.web_name.toLowerCase())
    );

    // Avoid players with significant injury doubts
    samePosPlayers = samePosPlayers.filter((p) => {
      return (
        p.chance_of_playing_next_round == null || // Many are null
        p.chance_of_playing_next_round > 75
      );
    });

    // Budget: equal or cheaper replacements only
    samePosPlayers = samePosPlayers.filter(
      (p) => p.now_cost / 10 <= outCost
    );

    // ---- FIXTURE DIFFICULTY SCORE ----
    function calcFixtureScore(playerId) {
      // lower score = easier fixtures
      const teamId = players.find((p) => p.id === playerId)?.team;
      if (!teamId) return 10;

      const f = fixtures
        .filter(
          (fx) =>
            (fx.team_h === teamId || fx.team_a === teamId) &&
            fx.event >= currentGw && // upcoming from current/next GW
            fx.event < currentGw + 3
        )
        .slice(0, 3);

      if (f.length === 0) return 10;

      let total = 0;
      for (const game of f) {
        total +=
          game.team_h === teamId
            ? game.team_h_difficulty
            : game.team_a_difficulty;
      }
      return total / f.length;
    }

    // ---- BUILD CANDIDATES WITH WEIGHTED FORM + FIXTURE SCORE ----
    let candidates = await Promise.all(
      samePosPlayers.map(async (p) => {
        const weightedForm = await getWeightedLast3Score(p.id, currentGw);
        return {
          ...p,
          weightedForm,
          fixtureScore: calcFixtureScore(p.id),
        };
      })
    );

    // Require strictly better weighted form than the outgoing player
    candidates = candidates.filter(
      (c) => c.weightedForm > outWeightedForm
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
            "✅ No stronger weighted-form upgrade found. Your squad looks solid — consider saving your transfer!",
        },
      });
    }

    // Sort: best weighted-form first, tie-breaker by easier fixtures
    candidates.sort((a, b) => {
      if (b.weightedForm !== a.weightedForm) {
        return b.weightedForm - a.weightedForm;
      }
      return a.fixtureScore - b.fixtureScore; // lower fixture difficulty is better
    });

    const bestIn = candidates[0];

    return res.status(200).json({
      suggestion: {
        out: outPlayer.web_name,
        out_cost: outCost.toFixed(1),
        in: bestIn.web_name,
        in_cost: (bestIn.now_cost / 10).toFixed(1),
        // Send back the weighted score as "form" for the UI
        form: bestIn.weightedForm.toFixed(1),
        position: positions[outPlayer.element_type],
        fixtures: bestIn.fixtureScore,
        message: usedFreeHitLastRound
          ? `Based on your non-Free Hit team from GW${baseGw}, with 3-match weighted form.`
          : null,
        baseGw,
      },
    });
  } catch (err) {
    console.error("❌ /api/suggest failed:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
