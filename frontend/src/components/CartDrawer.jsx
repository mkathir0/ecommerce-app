import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    currency,
    subtotal,
    discountAmount,
    discountRate,
    taxPrice,
    shippingPrice,
    totalPrice,
    isFreeShipping,
    amountToFreeShipping,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    promoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApply = (e) => {
    e.preventDefault();
    if (inputCode) {
      applyPromoCode(inputCode);
      setInputCode('');
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
        backgroundColor: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-subtle)',
          backgroundColor: '#0c0f1d',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={20} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Your Cart</h2>
            <span
              style={{
                background: 'rgba(0, 242, 254, 0.15)',
                color: 'var(--accent-cyan)',
                borderRadius: '9999px',
                padding: '0.1rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {cartItems.length} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            {isFreeShipping ? (
              <span style={{ color: '#34d399', fontWeight: 600 }}>🎉 You qualified for Free Express Shipping!</span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>
                Add <strong style={{ color: 'var(--accent-cyan)' }}>{formatPrice(amountToFreeShipping, currency)}</strong> more for Free Shipping
              </span>
            )}
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{Math.round(freeShippingProgress)}%</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'var(--gradient-brand)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-muted)',
                gap: '1rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart size={28} color="var(--text-muted)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Your cart is currently empty
                </p>
                <p style={{ fontSize: '0.85rem' }}>Discover top-tier hardware and add gear to begin.</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-outline-glow"
                style={{ fontSize: '0.85rem' }}
              >
                Explore Gear
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const discounted = item.product.discountPercentage
                ? item.product.price * (1 - item.product.discountPercentage / 100)
                : item.product.price;

              return (
                <div
                  key={item.product._id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#000',
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginRight: '8px',
                        }}
                      >
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.06)',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            background: 'none',
                            color: '#fff',
                            fontSize: '0.85rem',
                          }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            background: 'none',
                            color: '#fff',
                            fontSize: '0.85rem',
                          }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {formatPrice(discounted * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promo Code & Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(10, 13, 23, 0.95)',
            }}
          >
            {/* Promo Code Box */}
            <form onSubmit={handleApply} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Promo Code (TECH20)"
                  className="tech-input"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{ width: '100%', paddingLeft: '32px', height: '36px', fontSize: '0.82rem' }}
                />
              </div>
              <button
                type="submit"
                className="btn-secondary"
                style={{ height: '36px', padding: '0 0.85rem', fontSize: '0.82rem' }}
              >
                Apply
              </button>
            </form>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Discount ({promoCode})</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: '#34d399' }}>FREE</strong> : formatPrice(shippingPrice, currency)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(taxPrice, currency)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.6rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total</span>
                <span className="gradient-text">{formatPrice(totalPrice, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '10px',
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} color="#34d399" />
              <span>256-bit Encrypted Checkout • Stripe Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
