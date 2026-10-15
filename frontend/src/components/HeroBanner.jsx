import React from 'react';
import { Sparkles, ShieldCheck, Truck, Zap, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HeroBanner({ onExplore }) {
  const { applyPromoCode } = useCart();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '3.5rem 1.5rem 2.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 242, 254, 0.15) 0%, transparent 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Glow badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '9999px',
            padding: '0.35rem 1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)',
          }}
        >
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
            }}
          >
            2026 Flagship Hardware Release
          </span>
        </div>

        {/* Main Heading */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            marginBottom: '1.2rem',
            maxWidth: '900px',
            marginInline: 'auto',
          }}
        >
          Engineered for <span className="gradient-text">Pure Performance</span> & Spatial Reality.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}
        >
          High-end workstations, quantum-dot OLED displays, planar magnetic audio, and next-gen gaming gear. Direct from factory authorized distributors.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={onExplore}
            className="btn-primary"
            style={{
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              borderRadius: '9999px',
            }}
          >
            <Zap size={18} />
            <span>Explore Hardware</span>
          </button>

          <button
            onClick={() => applyPromoCode('TECH20')}
            className="btn-secondary"
            style={{
              padding: '0.85rem 1.6rem',
              fontSize: '0.95rem',
              borderRadius: '9999px',
              borderColor: 'rgba(142, 45, 226, 0.4)',
              background: 'rgba(142, 45, 226, 0.12)',
            }}
          >
            <Tag size={16} color="#c084fc" />
            <span>Use Code: <strong>TECH20</strong> (20% Off)</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Truck size={20} color="var(--accent-cyan)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Free Express Delivery</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders over $150</div>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <ShieldCheck size={20} color="#34d399" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>2-Year Tech Warranty</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Genuine Hardware</div>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Zap size={20} color="#fbbf24" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stripe Verified Checkout</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant automated dispatch</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
