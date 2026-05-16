const { members } = require("../users");

async function index(req, res) {
  try {
    res.json(members[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel recupero dei summoner' });
  }
}

module.exports =  { index }