import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Package,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const API_ORDERS = 'http://localhost:5001/api/orders';
const API_PAYMENT = 'http://localhost:5001/api/payment';

export default function CheckoutModal({ isOpen, onClose, onOrderPlaced }) {
  const {
    cartItems,
    subtotal,
    discountAmount,
    taxPrice,
    shippingPrice,
    totalPrice,
    currency,
    clearCart,
    addToast
  } = useCart();

  const { user, token } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success Tracking
  const [loading, setLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Form State
  const [shippingForm, setShippingForm] = useState({
    recipientName: user ? user.name : 'Mithrajit Kathir',
    email: user ? user.email : 'mithrajit@example.com',
    phone: user ? user.phone || '+1 (555) 349-2810' : '+1 (555) 349-2810',
    street: user?.address?.street || '742 Cyberpunk Blvd, Suite 402',
    city: user?.address?.city || 'San Francisco',
    state: user?.address?.state || 'CA',
    postalCode: user?.address?.postalCode || '94107',
    country: user?.address?.country || 'USA',
  });

  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: user ? user.name : 'Mithrajit Kathir',
    expiry: '08/28',
    cvv: '888',
  });

  const [deliveryOption, setDeliveryOption] = useState({
    id: 'express',
    name: 'Express Drone Air Priority',
    estimatedDays: '1-2 Business Days',
    price: shippingPrice,
  });

  if (!isOpen) return null;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingForm.street || !shippingForm.city || !shippingForm.recipientName) {
      addToast('Please fill out all required shipping details', 'error');
      return;
    }
    setStep(2);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Format order items
      const formattedItems = cartItems.map((item) => {
        const discounted = item.product.discountPercentage
          ? item.product.price * (1 - item.product.discountPercentage / 100)
          : item.product.price;
        return {
          product: item.product._id,
          title: item.product.title,
          quantity: item.quantity,
          image: item.product.thumbnail,
          price: discounted,
        };
      });

      // 2. Create Order in Backend
      const orderPayload = {
        orderItems: formattedItems,
        shippingAddress: shippingForm,
        deliveryOption,
        paymentMethod: 'Stripe Test Checkout',
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        customerEmail: shippingForm.email,
        customerName: shippingForm.recipientName,
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const orderRes = await fetch(API_ORDERS, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.message || 'Failed to initialize order');
      }

      const { order } = await orderRes.json();

      // 3. Request Stripe Checkout Session simulation
      const sessionRes = await fetch(`${API_PAYMENT}/checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          amount: totalPrice,
          currency,
        }),
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to initialize payment gateway');
      }

      // Simulate a realistic gateway payment authorization delay (1.2 seconds)
      await new Promise((r) => setTimeout(r, 1200));

      // 4. Verify & Capture Payment
      const verifyRes = await fetch(`${API_PAYMENT}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          paymentMethod: 'Stripe Checkout',
          last4: '4242',
        }),
      });

      if (!verifyRes.ok) {
        throw new Error('Payment capture failed');
      }

      const verifyData = await verifyRes.json();
      setCreatedOrder(verifyData.order);
      clearCart();
      setStep(3); // Success Screen
      addToast('Payment approved! Order confirmed.', 'success');

      if (onOrderPlaced) onOrderPlaced(verifyData.order);
    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.message || 'Payment processing encountered an error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={16} />
        </button>

        {/* Progress Step Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 1 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 1 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                color: '#080a11',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              1
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Shipping</span>
          </div>

          <div style={{ width: '40px', height: '1px', background: step >= 2 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 2 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 2 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                color: '#080a11',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              2
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Payment</span>
          </div>

          <div style={{ width: '40px', height: '1px', background: step >= 3 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 3 ? '#34d399' : 'var(--text-muted)' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 3 ? '#34d399' : 'rgba(255,255,255,0.1)',
                color: '#080a11',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              3
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tracking</span>
          </div>
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form onSubmit={handleShippingSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>Shipping Destination</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Where should we deliver your high-performance hardware?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Recipient Full Name</label>
                <input
                  type="text"
                  required
                  className="tech-input"
                  style={{ width: '100%' }}
                  value={shippingForm.recipientName}
                  onChange={(e) => setShippingForm({ ...shippingForm, recipientName: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Email Address</label>
                <input
                  type="email"
                  required
                  className="tech-input"
                  style={{ width: '100%' }}
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Street Address</label>
              <input
                type="text"
                required
                className="tech-input"
                style={{ width: '100%' }}
                value={shippingForm.street}
                onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>City</label>
                <input
                  type="text"
                  required
                  className="tech-input"
                  style={{ width: '100%' }}
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>State</label>
                <input
                  type="text"
                  required
                  className="tech-input"
                  style={{ width: '100%' }}
                  value={shippingForm.state}
                  onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>ZIP Code</label>
                <input
                  type="text"
                  required
                  className="tech-input"
                  style={{ width: '100%' }}
                  value={shippingForm.postalCode}
                  onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                />
              </div>
            </div>

            {/* Delivery Option Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Shipping Speed</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Truck size={20} color="var(--accent-cyan)" />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{deliveryOption.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{deliveryOption.estimatedDays}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice, currency)}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '10px' }}
            >
              <span>Continue to Payment</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2: Stripe Payment Method */}
        {step === 2 && (
          <form onSubmit={handleProcessPayment}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Stripe Verified Payment</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Lock size={12} />
                  <span>256-bit SSL</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Total to charge: <strong style={{ color: 'var(--text-primary)' }}>{formatPrice(totalPrice, currency)}</strong>
              </p>
            </div>

            {/* Virtual Card Preview */}
            <div
              style={{
                borderRadius: '14px',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #161b2e 0%, #0d111d 100%)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                marginBottom: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                  NEXUS TITANIUM CARD
                </span>
                <CreditCard size={22} color="var(--accent-cyan)" />
              </div>

              <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', letterSpacing: '0.2em', marginBottom: '1rem', color: '#f8fafc' }}>
                {cardForm.cardNumber}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Cardholder</div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{cardForm.cardName}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Expires</div>
                  <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{cardForm.expiry}</div>
                </div>
              </div>
            </div>

            {/* Card Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Test Card Number</label>
                <input
                  type="text"
                  className="tech-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>MM/YY</label>
                <input
                  type="text"
                  className="tech-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>CVV</label>
                <input
                  type="password"
                  maxLength={4}
                  className="tech-input"
                  style={{ width: '100%', fontSize: '0.85rem' }}
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
                style={{ padding: '0.85rem 1.25rem' }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                {loading ? (
                  <span>Processing Payment via Stripe...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Authorize & Pay {formatPrice(totalPrice, currency)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Confirmation & Live Tracking Timeline */}
        {step === 3 && createdOrder && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 size={36} color="#34d399" />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Order Confirmed & Paid!
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Thank you, <strong>{createdOrder.customerName}</strong>! Confirmation sent to {createdOrder.customerEmail}
            </p>

            {/* Tracking summary pill */}
            <div
              style={{
                backgroundColor: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tracking Number</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                  {createdOrder.trackingNumber}
                </div>
              </div>
              <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Captured</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                  {formatPrice(createdOrder.totalPrice, currency)}
                </div>
              </div>
            </div>

            {/* Live Order Timeline Tracker */}
            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                Fulfillment Timeline
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(0, 242, 254, 0.3)' }}>
                {createdOrder.timeline && createdOrder.timeline.map((stepItem, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-23px',
                        top: '2px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-cyan)',
                        boxShadow: '0 0 8px var(--accent-cyan)',
                      }}
                    />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      {stepItem.status}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {stepItem.note}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      {new Date(stepItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', borderRadius: '10px' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
