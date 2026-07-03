const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All order routes need login

router.route('/')
  .post(createOrder)
  .get(authorize('admin'), getOrders);

router.get('/myorders', getMyOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
