import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATEGORIES, PRODUCTS_CATALOG } from '../data/products';
import CategoryIcon from '../components/CategoryIcon';
import ProductDetailModal from '../components/ProductDetailModal';
import ScrollReveal from '../components/ScrollReveal';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Layers,
  Heart,
} from 'lucide-react';

const COLOR_MAP = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  black: '#000000',
  white: '#ffffff',
  grey: '#9ca3af',
  brown: '#854d0e',
  beige: '#fef3c7',
  gold: '#eab308',
  silver: '#cbd5e1',
};

const COLOR_PALETTE = ['red', 'blue', 'green', 'black', 'white'];

export default function ShopPage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Viewing Product Modal State
  const [viewingProduct, setViewingProduct] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  // Check if URL query has ?product=:id on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product');
    if (prodId) {
      const match = PRODUCTS_CATALOG.find((p) => p.id === prodId);
      if (match) setViewingProduct(match);
    }
  }, []);

  // Category horizontal scroll refs
  const scrollRefs = useRef({});

  const handleScroll = (catId, direction) => {
    const el = scrollRefs.current[catId];
    if (el) {
      const scrollAmount = direction === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handlePriceRangeToggle = (rangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setMinRating(0);
    setMaxPrice(1000);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRanges([]);
  };

  // Filter function applied to individual items
  const matchesFilters = (p) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchCat = (p.categoryName || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }

    // 2. Price Slider
    if (p.price > maxPrice) return false;

    // 3. Price Range Checkboxes
    if (selectedPriceRanges.length > 0) {
      const inAnyRange = selectedPriceRanges.some((range) => {
        if (range === '0-25') return p.price >= 0 && p.price <= 25;
        if (range === '25-50') return p.price > 25 && p.price <= 50;
        if (range === '50-100') return p.price > 50 && p.price <= 100;
        if (range === '100on') return p.price > 100;
        return true;
      });
      if (!inAnyRange) return false;
    }

    // 4. Color Filter
    if (selectedColors.length > 0) {
      if (!p.Colours || !p.Colours.some((c) => selectedColors.includes(c.toLowerCase()))) {
        return false;
      }
    }

    // 5. Size Filter
    if (selectedSizes.length > 0) {
      if (!p.sizes || !p.sizes.some((s) => selectedSizes.includes(s.toLowerCase()))) {
        return false;
      }
    }

    // 6. Rating Slider
    if (minRating > 0) {
      const rate = p.rating?.rate || 0;
      if (rate < minRating) return false;
    }

    return true;
  };

  // Filtered list for active category tab or full search
  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    if (activeCategory !== 'all') {
      if (p.category !== activeCategory) return false;
    }
    return matchesFilters(p);
  });

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-[calc(100vh-65px)] bg-gray-50/60">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 bg-black text-white shrink-0 p-5 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} />
            <span className="font-bold text-sm tracking-wide uppercase">Filters</span>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 transition"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Rating Filter Slider */}
        <section>
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            <span>Minimum Rating</span>
            <span className="text-white font-mono">{minRating > 0 ? `${minRating} ★` : 'All'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full cursor-pointer accent-white"
          />
          <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
            <span>Any</span>
            <span>3.0★</span>
            <span>4.0★</span>
            <span>5.0★</span>
          </div>
        </section>

        {/* 2. Colors Filter */}
        <section>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Colours
          </div>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTE.map((color) => {
              const isSelected = selectedColors.includes(color);
              const hex = COLOR_MAP[color] || '#888';
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border transition ${
                    isSelected
                      ? 'border-white bg-neutral-800 text-white ring-1 ring-white'
                      : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-600"
                    style={{ backgroundColor: hex }}
                  />
                  <span>{color}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Sizes Filter */}
        <section>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Sizes
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {['s', 'm', 'l', 'xl'].map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`text-center py-1.5 rounded-lg text-xs font-bold uppercase border transition ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Price Range Checkboxes & Slider */}
        <section>
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
            Price Range
          </div>
          <div className="space-y-1.5 text-xs text-neutral-300 mb-3">
            {[
              { id: '0-25', label: '$0 to $25' },
              { id: '25-50', label: '$25 to $50' },
              { id: '50-100', label: '$50 to $100' },
              { id: '100on', label: '$100 and above' },
            ].map((range) => (
              <label key={range.id} className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedPriceRanges.includes(range.id)}
                  onChange={() => handlePriceRangeToggle(range.id)}
                  className="rounded border-neutral-700 bg-neutral-900 text-white accent-white"
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
            <span>Max Price</span>
            <span className="text-white font-mono">${maxPrice}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full cursor-pointer accent-white"
          />
        </section>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search products across clothing, accessories, footwear & electronics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm focus:border-black focus:ring-1 focus:ring-black outline-none shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills (5 Categories + All) */}
        <div className="flex gap-2 sm:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-black text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            <Layers size={15} className={activeCategory === 'all' ? 'text-white' : 'text-gray-600'} />
            <span>All Categories</span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {PRODUCTS_CATALOG.length}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const catCount = PRODUCTS_CATALOG.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-2 ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                }`}
              >
                <CategoryIcon
                  id={cat.id}
                  size={15}
                  className={isActive ? 'text-white' : 'text-gray-600'}
                />
                <span>{cat.name}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {catCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* VIEW 1: GROUPED BY 5 CATEGORIES (when "all" is active and not heavily filtered) */}
        {activeCategory === 'all' && !searchQuery.trim() && (
          <div className="space-y-12">
            {CATEGORIES.map((cat, index) => {
              const categoryItems = PRODUCTS_CATALOG.filter(
                (p) => p.category === cat.id && matchesFilters(p)
              );

              if (categoryItems.length === 0) return null;

              return (
                <ScrollReveal key={cat.id} direction="up" delay={index > 0 ? 60 : 0}>
                  <section className="space-y-4">
                    {/* Category Shelf Header with Navigation Arrows */}
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200/90 flex items-center justify-center text-gray-900 shadow-sm shrink-0">
                          <CategoryIcon id={cat.id} size={20} />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {cat.name}
                          </h2>
                          <p className="text-xs text-gray-500">{cat.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
                          {categoryItems.length} items &bull; Scroll to explore &rarr;
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleScroll(cat.id, 'left')}
                            className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition shadow-sm active:scale-95"
                            title="Scroll left"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleScroll(cat.id, 'right')}
                            className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition shadow-sm active:scale-95"
                            title="Scroll right"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Scroll Shelf (User can scroll at least twice fully!) */}
                    <div
                      ref={(el) => (scrollRefs.current[cat.id] = el)}
                      className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-thin"
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {categoryItems.map((prod) => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onAddToCart={() => addToCart(prod)}
                          onQuickView={setViewingProduct}
                        />
                      ))}
                    </div>
                  </section>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {/* VIEW 2: SINGLE CATEGORY GRID OR SEARCH RESULTS */}
        {(activeCategory !== 'all' || searchQuery.trim()) && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                {activeCategory !== 'all'
                  ? CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Filtered Products'
                  : `Search Results for "${searchQuery}"`}
              </h2>
              <span className="text-xs font-bold text-gray-500">
                Showing {filteredProducts.length} items
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center my-6 space-y-3">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Oops! We couldn't find the product you searched for.
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try adjusting your search terms, changing the category, or clearing the sidebar filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-black text-white hover:bg-neutral-800 font-bold px-5 py-2 rounded-xl text-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((prod, index) => (
                  <ScrollReveal key={prod.id} direction="up" delay={(index % 4) * 50}>
                    <ProductCard
                      product={prod}
                      onAddToCart={() => addToCart(prod)}
                      onQuickView={setViewingProduct}
                      isGrid
                    />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onBuyNow={() => {
            setViewingProduct(null);
            navigate('/cart');
          }}
        />
      )}
    </div>
  );
}

// Reusable Product Card Component
function ProductCard({ product, onAddToCart, onQuickView, isGrid = false }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const rate = product.rating?.rate || 4.5;
  const count = product.rating?.count || 50;
  const isSaved = isInWishlist(product.id);

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className={`bg-white border border-gray-200/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-gray-400 transition-all duration-200 group cursor-pointer ${
        isGrid ? 'w-full' : 'w-64 sm:w-72 shrink-0'
      }`}
      style={!isGrid ? { scrollSnapAlign: 'start' } : undefined}
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
          <img
            src={product.image || product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm border border-gray-200 px-2 py-0.5 rounded-full text-gray-700">
            {product.categoryName || product.category}
          </span>

          {/* Wishlist Heart Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition border shadow-sm ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-red-500'
                : 'bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 border-gray-200 opacity-80 group-hover:opacity-100'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save Item'}
          >
            <Heart size={13} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
          </button>

          <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            Quick View
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-2">
          <div className="flex items-center">
            <Star size={12} fill="currentColor" />
          </div>
          <span className="font-bold text-gray-800">{rate}</span>
          <span className="text-[11px] text-gray-400">({count})</span>
        </div>

        {/* Colours & Sizes Badges */}
        <div className="space-y-1 mb-3 text-[11px] text-gray-500">
          {product.Colours && product.Colours.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-400 text-[10px] uppercase">Colors:</span>
              <div className="flex gap-1 flex-wrap">
                {product.Colours.map((c) => (
                  <span
                    key={c}
                    className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: COLOR_MAP[c.toLowerCase()] || '#999' }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'standard' && (
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-400 text-[10px] uppercase">Sizes:</span>
              <div className="flex gap-1">
                {product.sizes.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-1 py-0.2 rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price & Add to Cart */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-base sm:text-lg font-black text-gray-900">
          ${product.price?.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
