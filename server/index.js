require('dotenv').config();

const express = require('express');
const cors = require("cors");
const passport = require('passport');

const summonerRouter = require('./routers/summonerRouter');
const matchesRouter = require("./routers/matchesRouter");
const authRouter = require('./routers/authRouter');

const { initDiscordStrategy } = require('./auth/discordStrategy');
const { requireAuth } = require('./middlewares/requireAuth');

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://lolboard.vercel.app"
  ],
  credentials: true
}));

app.use(passport.initialize());

initDiscordStrategy();

app.use('/auth', authRouter);
app.use('/summoners', requireAuth, summonerRouter);
app.use("/matches", requireAuth, matchesRouter);

app.get("/", (req, res) => {
  res.send("<h1>Lolboard Homepage</h1>");
});

app.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

app.listen(3000, () => console.log('Server running on port 3000'));