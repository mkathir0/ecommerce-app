import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { currentUser } = useAuth();
  const { cartCount } = useCart();

  const activeClass = ({ isActive }) =>
    isActive
      ? 'text-white font-bold border-b-2 border-white pb-1'
      : 'text-gray-300 hover:text-white font-medium transition-colors pb-1';

  return (
    <nav className="sticky top-0 z-50 bg-black text-white border-b border-neutral-700 px-6 sm:px-10 py-4 flex items-center justify-between">
      {/* Brand Logo in exact Figma style */}
      <div className="text-2xl font-bold tracking-tight">
        <Link to="/" className="text-white hover:text-gray-200">
          MeShop.
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex items-center space-x-4 sm:space-x-8 text-sm sm:text-base">
        <NavLink to="/" className={activeClass} end>
          Home
        </NavLink>

        <NavLink to="/shop" className={activeClass}>
          Shop
        </NavLink>

        {currentUser && currentUser.token ? (
          <NavLink to="/profile" className={activeClass}>
            Profile
          </NavLink>
        ) : (
          <>
            <NavLink to="/login" className={activeClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={activeClass}>
              Signup
            </NavLink>
          </>
        )}

        <NavLink to="/cart" className={activeClass}>
          My Cart
          {cartCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-white text-black text-xs font-bold rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
