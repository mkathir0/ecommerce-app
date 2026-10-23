import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickSearchModal from './QuickSearchModal';
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Search,
  Heart,
} from 'lucide-react';

export default function Navbar() {
  const { user, currentUser, logout, isAuthenticated } = useAuth();
  const { cartCount, openCartDrawer, addToast } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active user normalized
  const activeUser = user || currentUser;
  const isUserLoggedIn = isAuthenticated || Boolean(activeUser && (activeUser.token || activeUser._id || activeUser.email));

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    addToast('You have been logged out successfully.', 'info');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-all duration-150 px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-white bg-neutral-800'
        : 'text-gray-300 hover:text-white hover:bg-neutral-850'
    }`;

  const userDisplayName = activeUser?.name || `${activeUser?.firstName || ''} ${activeUser?.lastName || ''}`.trim() || 'My Account';
  const userInitial = userDisplayName.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md text-white border-b border-neutral-800 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-base shadow-sm group-hover:scale-105 transition-transform">
            M.
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-gray-200 transition-colors">
            MeShop<span className="text-blue-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 sm:space-x-2">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
        </div>

        {/* Right Action Icons & Auth Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Search Button (Cmd+K) */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 px-2.5 sm:px-3 py-2 rounded-xl transition duration-150 text-xs font-semibold"
            title="Quick Search (⌘K)"
          >
            <Search size={16} />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden lg:inline-block bg-neutral-800 border border-neutral-700 text-gray-400 text-[10px] px-1.5 py-0.2 rounded font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={openWishlist}
            className="relative flex items-center gap-1.5 text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 p-2 sm:px-3 sm:py-2 rounded-xl transition duration-150"
            title="Saved Items"
          >
            <Heart size={18} className={wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''} />
            <span className="text-xs font-bold hidden sm:inline">Saved</span>
            {wishlistCount > 0 && (
              <span className="inline-flex items-center justify-center bg-rose-500 text-white text-[11px] font-black rounded-full h-5 min-w-5 px-1 shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Mini-Cart Drawer Button */}
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative flex items-center gap-2 text-gray-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 px-3.5 py-2 rounded-xl transition duration-150"
            title="Shopping Bag"
          >
            <ShoppingCart size={18} />
            <span className="text-xs font-bold hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center bg-blue-500 text-white text-[11px] font-black rounded-full h-5 min-w-5 px-1 shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Conditional Auth Rendering */}
          {isUserLoggedIn ? (
            /* Logged In User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl px-3 py-1.5 text-left transition duration-150 group"
              >
                {activeUser?.avatar ? (
                  <img
                    src={activeUser.avatar}
                    alt={userDisplayName}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-600"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                    {userInitial}
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-200 max-w-[110px] truncate hidden sm:inline">
                  {userDisplayName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 group-hover:text-white transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl py-2 z-50 animate-dropdown text-gray-200">
                  {/* User info banner */}
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      {activeUser?.avatar ? (
                        <img
                          src={activeUser.avatar}
                          alt={userDisplayName}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-600"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                          {userInitial}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{userDisplayName}</p>
                        <p className="text-xs text-gray-400 truncate">{activeUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                    >
                      <User size={16} className="text-gray-400" />
                      <span>Profile Management</span>
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                    >
                      <Package size={16} className="text-gray-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/profile?tab=address"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                    >
                      <Settings size={16} className="text-gray-400" />
                      <span>Shipping Address</span>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="pt-1 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center space-x-2">
              <NavLink
                to="/login"
                className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 rounded-xl transition hover:bg-neutral-850"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="text-xs sm:text-sm font-bold bg-white text-black hover:bg-gray-100 px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                Sign Up
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-neutral-800 mt-3 space-y-2 animate-fade-up">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-neutral-800 hover:text-white"
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-neutral-800 hover:text-white"
          >
            Shop
          </NavLink>
          {isUserLoggedIn && (
            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              My Profile & Orders
            </NavLink>
          )}
        </div>
      )}

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(prod) => {
          navigate(`/shop?product=${prod.id}`);
        }}
      />
    </nav>
  );
}
