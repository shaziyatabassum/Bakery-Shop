const express = require('express');
const { getProductReviews, createReview } = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

module.exports = router;
