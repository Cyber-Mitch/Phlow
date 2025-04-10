const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const { linkWallet } = require('../controllers/walletController');
const { initiateWithdrawal } = require('../controllers/withdrawalController');
const { addAccount } = require('../controllers/accountController');

router.post('/wallet/link', apiLimiter, linkWallet);
router.post('/withdraw', apiLimiter, initiateWithdrawal);
router.post('/account/add', apiLimiter, addAccount);

module.exports = router;