import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  Heart,
  MessageSquare,
  UserCheck,
  Send,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CategoryIcon from './CategoryIcon';

const COLOR_MAP = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#10b981',
  black: '#111827',
  white: '#ffffff',
  grey: '#9ca3af',
  brown: '#854d0e',
  beige: '#fef3c7',
  gold: '#eab308',
  silver: '#cbd5e1',
  purple: '#a855f7',
  yellow: '#eab308',
  'rose gold': '#f43f5e',
};

// Initial realistic customer reviews seed
const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Elena Vance',
    rating: 5,
    date: '2 days ago',
    title: 'Exceeded all expectations',
    content: 'The craftsmanship and finishing are top-notch. Arrived neatly packaged in 48 hours.',
  },
  {
    id: 2,
    author: 'Marcus Sterling',
    rating: 5,
    date: '1 week ago',
    title: 'Worth every dollar',
    content: 'True to size and exactly as pictured. Feels extremely durable and comfortable.',
  },
  {
    id: 3,
    author: 'Sophia Chen',
    rating: 4,
    date: '2 weeks ago',
    title: 'Great piece, fast shipping',
    content: 'High quality materials and great color accuracy. Would definitely recommend to others.',
  },
];

export default function ProductDetailModal({ product, onClose, onBuyNow }) {
  const { addToCart, addToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'reviews'
  const [selectedColor, setSelectedColor] = useState(
    product?.Colours && product.Colours.length > 0 ? product.Colours[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [newAuthor, setNewAuthor] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!product) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        selectedColor,
        selectedSize,
      },
      quantity
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,
        selectedColor,
        selectedSize,
      },
      quantity
    );
    onClose();
    if (onBuyNow) {
      onBuyNow();
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      author: newAuthor.trim() || 'Verified Customer',
      rating: newRating,
      date: 'Just now',
      title: 'Customer Experience',
      content: newComment.trim(),
    };

    setReviews([reviewObj, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setNewRating(5);
    addToast('Thank you! Your review was submitted.', 'success');
  };

  const rate = product.rating?.rate || 4.5;
  const count = product.rating?.count || 120;
  const itemPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-backdrop"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-200 overflow-hidden my-auto animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition border shadow-sm ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-red-500'
                : 'bg-white hover:bg-gray-100 text-gray-500 border-gray-200'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart size={17} className={isSaved ? 'fill-red-500 text-red-500' : ''} />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition border border-gray-200 shadow-sm"
            aria-label="Close product view"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Product Image */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-gray-200 text-gray-800 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <CategoryIcon id={product.category} size={14} />
              <span>{product.categoryName || product.category}</span>
            </span>

            <div className="aspect-square w-full max-w-[280px] flex items-center justify-center overflow-hidden">
              <img
                src={product.image || product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                alt={product.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>100% Authentic Quality Guaranteed</span>
            </div>
          </div>

          {/* Right: Tabbed Content (Overview / Reviews) */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Tab Navigation Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`text-xs font-bold pb-1.5 border-b-2 transition ${
                    activeTab === 'overview'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Overview & Options
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`text-xs font-bold pb-1.5 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  <span>Customer Reviews</span>
                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded-full text-[10px]">
                    {reviews.length}
                  </span>
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-2">
                    <div className="flex items-center">
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="font-bold text-gray-800">{rate}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reviews')}
                      className="text-gray-400 hover:underline"
                    >
                      ({reviews.length} reviews)
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight leading-snug mb-3">
                    {product.title}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-5">
                    <span className="text-3xl font-black text-gray-950">
                      ${itemPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock &bull; Ships in 24h
                    </span>
                  </div>

                  {/* Color Selection */}
                  {product.Colours && product.Colours.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                          Color: <span className="font-normal capitalize text-gray-900">{selectedColor || product.Colours[0]}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.Colours.map((c) => {
                          const isSel = selectedColor === c;
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSelectedColor(c)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                                isSel
                                  ? 'ring-2 ring-black ring-offset-2 border-gray-400 scale-105'
                                  : 'border-gray-300 hover:border-gray-500'
                              }`}
                              style={{ backgroundColor: COLOR_MAP[c.toLowerCase()] || '#888' }}
                              title={c}
                            >
                              {isSel && (
                                <Check
                                  size={12}
                                  className={['white', 'beige', 'yellow'].includes(c.toLowerCase()) ? 'text-black' : 'text-white'}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                          Option / Size:
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.sizes.map((s) => {
                          const isSel = selectedSize === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSelectedSize(s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                                isSel
                                  ? 'bg-black text-white shadow-sm'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Picker */}
                  <div className="mb-6 flex items-center gap-4">
                    <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px]">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold"
                      >
                        -
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Reviews Tab Content */
                <div className="space-y-4 max-h-[290px] overflow-y-auto pr-1">
                  {/* Write a Review Section */}
                  <form onSubmit={handleAddReview} className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2.5">
                    <span className="text-xs font-bold text-gray-900 block">Leave a Review</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="text-amber-400 hover:scale-110 transition"
                        >
                          <Star size={16} fill={star <= newRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="text-[11px] font-semibold text-gray-500 ml-1">
                        {newRating} / 5 Stars
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Your Name (Optional)"
                        className="border border-gray-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-black"
                      />
                      <input
                        type="text"
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Your review comment..."
                        className="border border-gray-200 rounded-lg p-2 text-xs bg-white focus:outline-none focus:border-black"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-1.5 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Send size={12} />
                      <span>Post Review</span>
                    </button>
                  </form>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="bg-white border border-gray-100 rounded-xl p-3 space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">{rev.author}</span>
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                              <UserCheck size={10} />
                              Verified
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{rev.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold border transition ${
                    isAdded
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-black hover:bg-neutral-800 border-black text-white shadow-sm'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Bottom Guarantee Bullets */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-1">
                  <RotateCcw size={12} className="text-gray-400" />
                  <span>30-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={12} className="text-gray-400" />
                  <span>Fast Tracked Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
