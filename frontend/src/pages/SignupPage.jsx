import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import OAuthButtons from '../components/OAuthButtons';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const { addToast } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      addToast('Welcome to MeShop! Your account is ready.', 'success');
      navigate('/shop');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-65px)] flex bg-white text-gray-900">
      {/* 1. Left Editorial Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
          alt="MeShop Retail Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-80 scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 text-white w-full">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-white text-black font-black flex items-center justify-center text-sm shadow">
                M.
              </span>
              <span className="text-xl font-extrabold tracking-tight">MeShop.</span>
            </Link>
          </div>

          <div className="space-y-4 max-w-md">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold uppercase tracking-wider text-white">
              Member Benefits
            </span>

            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
              Join millions shopping smart across 5 curated categories.
            </h2>

            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <span className="text-white font-bold">&check;</span>
                <span>Fast express delivery on all orders over $50</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white font-bold">&check;</span>
                <span>Save multiple shipping addresses for 1-click checkout</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-white font-bold">&check;</span>
                <span>Real-time order timeline tracking &amp; purchase history</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
            <span>&copy; 2026 MeShop Inc.</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>

      {/* 2. Right Clean Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6 animate-fade-up">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="lg:hidden mb-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-black text-white font-black flex items-center justify-center text-sm">
                  M.
                </span>
                <span className="text-xl font-extrabold tracking-tight">MeShop.</span>
              </Link>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-gray-500">
              Enter your details to create your MeShop account.
            </p>
          </div>

          {/* Social OAuth Buttons */}
          <div>
            <OAuthButtons redirectTo="/shop" />
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Or register with email
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
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition shadow-sm"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-black accent-black cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                I agree to the{' '}
                <span className="text-black font-semibold underline">Terms of Service</span> and{' '}
                <span className="text-black font-semibold underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs sm:text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-extrabold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
