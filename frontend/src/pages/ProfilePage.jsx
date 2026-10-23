import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  User,
  MapPin,
  Package,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  ShoppingBag,
  Truck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, currentUser, token, updateProfile, logout, loading: authLoading } = useAuth();
  const { addToast } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeUser = user || currentUser;
  const currentTab = searchParams.get('tab') || 'overview';
  const [expandedOrderTrackId, setExpandedOrderTrackId] = useState(null);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !activeUser) {
      console.warn('Unauthorized access to profile page. Redirecting to login...');
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [activeUser, authLoading, navigate]);

  // Tab 1: Personal Info Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  // Tab 2: Address Form State
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });

  // Tab 4: Security Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Form saving states
  const [saving, setSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync state when activeUser loads
  useEffect(() => {
    if (activeUser) {
      setName(activeUser.name || `${activeUser.firstName || ''} ${activeUser.lastName || ''}`.trim());
      setPhone(activeUser.phone || '');
      setAvatar(activeUser.avatar || '');
      if (activeUser.address) {
        setAddress({
          street: activeUser.address.street || '',
          city: activeUser.address.city || '',
          state: activeUser.address.state || '',
          postalCode: activeUser.address.postalCode || '',
          country: activeUser.address.country || 'USA',
        });
      }
    }
  }, [activeUser]);

  // Fetch orders when tab is 'orders'
  useEffect(() => {
    if (activeUser && token && (currentTab === 'orders' || currentTab === 'overview')) {
      async function fetchOrders() {
        setLoadingOrders(true);
        setOrdersError('');
        try {
          const res = await fetch('/api/orders/myorders', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setOrders(data.orders || []);
          } else {
            setOrdersError(data.message || 'Could not fetch order history.');
          }
        } catch (err) {
          console.warn('Orders fetch failed:', err);
          setOrdersError('Failed to load orders from server.');
        } finally {
          setLoadingOrders(false);
        }
      }

      fetchOrders();
    }
  }, [activeUser, token, currentTab]);

  if (authLoading || !activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleUpdatePersonalInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        phone,
        avatar,
      });
      addToast('Personal information updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update personal details', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ address });
      addToast('Shipping address saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        oldPassword,
        password: newPassword,
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Password changed successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectDiceBearAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    setAvatar(newAvatar);
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully.', 'info');
    navigate('/login');
  };

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-up">
      {/* Top Profile Hero Card */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* User Avatar + Identity */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-gray-200 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black text-white font-black text-3xl flex items-center justify-center shadow-md">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <button
                type="button"
                onClick={handleSelectDiceBearAvatar}
                title="Generate Random Avatar"
                className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-100 text-gray-800 p-2 rounded-xl shadow-md border border-gray-200 transition active:scale-95"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {name || 'Valued Customer'}
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                <Mail size={14} />
                <span>{activeUser.email}</span>
              </p>

              {activeUser.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Phone size={13} />
                  <span>{activeUser.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 sm:gap-6 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-8">
            <div className="text-center px-3">
              <div className="text-2xl sm:text-3xl font-black text-black">
                {orders.length}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Orders
              </div>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center px-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                ${totalSpent.toFixed(2)}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Total Spent
              </div>
            </div>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl transition ml-auto"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-1.5">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'overview' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
              currentTab === 'overview'
                ? 'bg-black text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80'
            }`}
          >
            <User size={18} />
            <span>Personal Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
              currentTab === 'orders'
                ? 'bg-black text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} />
              <span>Order History</span>
            </div>
            {orders.length > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  currentTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'address' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
              currentTab === 'address'
                ? 'bg-black text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80'
            }`}
          >
            <MapPin size={18} />
            <span>Shipping Address</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'security' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all text-left ${
              currentTab === 'security'
                ? 'bg-black text-white shadow-md'
                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80'
            }`}
          >
            <Shield size={18} />
            <span>Security & Passwords</span>
          </button>
        </div>

        {/* Right Content Panel */}
        <div className="lg:col-span-3">
          {/* TAB 1: OVERVIEW / PERSONAL DETAILS */}
          {currentTab === 'overview' && (
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500">
                  Manage your personal details, email preferences, and display avatar
                </p>
              </div>

              <form onSubmit={handleUpdatePersonalInfo} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      value={activeUser.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl text-sm cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Avatar Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.example.com/avatar.jpg"
                      className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={handleSelectDiceBearAvatar}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs whitespace-nowrap transition"
                    >
                      🎲 Randomize
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm transition disabled:opacity-60"
                  >
                    {saving ? 'Saving changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {currentTab === 'orders' && (
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-gray-100 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Orders</h2>
                  <p className="text-xs text-gray-500">
                    Track current hardware shipments, review receipts, and invoice history
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-black hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition"
                >
                  <ShoppingBag size={14} />
                  <span>Shop More</span>
                </Link>
              </div>

              {loadingOrders ? (
                <div className="py-16 text-center">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Fetching your orders...</p>
                </div>
              ) : ordersError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  ⚠️ {ordersError}
                </div>
              ) : orders.length === 0 ? (
                /* Empty state */
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">No Orders Placed Yet</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Explore our high-performance tech products, add items to your cart, and experience seamless checkout.
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
                  >
                    <span>Explore Hardware Store</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                /* Orders List */
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="border border-gray-200 rounded-2xl p-4 sm:p-5 hover:border-gray-300 transition duration-150"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                            Order ID
                          </span>
                          <span className="text-sm font-mono font-bold text-gray-900">
                            #{ord._id.substring(0, 10)}...
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                            Date Placed
                          </span>
                          <span className="text-xs font-semibold text-gray-600">
                            {new Date(ord.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                            Total
                          </span>
                          <span className="text-sm font-black text-black">
                            ${ord.totalPrice ? ord.totalPrice.toFixed(2) : '0.00'}
                          </span>
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'processing' || ord.status === 'paid'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            <Clock size={11} />
                            {ord.status || 'Processing'}
                          </span>
                        </div>
                      </div>

                      {/* Items previews */}
                      <div className="space-y-2">
                        {ord.orderItems &&
                          ord.orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-gray-500">
                                  Qty: {item.quantity || 1} &bull; ${item.price?.toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* Shipping destination summary & Tracking Toggle */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
                        <span>
                          {ord.shippingAddress ? (
                            <>
                              Ship to: <strong>{ord.shippingAddress.recipientName || name}</strong> &bull;{' '}
                              {ord.shippingAddress.city}, {ord.shippingAddress.state}
                            </>
                          ) : (
                            'Standard Courier Dispatch'
                          )}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedOrderTrackId(
                              expandedOrderTrackId === ord._id ? null : ord._id
                            )
                          }
                          className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-800 transition py-0.5"
                        >
                          <Truck size={14} />
                          <span>
                            {expandedOrderTrackId === ord._id
                              ? 'Hide Tracking Details'
                              : 'Track Shipment Live'}
                          </span>
                          {expandedOrderTrackId === ord._id ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                      </div>

                      {/* Interactive Visual Order Tracking Timeline */}
                      {expandedOrderTrackId === ord._id && (
                        <div className="mt-4 pt-4 border-t border-blue-100 bg-blue-50/40 rounded-2xl p-4 sm:p-5 space-y-4 animate-fade-in">
                          {/* Carrier and Tracking Metadata */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-200/60 text-xs">
                            <div>
                              <span className="font-bold text-gray-900 block">
                                DHL Express Worldwide
                              </span>
                              <span className="text-[11px] text-gray-500 font-mono">
                                Tracking #: TRK-{ord._id.substring(0, 8).toUpperCase()}-US
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] text-gray-500 block">
                                Estimated Delivery
                              </span>
                              <span className="font-bold text-emerald-700">
                                {new Date(new Date(ord.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          {/* 4-Step Progress Stepper */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Step 1: Placed */}
                            <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-2xs">
                              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
                                <CheckCircle2 size={14} />
                                <span>Order Placed</span>
                              </div>
                              <p className="text-[10px] text-gray-500">
                                {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
                                Completed
                              </span>
                            </div>

                            {/* Step 2: Quality Inspection */}
                            <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-2xs">
                              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold mb-1">
                                <CheckCircle2 size={14} />
                                <span>Inspection</span>
                              </div>
                              <p className="text-[10px] text-gray-500">Warehouse Hub</p>
                              <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
                                Passed QA
                              </span>
                            </div>

                            {/* Step 3: In Transit */}
                            <div className="bg-white rounded-xl p-3 border border-blue-300 shadow-2xs relative">
                              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold mb-1">
                                <Clock size={14} className="animate-spin" />
                                <span>In Transit</span>
                              </div>
                              <p className="text-[10px] text-gray-500">Sorting Facility</p>
                              <span className="text-[10px] font-bold text-blue-700 mt-1 block">
                                On The Way
                              </span>
                            </div>

                            {/* Step 4: Final Delivery */}
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-gray-400">
                              <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                                <Truck size={14} />
                                <span>Delivery</span>
                              </div>
                              <p className="text-[10px]">Your Doorstep</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                Pending Arrival
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHIPPING ADDRESS */}
          {currentTab === 'address' && (
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shipping & Billing Address</h2>
                <p className="text-xs text-gray-500">
                  Save your primary delivery location for instantaneous 1-click checkout
                </p>
              </div>

              <form onSubmit={handleUpdateAddress} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    placeholder="123 Tech Boulevard, Suite 400"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                      placeholder="San Francisco"
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                      placeholder="California"
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Postal Code / ZIP
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      required
                      placeholder="94103"
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Country
                    </label>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm transition disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Shipping Address'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SECURITY & CREDENTIALS */}
          {currentTab === 'security' && (
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Security & Credentials</h2>
                <p className="text-xs text-gray-500">
                  Update your authentication credentials, review sessions, and OAuth bindings
                </p>
              </div>

              {activeUser.oauthProvider && activeUser.oauthProvider !== 'local' ? (
                /* OAuth user info */
                <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-blue-600" size={24} />
                    <div>
                      <h4 className="font-bold text-sm text-blue-900">
                        Connected via {activeUser.oauthProvider.toUpperCase()} Single Sign-On
                      </h4>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Your account password and multi-factor authentication are securely managed by your {activeUser.oauthProvider.toUpperCase()} account.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Local user change password form */
                <form onSubmit={handleUpdatePassword} className="space-y-4 mb-8">
                  <h3 className="font-bold text-sm text-gray-900">Change Account Password</h3>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="min. 6 characters"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="repeat new password"
                        className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-black hover:bg-neutral-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-sm transition disabled:opacity-60"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Account Security Notice */}
              <div className="pt-6 border-t border-gray-100 text-xs text-gray-500">
                <p>
                  To keep your account secure, choose a strong password with a mix of letters and numbers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
