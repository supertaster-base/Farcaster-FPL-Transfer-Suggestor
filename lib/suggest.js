// lib/suggest.js (CommonJS)
function suggestTransferForTeam(team, bootstrap) {
  const players = bootstrap.elements || [];
  const picks = team.picks || [];

  const lookup = new Map(players.map(p => [p.id, p]));

  const teamPlayersByPosition = {};
  picks.forEach(pick => {
    const player = lookup.get(pick.element);
    if (!player) return;
    const pos = player.element_type;
    if (!teamPlayersByPosition[pos]) teamPlayersByPosition[pos] = [];
    teamPlayersByPosition[pos].push({
      id: player.id,
      web_name: player.web_name,
      now_cost: (player.now_cost || 0) / 10,
      minutes: player.minutes || 0,
      form: player.form || '0.0'
    });
  });

  const positions = Object.keys(teamPlayersByPosition);
  if (!positions.length) throw new Error('No valid players found in team (is the team public?)');

  const pos = positions[Math.floor(Math.random() * positions.length)];
  const outCandidates = teamPlayersByPosition[pos];
  outCandidates.sort((a,b) => parseFloat(a.form) - parseFloat(b.form) || a.minutes - b.minutes);
  const out = outCandidates[0];

  const inCandidates = players.filter(p => {
    if (p.element_type !== parseInt(pos)) return false;
    return !picks.find(t => t.element === p.id);
  });

  if (!inCandidates.length) {
    return { out: out.web_name, in: null, position: pos };
  }

  function score(p) {
    return parseFloat(p.form || 0) + ((p.minutes || 0) / 1000);
  }
  inCandidates.sort((a,b) => score(b) - score(a));
  const bestIn = inCandidates[0];

  return {
    out: out.web_name,
    out_cost: out.now_cost,
    in: bestIn.web_name,
    in_cost: (bestIn.now_cost || 0) / 10,
    position: pos,
    form: bestIn.form
  };
}

module.exports = { suggestTransferForTeam };
