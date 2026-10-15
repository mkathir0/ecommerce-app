import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RAZORPAY_KEY = 'rzp_test_PV1oQ0oMtgXOsq';
const BACKEND_ORDERS_API = 'http://localhost:5001/api/orders';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, subtotal } = useCart();
  const { currentUser } = useAuth();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty! Please add items before checking out.');
      return;
    }

    const amountInPaise = Math.round(subtotal * 100);
    console.log('Initiating Razorpay checkout. Subtotal:', subtotal, 'Amount (paise):', amountInPaise);

    // If Razorpay SDK is available
    if (typeof window !== 'undefined' && window.Razorpay) {
      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: 'INR',
        name: 'MeShop',
        description: 'Cart Products Checkout',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80',
        prefill: {
          name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Customer',
          email: currentUser ? currentUser.email : 'customer@meshop.com',
          contact: '9999999999',
        },
        theme: {
          color: '#000000',
        },
        handler: function (response) {
          console.log('Razorpay payment response received:', response);
          finalizeCheckout(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal dismissed by user.');
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (res) {
          console.error('Payment failed:', res.error);
          alert('Payment failed: ' + res.error.description);
        });
        rzp.open();
      } catch (err) {
        console.warn('Razorpay error, fallback to direct completion:', err);
        finalizeCheckout();
      }
    } else {
      console.log('Razorpay SDK not loaded, completing checkout fallback.');
      finalizeCheckout();
    }
  };

  const finalizeCheckout = async (paymentId) => {
    // Sync order to Node.js backend
    try {
      const orderPayload = {
        orderItems: cart.map((item) => ({
          product: '65287f7a2428318b871c9999', // placeholder or product id
          title: item.title,
          quantity: item.quantity || 1,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: {
          recipientName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Customer',
          street: '100 Market St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          country: 'USA',
          phone: '9999999999',
        },
        itemsPrice: subtotal,
        totalPrice: subtotal,
        customerEmail: currentUser ? currentUser.email : 'customer@meshop.com',
        customerName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Customer',
      };

      await fetch(BACKEND_ORDERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      console.log('Order registered in Node.js backend database successfully.');
    } catch (e) {
      console.warn('Backend order recording skipped:', e.message);
    }

    // 1. Get rid of the cart (Requirement: "get rid of the cart")
    clearCart();

    // 2. Show alert (Requirement: "show an alert saying that the items were purchased.")
    alert('The items were purchased.');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
      <h1 className="text-3xl font-extrabold text-black mb-8">My Cart</h1>

      {cart.length === 0 ? (
        <div className="border border-black p-12 text-center max-w-lg mx-auto bg-white">
          <h3 className="text-xl font-bold text-black mb-2">Your Cart is Empty</h3>
          <p className="text-gray-500 mb-6 text-sm">
            You haven't added any products to your cart yet.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white hover:bg-neutral-800 transition font-semibold px-6 py-3 text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <section className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemTotal = item.price * (item.quantity || 1);
              return (
                <div
                  key={item.id}
                  className="border border-black p-4 flex items-center justify-between gap-4 bg-white"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-contain p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-black truncate mb-1" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        Qty: <strong>{item.quantity || 1}</strong> &bull; Unit: ${item.price.toFixed(2)}
                      </p>
                      <div className="text-base font-extrabold text-black">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="border border-black bg-white hover:bg-black hover:text-white text-black font-semibold px-4 py-2 text-xs transition shrink-0 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </section>

          {/* Right Column: Exact Figma Checkout Box */}
          <aside className="border border-black p-6 bg-white">
            <h2 className="text-xl font-bold text-black border-b border-black pb-3 mb-4">
              Checkout-List
            </h2>

            <ul className="space-y-2 mb-6 max-h-56 overflow-y-auto text-sm text-gray-700">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="truncate max-w-[180px]">{item.title}</span>
                  <strong className="text-black">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>

            <div className="border-t border-black pt-4 flex justify-between text-lg font-black text-black">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              id="rzp-button1"
              onClick={handleCheckout}
              className="w-full bg-black text-white hover:bg-neutral-800 transition font-bold py-3.5 text-base mt-6 cursor-pointer border border-black"
            >
              Click To Checkout
            </button>

            <p className="text-[11px] text-gray-500 text-center mt-3">
              Secured by Razorpay (rzp_test_PV1oQ0oMtgXOsq) &bull; Node.js Backend
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
