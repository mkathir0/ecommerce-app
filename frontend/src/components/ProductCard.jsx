import React from 'react';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, currency } = useCart();

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const topSpec = product.specs && product.specs.length > 0 ? product.specs[0] : null;

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Badges Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {product.discountPercentage > 0 ? (
          <span className="badge-discount">-{product.discountPercentage}% OFF</span>
        ) : (
          <span />
        )}

        {product.stock <= 5 ? (
          <span className="badge-stock low-stock">Only {product.stock} left</span>
        ) : (
          <span className="badge-stock in-stock">In Stock</span>
        )}
      </div>

      {/* Image Container with hover zoom */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '68%',
          overflow: 'hidden',
          backgroundColor: 'rgba(5, 7, 12, 0.6)',
          cursor: 'pointer',
        }}
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image || product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Quick View Button Hover Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(10, 13, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
          title="Quick View Specs"
        >
          <Eye size={16} />
        </button>
      </div>

      {/* Details Body */}
      <div
        style={{
          padding: '1.2rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Brand & Category */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span>{product.brand}</span>
          <span style={{ color: 'var(--accent-cyan)' }}>{product.category}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            cursor: 'pointer',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em',
          }}
        >
          {product.title}
        </h3>

        {/* Top spec snippet pill */}
        {topSpec && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem',
              marginBottom: '0.75rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <strong>{topSpec.label}:</strong> {topSpec.value}
          </div>
        )}

        {/* Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : 'none'}
                color={i < Math.floor(product.rating || 4.5) ? '#f59e0b' : '#475569'}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {(product.rating || 4.5).toFixed(1)}
          </span>
        </div>

        {/* Price & Action Button Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {formatPrice(discountedPrice, currency)}
            </div>
            {product.discountPercentage > 0 && (
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.price, currency)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn-primary"
            style={{
              padding: '0.55rem 0.95rem',
              fontSize: '0.82rem',
              borderRadius: '8px',
            }}
          >
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
