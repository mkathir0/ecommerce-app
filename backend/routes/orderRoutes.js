const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
