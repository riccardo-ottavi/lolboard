const express = require("express");
const router = express.Router();

const matchesController = require("../controllers/matchesController");

router.get("/:matchId", matchesController.show);

module.exports = router;