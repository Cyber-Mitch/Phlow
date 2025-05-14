// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  encryptedKey: { type: String, required: true },
  starknetAddress: { type: String, required: true },
  ethereumAddress: { type: String }, // Add this
  bankAccount: {
    number: String,
    code: String
  },
  isNewWallet: { type: Boolean, default: false }, // Temporary flag
  createdAt: { type: Date, default: Date.now }
});