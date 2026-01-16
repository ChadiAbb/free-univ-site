const express = require('express');
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const calendarController = require("../controllers/calendarController");

router.get('/calendar', middleware, calendarController.getCalendar);

module.exports = router;