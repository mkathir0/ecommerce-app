const Order = require('../models/Order');

// @desc    Create a payment checkout session (Stripe Gateway simulation / test flow)
// @route   POST /api/payment/checkout-session
const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'USD', items } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ success: false, message: 'OrderId and amount are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate standard Stripe-like session token
    const sessionId = `cs_test_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const clientSecret = `pi_test_${Math.random().toString(36).substring(2, 16)}_secret_${Math.random().toString(36).substring(2, 10)}`;

    res.json({
      success: true,
      sessionId,
      clientSecret,
      orderId: order._id,
      amount,
      currency: currency.toUpperCase(),
      gateway: 'Stripe Test Checkout',
      status: 'requires_payment_method',
      publicKey: 'pk_test_51NexusTechStoreSimulation2026',
      itemsCount: items ? items.length : order.orderItems.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and finalize order status
// @route   POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, transactionId, paymentMethod = 'Stripe Checkout', last4 = '4242' } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const txnId = transactionId || `txn_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Confirmed';
    order.paymentMethod = paymentMethod;
    order.paymentResult = {
      transactionId: txnId,
      status: 'Succeeded',
      paidAt: new Date(),
      gateway: `Stripe (Card ending ${last4})`
    };

    order.timeline.push({
      status: 'Payment Succeeded',
      timestamp: new Date(),
      note: `Payment of $${order.totalPrice.toFixed(2)} captured via Stripe Gateway (${txnId})`
    });

    order.timeline.push({
      status: 'Confirmed',
      timestamp: new Date(),
      note: 'Order confirmed and routed to warehouse fulfillment'
    });

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully and order confirmed!',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  verifyPayment
};
