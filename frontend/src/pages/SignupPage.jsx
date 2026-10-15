import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Requirement: Store all inputs in variables and console log them on click of signup button
    const { firstName, lastName, email, password, confirmPassword } = formData;
    console.log('Signup Button Clicked! Input variables:');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    try {
      signup({ firstName, lastName, email, password, confirmPassword });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 w-full max-w-md shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black mb-2">Signup</h1>
          <p className="text-sm text-gray-500">Create your MeShop account to start shopping</p>
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
          {/* 1. First Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* 2. Last Name */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* 3. Email */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* 4. Password */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* 5. Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 transition-all font-semibold py-3 rounded-lg shadow-sm mt-2"
          >
            Signup
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-black font-bold underline">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
