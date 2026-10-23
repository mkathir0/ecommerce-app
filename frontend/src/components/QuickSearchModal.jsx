import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PRODUCTS_CATALOG, CATEGORIES } from '../data/products';
import CategoryIcon from './CategoryIcon';

export default function QuickSearchModal({ isOpen, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when modal opens & register Cmd+K
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter products based on search query and category
  const results = PRODUCTS_CATALOG.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCat) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }).slice(0, 8); // Top 8 matches for speed and clarity

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectProduct(results[selectedIndex]);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectProduct]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-4 animate-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center gap-3">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 60+ products, categories, or keywords..."
            className="w-full text-base sm:text-lg font-medium text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedIndex(0);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <CategoryIcon id={cat.id} size={13} />
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-gray-50">
          {results.length === 0 ? (
            <div className="p-10 text-center text-gray-400 space-y-2">
              <Search size={32} className="mx-auto text-gray-300" />
              <p className="text-sm font-semibold text-gray-600">No matching products found</p>
              <p className="text-xs text-gray-400">Try a different keyword or department</p>
            </div>
          ) : (
            results.map((prod, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    onSelectProduct(prod);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition ${
                    isSelected ? 'bg-gray-100/80 shadow-sm' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={prod.image || prod.thumbnail}
                        alt={prod.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {prod.categoryName || prod.category}
                        </span>
                        <div className="flex items-center text-[10px] text-amber-500 font-bold">
                          <Star size={10} fill="currentColor" />
                          <span>{prod.rating?.rate}</span>
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {prod.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-black text-gray-900">
                      ${prod.price?.toFixed(2)}
                    </span>
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                        <span>Select</span>
                        <CornerDownLeft size={10} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            <span>&uarr;&darr; Navigate</span>
            <span>&crarr; View Product</span>
            <span>Esc Close</span>
          </div>
          <span>Showing top {results.length} results</span>
        </div>
      </div>
    </div>
  );
}
