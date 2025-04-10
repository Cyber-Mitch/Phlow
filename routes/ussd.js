const express = require('express');
const router = express.Router();
const { ussdLimiter } = require('../middleware/rateLimiter');
const { processUSSD } = require('../controllers/ussdController');

router.post('/', ussdLimiter, processUSSD);

module.exports = router;