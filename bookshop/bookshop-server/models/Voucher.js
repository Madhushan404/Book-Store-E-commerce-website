const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  voucherCode: {
    type: String,
    required: true,
    unique: true
  },
  voucherPrice: {
    type: Number,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isExpired: {
    type: Boolean,
    default: false
  }
});

// Create an index to find expired vouchers
voucherSchema.index({ expiryDate: 1 });

// Helper method to check if voucher is expired
voucherSchema.methods.checkIfExpired = function() {
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.isExpired = true;
    return true;
  }
  return false;
};

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher; 