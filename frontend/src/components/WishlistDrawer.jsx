import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistDrawer() {
  const { wishlist, wishlistCount, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Escape key closes drawer
  useEffect(() => {
    if (!isWishlistOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeWishlist();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistOpen, closeWishlist]);

  if (!isWishlistOpen) return null;

  const handleMoveToBag = (product) => {
    addToCart(product, 1, true);
    removeFromWishlist(product.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-backdrop"
      onClick={closeWishlist}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-drawer-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <Heart size={20} className="text-red-500 fill-red-500" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Saved Items</h2>
            <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {wishlistCount}
            </span>
          </div>

          <button
            type="button"
            onClick={closeWishlist}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition border border-gray-200 shadow-sm"
            aria-label="Close wishlist drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-red-400 flex items-center justify-center">
                <Heart size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">No saved items yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Tap the heart icon on any card to save pieces you love for later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeWishlist();
                  navigate('/shop');
                }}
                className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                {/* Item Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                    alt={item.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate" title={item.title}>
                      {item.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-gray-400 hover:text-red-500 transition shrink-0 p-1"
                      title="Remove from saved"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mt-0.5">
                    {item.categoryName || item.category}
                  </span>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-black text-gray-900">
                      ${Number(item.price || 0).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleMoveToBag(item)}
                      className="bg-black hover:bg-neutral-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-gray-50/50">
            <button
              type="button"
              onClick={() => {
                closeWishlist();
                navigate('/shop');
              }}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm border border-gray-200 shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
