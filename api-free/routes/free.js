const express = require('express');
const router = express.Router();
const freeController = require("../controllers/freeController");

router.get('/', freeController.getFree);

module.exports = router;