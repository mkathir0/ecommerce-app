import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Tag,
  Check,
  Percent,
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, addToast } = useCart();
  const { user, currentUser, token } = useAuth();
  const navigate = useNavigate();

  const activeUser = user || currentUser;
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Calculate discounts
  let discountAmount = 0;
  let effectiveShipping = subtotal > 150 || subtotal === 0 ? 0 : shippingMethod === 'express' ? 19.99 : 9.99;

  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discountAmount = (subtotal * appliedPromo.value) / 100;
    } else if (appliedPromo.type === 'freeship') {
      effectiveShipping = 0;
    }
  }

  const shippingCost = effectiveShipping;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxCost = taxableSubtotal * 0.08;
  const grandTotal = Math.max(0, taxableSubtotal + (subtotal > 0 ? shippingCost + taxCost : 0));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10') {
      setAppliedPromo({ code, type: 'percentage', value: 10, label: '10% New Customer Discount' });
      addToast('Promo code WELCOME10 applied (10% off)!', 'success');
      setPromoInput('');
    } else if (code === 'SAVE15') {
      if (subtotal < 100) {
        setPromoError('SAVE15 requires an order subtotal of at least $100');
        return;
      }
      setAppliedPromo({ code, type: 'percentage', value: 15, label: '15% Seasonal Discount' });
      addToast('Promo code SAVE15 applied (15% off)!', 'success');
      setPromoInput('');
    } else if (code === 'VIP20') {
      setAppliedPromo({ code, type: 'percentage', value: 20, label: '20% VIP Store Discount' });
      addToast('VIP discount of 20% applied!', 'success');
      setPromoInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, type: 'freeship', value: 0, label: 'Complimentary Free Express Shipping' });
      addToast('Free Shipping promo applied!', 'success');
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME10 or VIP20');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
    addToast('Promo code removed', 'info');
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Your cart is empty! Please add items before checking out.', 'error');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Build order items
      const orderItems = cart.map((item) => ({
        product: item._id || item.id,
        title: item.title,
        quantity: item.quantity || 1,
        image: item.image,
        price: item.price,
      }));

      // Shipping address from user profile or default
      const shippingAddress = {
        recipientName: activeUser?.name || 'Valued Customer',
        street: activeUser?.address?.street || '100 Market Street',
        city: activeUser?.address?.city || 'San Francisco',
        state: activeUser?.address?.state || 'CA',
        postalCode: activeUser?.address?.postalCode || '94103',
        country: activeUser?.address?.country || 'USA',
        phone: activeUser?.phone || '+1 555-0192',
      };

      const orderPayload = {
        orderItems,
        shippingAddress,
        paymentMethod: 'CreditCard/Razorpay',
        itemsPrice: subtotal,
        taxPrice: taxCost,
        shippingPrice: shippingCost,
        totalPrice: grandTotal,
        customerEmail: activeUser?.email || 'guest@meshop.com',
        customerName: activeUser?.name || 'Customer',
      };

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      addToast('🎉 Order placed successfully! You can track it in your profile.', 'success');

      if (token) {
        navigate('/profile?tab=orders');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.message || 'Payment/Checkout failed. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review your hardware selection and proceed to secure checkout
          </p>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white border border-gray-200/90 rounded-3xl p-12 sm:p-16 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet. Explore our high-tech catalog to find what you need.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-sm"
          >
            <span>Explore Hardware Store</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
              const itemTotal = itemPrice * (item.quantity || 1);

              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-gray-300 transition duration-150"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image || item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                      alt={item.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {item.category || 'Tech'}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate mt-1" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ${itemPrice.toFixed(2)} per unit
                      </p>
                      <div className="text-base sm:text-lg font-black text-gray-900 mt-2">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-l-xl transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-gray-900">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1.5 hover:bg-gray-200 text-gray-600 rounded-r-xl transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold p-1 transition"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Shipping Destination */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-gray-700 uppercase tracking-wider">
                  Shipping To:
                </span>
                {activeUser && (
                  <Link to="/profile?tab=address" className="text-blue-600 hover:underline text-[11px] font-semibold">
                    Change
                  </Link>
                )}
              </div>
              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs text-gray-600 flex items-start gap-2">
                <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">
                    {activeUser?.name || 'Customer Address'}
                  </div>
                  <div>
                    {activeUser?.address?.street
                      ? `${activeUser.address.street}, ${activeUser.address.city}, ${activeUser.address.state} ${activeUser.address.postalCode}`
                      : '100 Market St, San Francisco, CA 94103'}
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code Accordion / Input */}
            <div className="pt-2 border-t border-gray-100">
              {appliedPromo ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-emerald-600" />
                    <div>
                      <span className="font-bold tracking-wider">{appliedPromo.code}</span>
                      <p className="text-[11px] text-emerald-600">{appliedPromo.label}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError('');
                      }}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-black font-semibold text-gray-800"
                    />
                    <button
                      type="submit"
                      className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-500 font-medium pl-1">{promoError}</p>
                  )}
                  {/* Hint promo chips */}
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400">
                    <span>Try:</span>
                    <button
                      type="button"
                      onClick={() => setPromoInput('WELCOME10')}
                      className="font-mono bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold transition"
                    >
                      WELCOME10
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromoInput('VIP20')}
                      className="font-mono bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-bold transition"
                    >
                      VIP20
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + (b.quantity || 1), 0)} items)</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedPromo?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-gray-900">${taxCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline text-base sm:text-lg font-black text-gray-900">
              <span>Total Amount</span>
              <span className="text-xl sm:text-2xl">${grandTotal.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              disabled={isPlacingOrder}
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 text-sm"
            >
              {isPlacingOrder ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing Checkout...
                </span>
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Place Order &bull; ${grandTotal.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-gray-400 text-center">
              <span>Fast delivery &bull; 30-day return policy</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
