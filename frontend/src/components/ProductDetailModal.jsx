import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, Shield, RotateCcw, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export default function ProductDetailModal({ product, onClose, onBuyNow }) {
  const { addToCart, currency } = useCart();
  const [selectedImg, setSelectedImg] = useState(
    product ? (product.images && product.images[0]) || product.thumbnail : ''
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail];

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const handleBuy = () => {
    addToCart(product, quantity);
    onClose();
    if (onBuyNow) onBuyNow();
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
        WebkitBackdropFilter: 'blur(16px)',
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
          maxWidth: '920px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          border: '1px solid var(--border-glow)',
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
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Gallery */}
          <div>
            <div
              style={{
                width: '100%',
                paddingTop: '80%',
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
              }}
            >
              <img
                src={selectedImg || product.thumbnail}
                alt={product.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImg === img ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      background: 'rgba(0,0,0,0.5)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info, Specs, Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Category & Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge-tech">{product.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {product.brand}
              </span>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {product.title}
            </h2>

            {/* Rating & Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {(product.rating || 4.5).toFixed(1)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(Customer Verified)</span>
              </div>

              {product.stock > 0 ? (
                <span className="badge-stock in-stock">
                  <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {product.stock} Units in Warehouse
                </span>
              ) : (
                <span className="badge-stock low-stock">Backorder Available</span>
              )}
            </div>

            {/* Price Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-primary)',
                }}
              >
                {formatPrice(discountedPrice, currency)}
              </div>
              {product.discountPercentage > 0 && (
                <>
                  <div
                    style={{
                      fontSize: '1rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'line-through',
                    }}
                  >
                    {formatPrice(product.price, currency)}
                  </div>
                  <span className="badge-discount">Save {product.discountPercentage}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              {product.description}
            </p>

            {/* Hardware Specifications Table */}
            {product.specs && product.specs.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  Hardware Specifications
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        backgroundColor: i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                        borderBottom: i < product.specs.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                      }}
                    >
                      <span style={{ width: '130px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {spec.label}
                      </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, flex: 1 }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    padding: '0.6rem 0.9rem',
                    background: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 0.5rem', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    padding: '0.6rem 0.9rem',
                    background: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.75rem 1rem' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuy}
                className="btn-primary"
                style={{ flex: 1.2, padding: '0.75rem 1rem' }}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Trust footer bullets */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={14} color="var(--accent-cyan)" />
                <span>Dispatches in 24 Hours</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={14} color="#34d399" />
                <span>2-Year Warranty Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
