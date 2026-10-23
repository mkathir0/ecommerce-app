const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      customerEmail,
      customerName,
      deliveryOption
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Shipping address is incomplete' });
    }

    const order = new Order({
      user: req.user ? req.user._id : null,
      customerEmail: customerEmail || (req.user ? req.user.email : 'guest@example.com'),
      customerName: customerName || (req.user ? req.user.name : shippingAddress.recipientName || 'Customer'),
      orderItems,
      shippingAddress: {
        recipientName: shippingAddress.recipientName || (req.user ? req.user.name : 'Customer'),
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || 'CA',
        postalCode: shippingAddress.postalCode || '94103',
        country: shippingAddress.country || 'USA',
        phone: shippingAddress.phone || (req.user ? req.user.phone : '+1 (555) 0100') || '+1 (555) 0100',
      },
      deliveryOption: deliveryOption || { name: 'Express Tech Delivery', estimatedDays: '2-3 Business Days', price: shippingPrice || 0 },
      paymentMethod: paymentMethod || 'Online Checkout',
      itemsPrice,
      taxPrice: taxPrice || 0,
      shippingPrice: shippingPrice || 0,
      discountAmount: discountAmount || 0,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      status: 'Confirmed',
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: 'Your order was received and payment confirmed.',
        },
      ],
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { customerEmail: req.user.email }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'title thumbnail category');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status / advance lifecycle
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validStatuses = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (status) {
      order.status = status;
      order.timeline.push({
        status,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}`
      });
    }

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};
