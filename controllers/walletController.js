const User = require('../models/User');
const { encrypt } = require('../middleware/security');

exports.linkWallet = async (req, res) => {
  const { phoneNumber, privateKey, starknetAddress } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { encryptedKey: encrypt(privateKey), starknetAddress },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Wallet linked successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};