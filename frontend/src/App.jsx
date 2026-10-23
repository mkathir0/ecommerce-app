import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  // Requirement: "Apart from the UI make basic events on click of buttons, and console log which button was clicked."
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        console.log('Button clicked:', btn.innerText.trim() || btn.id || btn.className);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-white text-gray-900 font-inter">
              {/* Global Toast Notification Container */}
              <Toast />

              {/* Slide-over Mini-Cart Drawer */}
              <CartDrawer />

              {/* Slide-over Saved Items / Wishlist Drawer */}
              <WishlistDrawer />

              {/* Navigation Header */}
              <Navbar />

            {/* Application Routes - Clean modern SPA paths */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Backward compatibility redirects for legacy .html links */}
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/shop.html" element={<Navigate to="/shop" replace />} />
              <Route path="/signup.html" element={<Navigate to="/signup" replace />} />
              <Route path="/login.html" element={<Navigate to="/login" replace />} />
              <Route path="/cart.html" element={<Navigate to="/cart" replace />} />
              <Route path="/profile.html" element={<Navigate to="/profile" replace />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </div>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
