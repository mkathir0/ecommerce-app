import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Auth Guard: if user isn't logged in, remove them and take them back to login page
  useEffect(() => {
    if (!currentUser || !currentUser.token) {
      console.warn('Unauthorized access to profile page. Redirecting to login...');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Update form inputs if currentUser loads/changes
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleUpdate = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      updateProfile(firstName, lastName, oldPassword, newPassword);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ text: err.message || 'Update failed', type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12 flex-1 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-md">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-black">My Profile</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Hello, <strong className="text-black">{currentUser.firstName} {currentUser.lastName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg text-sm font-medium mb-6 ${
              message.type === 'success'
                ? 'bg-emerald-100 border border-emerald-400 text-emerald-800'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          >
            {message.type === 'success' ? '✓' : '⚠️'} {message.text}
          </div>
        )}

        {/* Profile Information & Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base focus:border-black focus:ring-1 focus:ring-black outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
              Email Address (Immutable)
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg text-sm sm:text-base cursor-not-allowed outline-none"
            />
          </div>

          <div className="border-t border-gray-200 pt-5 mt-5">
            <h3 className="text-sm font-bold text-black mb-3">Change Password (Optional)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-[11px] text-gray-400">
              Session Token:{' '}
              <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-mono">
                {currentUser.token}
              </code>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 transition font-semibold px-6 py-2.5 rounded-lg text-sm shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
