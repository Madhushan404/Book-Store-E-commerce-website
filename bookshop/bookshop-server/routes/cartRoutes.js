const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)       // Get user's cart
  .post(addToCart)    // Add item to cart
  .delete(clearCart); // Clear user's cart

router.route('/:bookName')
  .put(updateCartItem)    // Update cart item quantity
  .delete(removeFromCart); // Remove item from cart

module.exports = router; 