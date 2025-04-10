const User = require('../models/User');
const { swapTokens, bridgeToEthereum } = require('../services/blockchain/starknet');
const WyreService = require('../services/offramp/wyre');
const wyre = new WyreService();

exports.initiateWithdrawal = async (req, res) => {
  const { userId, amount, accountId } = req.body;

  try {
    const user = await User.findById(userId).populate('withdrawalAccounts');
    const account = user.withdrawalAccounts.id(accountId);

    // Validate account
    const isValid = await wyre.validateAccount({
      accountToken: account.accountToken
    });

    if (!isValid) throw new Error('Invalid account details');

    // Execute withdrawal flow
    const swapTx = await swapTokens(user.encryptedKey, 'ETH', 'USDC', amount);
    const bridgeTx = await bridgeToEthereum(swapTx.hash);
    const fiatTx = await wyre.createTransfer(amount, account);

    res.status(200).json({
      swapTx: swapTx.hash,
      bridgeTx: bridgeTx.hash,
      fiatTx: fiatTx.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};