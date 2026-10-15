import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function CategoryFilterBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  inStockOnly,
  onToggleInStock,
  totalProducts
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: '2rem 0 1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '4px',
            maxWidth: '100%',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected
                    ? '1px solid var(--accent-cyan)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isSelected
                    ? 'rgba(0, 242, 254, 0.15)'
                    : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 242, 254, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Controls: In-Stock & Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* In-Stock Only Toggle */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
              style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
            <span>In Stock</span>
          </label>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <option value="featured" style={{ background: '#0e121d' }}>Featured First</option>
              <option value="price_asc" style={{ background: '#0e121d' }}>Price: Low to High</option>
              <option value="price_desc" style={{ background: '#0e121d' }}>Price: High to Low</option>
              <option value="rating" style={{ background: '#0e121d' }}>Highest Customer Rating</option>
              <option value="discount" style={{ background: '#0e121d' }}>Biggest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Showing {totalProducts} high-performance tech products
      </div>
    </div>
  );
}
