const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Allows guest checkout with email
    },
    customerEmail: {
      type: String,
      required: false,
      default: 'customer@meshop.com',
    },
    customerName: {
      type: String,
      required: false,
      default: 'Customer',
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      recipientName: { type: String, default: 'Customer' },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'USA' },
      phone: { type: String, default: '+1 555-0100' },
    },
    deliveryOption: {
      name: { type: String, default: 'Express Tech Delivery' },
      estimatedDays: { type: String, default: '2-3 Business Days' },
      price: { type: Number, default: 0 },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Stripe Checkout',
    },
    paymentResult: {
      transactionId: { type: String },
      status: { type: String, default: 'Pending' },
      paidAt: { type: Date },
      gateway: { type: String, default: 'Stripe' },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountAmount: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    trackingNumber: {
      type: String,
      default: () => 'NEX-' + Math.floor(100000 + Math.random() * 900000),
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
