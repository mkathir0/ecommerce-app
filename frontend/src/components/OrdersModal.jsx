import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle, Truck, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const API_MY_ORDERS = 'http://localhost:5001/api/orders/myorders';

export default function OrdersModal({ isOpen, onClose, onOpenAuth }) {
  const { user, token } = useAuth();
  const { currency } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchOrders();
    }
  }, [isOpen, token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_MY_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>My Orders & Tracking</h2>
          </div>

          <button
            onClick={onClose}
            style={{
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
            }}
          >
            <X size={16} />
          </button>
        </div>

        {!user ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Please sign in to track and view your full order history.
            </p>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="btn-primary"
            >
              Sign In to View Orders
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Package size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              No orders placed yet
            </p>
            <p style={{ fontSize: '0.85rem' }}>Your active hardware shipments will appear here once confirmed.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                }}
              >
                {/* Order Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tracking ID: </span>
                    <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                      {order.trackingNumber}
                    </strong>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor:
                          order.status === 'Confirmed'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(0, 242, 254, 0.15)',
                        color: order.status === 'Confirmed' ? '#34d399' : 'var(--accent-cyan)',
                        border: `1px solid ${order.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 242, 254, 0.3)'}`,
                      }}
                    >
                      {order.status}
                    </span>

                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {formatPrice(order.totalPrice, currency)}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80';
                        }}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Timeline */}
                {order.timeline && order.timeline.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Status History
                    </div>
                    {order.timeline.map((step, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', display: 'flex', gap: '0.5rem', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>• {step.status}:</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{step.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
