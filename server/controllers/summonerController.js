const members = require('../config/members');

const cache = new Map();

const getCached = async (key, fetcher, ttl = 60000) => {
  const existing = cache.get(key);

  if (existing && Date.now() - existing.timestamp < ttl) {
    return existing.data;
  }

  const fresh = await fetcher();

  cache.set(key, {
    data: fresh,
    timestamp: Date.now(),
  });

  return fresh;
};

const getAccount = async ({ gameName, tagLine }) => {
  const res = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`,
    {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
    }
  );

  if (!res.ok) {
    throw new Error(`Account non trovato: ${gameName}#${tagLine}`);
  }

  return res.json();
};

const getSummoner = async (puuid) => {
  const res = await fetch(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
    }
  );

  if (!res.ok) throw new Error('Summoner non trovato');

  return res.json();
};

const getRank = async (puuid) => {
  const res = await fetch(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`,
    {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
    }
  );

  if (!res.ok) throw new Error('Rank non trovato');

  const entries = await res.json();
  return entries.find(
    (entry) => entry.queueType === 'RANKED_SOLO_5x5'
  ) ?? null;
};

const getMatchIds = async (puuid) => {
  const res = await fetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`,
    {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY },
    }
  );

  if (!res.ok) throw new Error('Errore matchIds');

  return res.json();
};

const index = async (req, res) => {
  try {
    const results = await getCached(
      'summoners_index',
      async () => {
        const data = [];

        for (const [discordId, user] of Object.entries(members)) {
          try {

            const account = await getAccount(user);

            const [summoner, rank] = await Promise.all([
              getSummoner(account.puuid),
              getRank(account.puuid),
            ]);

            data.push({
              discordId,
              account,
              summoner,
              rank: rank ?? { tier: 'UNRANKED' },
              avatar: user?.avatar,
            });
          } catch (err) {
            console.error(err.message);
          }
        }

        return data;
      },
      60 * 1000
    );

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
      return res.status(404).json({
        message: 'User non trovato',
      });
    }

    const account = await getCached(
      `account-${user.gameName}-${user.tagLine}`,
      () => getAccount(user),
      1000 * 60 * 60
    );

    const [summoner, rank, matchIds] = await Promise.all([
      getCached(
        `summoner-${account.puuid}`,
        () => getSummoner(account.puuid),
        1000 * 60 * 30
      ),

      getCached(
        `rank-${account.puuid}`,
        () => getRank(account.puuid),
        1000 * 60 * 10
      ),

      getCached(
        `matches-${account.puuid}`,
        () => getMatchIds(account.puuid),
        1000 * 60 * 5
      ),
    ]);

    return res.json({
      discordId,
      account,
      summoner,
      rank: rank ?? { tier: 'UNRANKED' },
      matchIds,
      avatar: user?.avatar,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { index, show };