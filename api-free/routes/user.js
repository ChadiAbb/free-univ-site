const express = require('express');
const router = express.Router();
const middleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.put('/preferences', middleware, userController.updatePreferences);
router.get('/preferences', middleware, userController.getPreferences);

module.exports = router;