import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATEGORIES, PRODUCTS_CATALOG } from '../data/products';
import CategoryIcon from '../components/CategoryIcon';
import ProductDetailModal from '../components/ProductDetailModal';
import ScrollReveal from '../components/ScrollReveal';
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Star,
  ShoppingBag,
  Heart,
} from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [viewingProduct, setViewingProduct] = useState(null);

  // Grab 1 representative trending product from each of the 5 categories
  const trendingItems = CATEGORIES.map((cat) => {
    return PRODUCTS_CATALOG.find((p) => p.category === cat.id) || PRODUCTS_CATALOG[0];
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 border-b border-gray-200 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-3">
              Spring / Summer 2026 Collection
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-950 leading-[1.1] tracking-tight mb-6">
              Shopping Made Simple.
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Discover curated apparel, luxury jewellery, essential footwear, and everyday electronics directly from top manufacturers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold px-8 py-3.5 rounded-xl text-sm sm:text-base shadow-sm transition"
              >
                <span>Shop All Categories</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-black bg-white text-gray-900 font-bold px-8 py-3.5 rounded-xl text-sm sm:text-base transition"
              >
                <span>Create Account</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
            <div className="relative bg-white border border-gray-200 rounded-3xl p-6 shadow-lg max-w-md w-full">
              <img
                src="/landingPagePic.png"
                alt="MeShop Showcase"
                className="w-full h-auto max-h-[360px] object-contain mx-auto"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    MeShop Collections
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Clothes &bull; Jewellery &bull; Footwear &bull; Tech
                  </span>
                </div>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-white bg-black hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition"
                >
                  Explore &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore 5 Categories Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Explore Our 5 Categories
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Browse through dozens of curated products in each department
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {CATEGORIES.map((cat, index) => {
              const count = PRODUCTS_CATALOG.filter((p) => p.category === cat.id).length;
              return (
                <ScrollReveal key={cat.id} direction="up" delay={index * 80}>
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="group relative bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-400 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Category Editorial Photo */}
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Vector Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-white/40 text-gray-900 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <CategoryIcon id={cat.id} size={14} className="text-gray-900" />
                        <span>{cat.name.split(' ')[0]}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[11px] font-semibold text-white/90 block">
                          {count} Curated Items
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                          {cat.tagline || cat.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-800 group-hover:text-black">
                        <span>Explore Shelf</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Trending Products across Categories */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Trending Highlights
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Popular selections across apparel, accessories, shoes, and gear
                </p>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-black hover:text-blue-600 transition flex items-center gap-1"
              >
                <span>View All 60+ Products</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingItems.map((prod, index) => (
              <ScrollReveal key={prod.id} direction="up" delay={index * 60}>
                <div
                  onClick={() => setViewingProduct(prod)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-gray-400 transition-all duration-200 group cursor-pointer h-full"
                >
                  <div>
                    <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
                      <img
                        src={prod.image || prod.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'}
                        alt={prod.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        Quick View
                      </span>

                      {/* Wishlist Heart Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod);
                        }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition border shadow-sm ${
                          isInWishlist(prod.id)
                            ? 'bg-rose-50 border-rose-200 text-red-500'
                            : 'bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 border-gray-200 opacity-80 group-hover:opacity-100'
                        }`}
                        title={isInWishlist(prod.id) ? 'Remove from Saved' : 'Save Item'}
                      >
                        <Heart size={13} className={isInWishlist(prod.id) ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      {prod.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors" title={prod.title}>
                      {prod.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-amber-500 mb-2">
                      <Star size={12} fill="currentColor" />
                      <span className="font-bold text-gray-700">{prod.rating?.rate}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">
                      ${prod.price?.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod);
                      }}
                      className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition active:scale-95 shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Simple E-Commerce Value Props */}
      <section className="bg-white py-12 border-b border-gray-200">
        <ScrollReveal direction="up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-2">
              <Truck size={22} className="text-black shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Free Shipping</h4>
                <p className="text-[11px] text-gray-500">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <RotateCcw size={22} className="text-black shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Easy Returns</h4>
                <p className="text-[11px] text-gray-500">30-day money-back policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <ShieldCheck size={22} className="text-black shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Secure Checkout</h4>
                <p className="text-[11px] text-gray-500">Protected order payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <Headphones size={22} className="text-black shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-900">Customer Support</h4>
                <p className="text-[11px] text-gray-500">Help whenever you need it</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
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
