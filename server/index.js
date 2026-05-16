require('dotenv').config();
const express = require('express');
const session = require('express-session');
const summonerRouter = require('./routers/summonerRouter');
const passport = require('passport');
const authRouter = require('./routers/authRouter');
const { initDiscordStrategy } = require('./auth/discordStrategy');
const { requireAuth } = require('./middlewares/requireAuth');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

initDiscordStrategy();

app.use('/auth', authRouter);
app.use('/summoners', summonerRouter)

app.get('/dashboard', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));