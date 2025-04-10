const mongoose = require('mongoose');
const { encrypt } = require('../middleware/security');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountToken: { type: String, required: true },
  metadata: {
    bankName: String,
    last4Digits: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending'
  }
});

accountSchema.pre('save', function(next) {
  if (this.isModified('accountToken')) {
    this.accountToken = encrypt(this.accountToken);
  }
  next();
});

module.exports = mongoose.model('Account', accountSchema);