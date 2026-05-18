const express = require("express");

const summonerController = require('../controllers/summonerController');

const router = express.Router();

router.get('/', summonerController.index);
router.get('/:discordId', summonerController.show);

module.exports = router;