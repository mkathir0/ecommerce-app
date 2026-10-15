import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Requirement: Store all inputs in variables and console log them on click of login button
    console.log('Login Button Clicked! Input variables:');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      login(email, password);
      setSuccess('Login successful! Redirecting to shop...');
      setTimeout(() => {
        navigate('/shop');
      }, 900);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black mb-2">Login</h1>
          <p className="text-sm text-gray-500">Welcome back! Please enter your details</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-6">
            ⚠️ {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium mb-6">
            ✓ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Email */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* 2. Password */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 transition-all font-semibold py-3 rounded-lg shadow-sm mt-2"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-bold underline">
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
}
