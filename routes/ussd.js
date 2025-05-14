// routes/ussd.js
const express = require('express');
const router = express.Router();
const { processUSSD } = require('../controllers/ussdController');

router.post('/', processUSSD);

module.exports = router;