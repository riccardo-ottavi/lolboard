const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/auth/denied',
  }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

router.get('/denied', (req, res) => {
  res.status(403).json({ message: 'Non sei nel server Discord.' });
});

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

module.exports = router;