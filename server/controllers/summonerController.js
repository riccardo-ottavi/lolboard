const { members } = require("../config/members");

async function index(req, res) {
  try {
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero dei summoner' });
  }
}

module.exports =  { index }