import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import OAuthButtons from '../components/OAuthButtons';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Star } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTarget = location.state?.from || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      addToast('Welcome back to MeShop!', 'success');
      navigate(redirectTarget);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-65px)] flex bg-white text-gray-900">
      {/* 1. Left Editorial Showcase (Visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        {/* Background Editorial Image */}
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
          alt="MeShop Fashion & Lifestyle"
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 text-white w-full">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-sm shadow">
                M.
              </span>
              <span className="text-xl font-extrabold tracking-tight">MeShop.</span>
            </Link>
          </div>

          <div className="space-y-6 max-w-md">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold uppercase tracking-wider text-white">
              Spring / Summer 2026
            </span>

            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              Curated essentials designed for everyday elegance.
            </h2>

            {/* Testimonial Quote */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-gray-200 italic leading-relaxed">
                "The fabric quality, packaging, and smooth checkout exceeded all expectations. My go-to store for wardrobe staples."
              </p>
              <span className="text-[11px] font-semibold text-gray-400 block">
                &mdash; Sophia Reynolds, Verified Customer
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
            <span>&copy; 2026 MeShop Inc.</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>

      {/* 2. Right Clean Modern Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-7 animate-fade-up">
          {/* Header */}
          <div className="space-y-2">
            <div className="lg:hidden mb-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-black text-white font-black flex items-center justify-center text-sm">
                  M.
                </span>
                <span className="text-xl font-extrabold tracking-tight">MeShop.</span>
              </Link>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">
              Please enter your details to sign in to your account.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div>
            <OAuthButtons redirectTo={redirectTarget} />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Password reset link sent if account exists', 'info')}
                  className="text-xs text-gray-500 hover:text-black font-semibold transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-black accent-black cursor-pointer"
                />
                <span className="text-xs text-gray-600">Remember for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs sm:text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-extrabold hover:underline">
              Create an account for free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
