const members = require('../config/members');

const getAccount = async ({ gameName, tagLine }) => {
  const res = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } }
  );
  if (!res.ok) throw new Error(`Account non trovato: ${gameName}#${tagLine}`);
  return res.json();
};

const getSummoner = async (puuid) => {
  const res = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } }
  );
  if (!res.ok) throw new Error(`Summoner non trovato`);
  return res.json();
};

const getRank = async (puuid) => {
  const res = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } }
  );
  console.log('getRank status:', res.status);
  if (!res.ok) throw new Error(`Rank non trovato`);
  const entries = await res.json();
  return entries.find(e => e.queueType === 'RANKED_SOLO_5x5') ?? null;
};


const getRecentMatches = async (puuid, count = 10) => {
  const res = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } }
  );
  if (!res.ok) throw new Error(`Partite non trovate`);
  const matchIds = await res.json();

  const matches = await Promise.all(
    matchIds.map(id =>
      fetch(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } }
      ).then(r => r.json())
    )
  );
  return matches;
};

const index = async (req, res) => {
  try {
    const results = [];

    for (const [discordId, user] of Object.entries(members)) {
      try {
        console.log(`Processing: ${user.gameName}#${user.tagLine}`);

        const account = await getAccount(user);
        const summoner = await getSummoner(account.puuid);
        const rank = await getRank(account.puuid);

        results.push({
          discordId,
          account,
          summoner,
          rank: rank ?? { tier: "UNRANKED" },
        });

      } catch (err) {
        console.error(`❌ FALLITO: ${user.gameName}#${user.tagLine}`);
        console.error(err.message);
      }
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const show = async (req, res) => {
  try {
    const { discordId } = req.params;

    const user = members[discordId];

    if (!user) {
      return res.status(404).json({ message: "User non trovato" });
    }

    const account = await getAccount(user);
    const summoner = await getSummoner(account.puuid);
    const rank = await getRank(account.puuid);
    const matches = await getRecentMatches(account.puuid, 5);

    return res.json({
      discordId,
      account,
      summoner,
      rank: rank ?? { tier: "UNRANKED" },
      matches,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { index, show };