const express = require('express');
const { createVoucher, getActiveVouchers, getExpiredVouchers, validateVoucher, applyVoucher } = require('../controllers/voucherController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All voucher routes are protected
router.use(protect);

router.post('/', createVoucher);           // Create a new voucher
router.get('/active', getActiveVouchers);  // Get active vouchers
router.get('/expired', getExpiredVouchers); // Get expired vouchers
router.post('/validate', validateVoucher); // Validate a voucher
router.post('/apply', applyVoucher);       // Apply a voucher

module.exports = router; 