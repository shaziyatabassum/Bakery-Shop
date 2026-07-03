const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All cart routes need login

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.put('/item', updateCartItem);
router.delete('/item/:productId', removeFromCart);

module.exports = router;
