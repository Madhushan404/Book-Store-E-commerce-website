const Voucher = require('../models/Voucher');
const crypto = require('crypto');

// Generate random voucher code
const generateVoucherCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// @desc    Create a new voucher
// @route   POST /api/vouchers
// @access  Private
exports.createVoucher = async (req, res) => {
  try {
    const { voucherPrice } = req.body;
    const user = req.user;

    // Generate a unique voucher code
    let voucherCode;
    let isUnique = false;
    
    while (!isUnique) {
      voucherCode = generateVoucherCode();
      const existingVoucher = await Voucher.findOne({ voucherCode });
      if (!existingVoucher) {
        isUnique = true;
      }
    }

    // Set expiry date as 1 year from now if needed
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create new voucher
    const voucher = await Voucher.create({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNumber: user.contactNumber,
      address: user.address,
      voucherCode,
      voucherPrice,
      expiryDate
    });

    res.status(201).json({
      success: true,
      data: voucher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user's active vouchers
// @route   GET /api/vouchers/active
// @access  Private
exports.getActiveVouchers = async (req, res) => {
  try {
    // Find vouchers that are not expired
    const vouchers = await Voucher.find({ 
      userId: req.user.userId,
      isExpired: false,
      expiryDate: { $gt: new Date() }
    });

    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user's expired vouchers
// @route   GET /api/vouchers/expired
// @access  Private
exports.getExpiredVouchers = async (req, res) => {
  try {
    // Find vouchers that are expired or past expiry date
    const vouchers = await Voucher.find({
      userId: req.user.userId,
      $or: [
        { isExpired: true },
        { expiryDate: { $lte: new Date() } }
      ]
    });

    // Update any vouchers that are past expiry date but not marked as expired
    for (const voucher of vouchers) {
      if (!voucher.isExpired && voucher.expiryDate <= new Date()) {
        voucher.isExpired = true;
        await voucher.save();
      }
    }

    res.status(200).json({
      success: true,
      count: vouchers.length,
      data: vouchers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Validate a voucher code
// @route   POST /api/vouchers/validate
// @access  Private
exports.validateVoucher = async (req, res) => {
  try {
    const { voucherCode } = req.body;

    // Find the voucher
    const voucher = await Voucher.findOne({ voucherCode });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    // Check if voucher is expired
    if (voucher.isExpired || voucher.expiryDate <= new Date()) {
      // Update expiration status if needed
      if (!voucher.isExpired) {
        voucher.isExpired = true;
        await voucher.save();
      }
      
      return res.status(400).json({
        success: false,
        message: 'Voucher has expired'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        voucherCode: voucher.voucherCode,
        voucherPrice: voucher.voucherPrice,
        expiryDate: voucher.expiryDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Apply a voucher (mark as used)
// @route   POST /api/vouchers/apply
// @access  Private
exports.applyVoucher = async (req, res) => {
  try {
    const { voucherCode } = req.body;

    // Find the voucher
    const voucher = await Voucher.findOne({ voucherCode });

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    // Check if voucher is expired
    if (voucher.isExpired || voucher.expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Voucher has expired'
      });
    }

    // Mark voucher as used (expired)
    voucher.isExpired = true;
    await voucher.save();

    res.status(200).json({
      success: true,
      message: 'Voucher applied successfully',
      data: {
        voucherCode: voucher.voucherCode,
        voucherPrice: voucher.voucherPrice
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 