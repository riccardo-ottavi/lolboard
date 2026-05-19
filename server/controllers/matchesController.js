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
        summonerName: p.riotIdGameName || p.summonerName,

        champion: p.championName,
        level: p.champLevel,

        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,

        goldEarned: p.goldEarned,

        win: p.win,
        team: p.teamId,
        role: p.teamPosition,

        items: [
          p.item0,
          p.item1,
          p.item2,
          p.item3,
          p.item4,
          p.item5,
          p.item6,
        ],
      })),
    };

    res.json(cleaned);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  show,
};
