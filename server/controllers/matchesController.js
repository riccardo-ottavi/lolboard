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
      matchId: match.metadata.matchId,

      gameDuration: info.gameDuration,
      gameMode: info.gameMode,

      game: {
        mode: info.gameMode,
        type: info.gameType,
        queueId: info.queueId,
        duration: info.gameDuration,
        version: info.gameVersion,
        mapId: info.mapId,
        creation: info.gameCreation,
        start: info.gameStartTimestamp,
        end: info.gameEndTimestamp,
      },

      info: info,

      teams: info.teams.map((team) => ({
        teamId: team.teamId,
        win: team.win,
        objectives: {
          baron: team.objectives.baron.kills,
          dragon: team.objectives.dragon.kills,
          tower: team.objectives.tower.kills,
          inhibitor: team.objectives.inhibitor.kills,
          riftHerald: team.objectives.riftHerald.kills,
        },
        bans: team.bans.map((b) => b.championId),
      })),

      participants: info.participants.map((p) => ({
        puuid: p.puuid,

        summonerName: p.riotIdGameName || p.summonerName,
        tagLine: p.riotIdTagline || "",

        champion: p.championName,
        level: p.champLevel,

        role: p.teamPosition,
        team: p.teamId,
        win: p.win,

        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,

        goldEarned: p.goldEarned,

        // extra già usati in UI future-safe
        kda:
          p.deaths === 0
            ? "Perfect"
            : ((p.kills + p.assists) / p.deaths).toFixed(2),

        cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
        vision: p.visionScore,
        damage: p.totalDamageDealtToChampions,

        items: [
          p.item0,
          p.item1,
          p.item2,
          p.item3,
          p.item4,
          p.item5,
          p.item6,
        ],

        spells: [p.summoner1Id, p.summoner2Id],
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
