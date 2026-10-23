import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const API_BASE = '/api/auth';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user') || localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Sync state into localStorage
  const saveSession = useCallback((userData, jwtToken) => {
    if (userData && jwtToken) {
      const normalizedUser = {
        ...userData,
        token: jwtToken,
        // Support legacy firstName/lastName consumers as well as full name
        firstName: userData.name ? userData.name.split(' ')[0] : 'User',
        lastName: userData.name && userData.name.split(' ').length > 1
          ? userData.name.split(' ').slice(1).join(' ')
          : '',
      };
      setUser(normalizedUser);
      setToken(jwtToken);
      try {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
      } catch (err) {
        console.error('Failed to write user session to storage', err);
      }
      return normalizedUser;
    } else {
      setUser(null);
      setToken(null);
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
      } catch (err) {
        console.error('Failed to clear storage session', err);
      }
      return null;
    }
  }, []);

  // Validate and rehydrate session from backend on app launch
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.user) {
            if (isMounted) {
              saveSession(data.user, storedToken);
            }
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          console.warn('Session expired. Logging out.');
          if (isMounted) {
            saveSession(null, null);
          }
        }
      } catch (err) {
        console.warn('Backend verification unreachable, maintaining cached session:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [saveSession]);

  // Standard Login
  const login = async (email, password) => {
    console.log('Authenticating user login:', email);

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid email or password');
    }

    const activeUser = saveSession(data.user, data.user.token);
    return activeUser;
  };

  // Standard Signup
  const signup = async (payload) => {
    console.log('Registering user account:', payload.email);

    let fullName = payload.name;
    if (!fullName && (payload.firstName || payload.lastName)) {
      fullName = `${(payload.firstName || '').trim()} ${(payload.lastName || '').trim()}`.trim();
    }

    if (!fullName || !payload.email || !payload.password) {
      throw new Error('Name, email, and password are required.');
    }

    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fullName,
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        phone: payload.phone || '',
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed');
    }

    const activeUser = saveSession(data.user, data.user.token);
    return activeUser;
  };

  // OAuth Login / Signup (Google, GitHub, etc.)
  const oauthLogin = async ({ provider = 'google', email, name, avatar, oauthId, idToken }) => {
    console.log(`Processing ${provider} OAuth authentication:`, email);

    if (!email) {
      throw new Error('OAuth authentication did not provide an email address.');
    }

    const res = await fetch(`${API_BASE}/oauth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        email: email.trim().toLowerCase(),
        name,
        avatar,
        oauthId,
        idToken,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || `${provider} authentication failed`);
    }

    const activeUser = saveSession(data.user, data.user.token);
    return activeUser;
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    if (!token) throw new Error('You must be signed in to update your profile.');

    // Support both object payload and positional legacy arguments (firstName, lastName, oldPassword, newPassword)
    let bodyPayload = {};
    if (typeof profileData === 'string') {
      const [firstName, lastName, oldPassword, newPassword] = arguments;
      bodyPayload = {
        name: `${firstName} ${lastName}`.trim(),
        oldPassword,
        password: newPassword,
      };
    } else {
      bodyPayload = { ...profileData };
    }

    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyPayload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }

    const updatedUser = saveSession(data.user, data.user.token || token);
    return updatedUser;
  };

  // Refresh profile from server
  const refreshProfile = async () => {
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          return saveSession(data.user, token);
        }
      }
    } catch (e) {
      console.warn('Failed to refresh profile:', e.message);
    }
    return null;
  };

  // Logout
  const logout = () => {
    console.log('Logging out user');
    saveSession(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user, // Alias for backward compatibility
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login,
        signup,
        register: signup, // Alias for backward compatibility
        oauthLogin,
        updateProfile,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
