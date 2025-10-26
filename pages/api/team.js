import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { managerId } = req.query;
    if (!managerId) return res.status(400).json({ error: 'Missing managerId' });

    const bootstrap = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/').then(r => r.json());
    const currentEvent = bootstrap.events.find(e => e.is_current);
    const currentGw = currentEvent ? currentEvent.id : bootstrap.events.find(e => e.is_next)?.id;
    const players = bootstrap.elements;

    const teamData = await fetch(`https://fantasy.premierleague.com/api/entry/${managerId}/event/${currentGw}/picks/`).then(r => r.json());

    const picks = teamData.picks || [];
    const fullTeam = picks.map((p) => {
      const player = players.find(pl => pl.id === p.element);
      return {
        id: player.id,
        name: player.web_name,
        position: ['GK', 'DEF', 'MID', 'FWD'][player.element_type - 1],
        form: player.form,
      };
    });

    res.status(200).json({ players: fullTeam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
