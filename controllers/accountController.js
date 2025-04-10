const User = require('../models/User');
const Account = require('../models/Account');
const { encrypt } = require('../middleware/security');

exports.addAccount = async (req, res) => {
  const { userId, accountNumber, bankCode } = req.body;

  try {
    const account = new Account({
      user: userId,
      accountToken: encrypt(accountNumber),
      metadata: {
        bankCode
      }
    });

    await account.save();

    // Link account to user
    await User.findByIdAndUpdate(userId, {
      $push: { withdrawalAccounts: account._id }
    });

    res.status(201).json({ message: 'Account added successfully', account });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};