const passport = require('passport');
const DiscordStrategy = require('passport-discord');

const initDiscordStrategy = () => {
  passport.use('discord', new DiscordStrategy.Strategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'guilds.members.read'],
  }, async (accessToken, _refreshToken, profile, done) => {
    try {
      const res = await fetch(
        `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!res.ok) {
        console.warn(`Accesso negato: ${profile.username} non è nel server.`);
        return done(null, false);
      }

      return done(null, {
        discord_id: profile.id,
        username: profile.username,
        avatar: profile.avatar ?? null,
      });
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

module.exports = { initDiscordStrategy };