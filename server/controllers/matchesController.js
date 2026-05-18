const getMatch = async (matchId) => {
  const res = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Match non trovato: ${matchId}`);
  }

  return res.json();
};

const show = async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await getMatch(matchId);

    const info = match.info;

    const cleaned = {
      matchId,
      gameMode: info.gameMode,
      gameDuration: info.gameDuration,
      participants: info.participants.map((p) => ({
        puuid: p.puuid,
        champion: p.championName,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        win: p.win,
        team: p.teamId,
      })),
    };

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  show,
};