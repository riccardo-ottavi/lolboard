const { Router } = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/auth/denied',
  }),
  (req, res) => {

    const token = jwt.sign(
      {
        discord_id: req.user.discord_id,
        username: req.user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `${process.env.CLIENT_URL}/auth?token=${token}`
    );
  }
);

router.get('/denied', (req, res) => {
  res.status(403).json({ message: 'Non sei nel server Discord.' });
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;