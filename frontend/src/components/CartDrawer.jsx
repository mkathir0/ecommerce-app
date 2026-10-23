import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotal,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  // Escape key closes drawer
  useEffect(() => {
    if (!isCartDrawerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-backdrop"
      onClick={closeCartDrawer}
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 animate-drawer-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-gray-900" />
            <h2 className="text-lg font-black text-gray-900 tracking-tight">Your Bag</h2>
            <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>

          <button
            type="button"
            onClick={closeCartDrawer}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-gray-700 flex items-center justify-center transition border border-gray-200 shadow-sm"
            aria-label="Close bag drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Your bag is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Discover our curated collections across apparel, jewellery, tech, and footwear.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  navigate('/shop');
                }}
                className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-sm transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
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
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition shrink-0 p-1"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {(item.selectedColor || item.selectedSize) && (
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      {item.selectedColor && (
                        <span className="capitalize">Color: {item.selectedColor}</span>
                      )}
                      {item.selectedSize && (
                        <span className="uppercase">Size: {item.selectedSize}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-7 text-center font-bold text-gray-900">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="text-sm font-black text-gray-900">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-200 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Estimated Subtotal</span>
              <span className="text-base font-black text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="text-[11px] text-gray-400">
              Taxes and shipping calculated at checkout.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>View Full Bag & Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Secure Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
