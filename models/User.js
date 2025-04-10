const mongoose = require('mongoose');
const { encrypt } = require('../middleware/security');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true },
  encryptedKey: { type: String, required: true },
  starknetAddress: { type: String, required: true },
  bankAccount: {
    number: String,
    code: String
  },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
  if (this.isModified('encryptedKey')) {
    this.encryptedKey = encrypt(this.encryptedKey);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);