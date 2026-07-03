const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlist');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All wishlist routes need login

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.delete('/:productId', removeFromWishlist);

module.exports = router;
