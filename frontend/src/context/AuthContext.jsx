import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const BACKEND_API = 'http://localhost:5001/api/auth';

// Helper function to generate a random 16-byte token (hex string)
function generate16ByteToken() {
  const bytes = new Uint8Array(16);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const signup = async ({ firstName, lastName, email, password, confirmPassword }) => {
    // 1. Console log all inputs on click of signup button
    console.log('Signup Action Executed. Captured inputs:', {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      throw new Error('All fields are mandatory!');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match! Please check again.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email already used in localStorage
    const userExists = users.some((u) => u.email === cleanEmail);
    if (userExists) {
      throw new Error('An account with this email already exists! Please log in.');
    }

    // Connect to Node.js Backend API
    try {
      await fetch(`${BACKEND_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: cleanEmail,
          password,
        }),
      });
      console.log('Synced new user registration with Node.js backend API');
    } catch (apiErr) {
      console.warn('Node.js backend unreachable, continuing with local storage:', apiErr.message);
    }

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  };

  const login = async (email, password) => {
    // 1. Console log inputs on click of login button
    console.log('Login Action Executed. Captured inputs:', { email, password });

    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find((u) => u.email === cleanEmail);

    if (!matchedUser) {
      throw new Error('No user found with this email. Please sign up first.');
    }

    if (matchedUser.password !== password) {
      throw new Error('Incorrect password! Please try again.');
    }

    // Generate random 16-byte token
    const token = generate16ByteToken();
    console.log('Generated 16-byte session token:', token);

    // Call Node.js Backend API
    try {
      await fetch(`${BACKEND_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      console.log('Authenticated session with Node.js backend API');
    } catch (apiErr) {
      console.warn('Node.js backend sync skipped:', apiErr.message);
    }

    const userSession = {
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      email: matchedUser.email,
      token,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('currentUser', JSON.stringify(userSession));
    setCurrentUser(userSession);
    return userSession;
  };

  const updateProfile = async (newFirstName, newLastName, oldPassword, newPassword) => {
    if (!currentUser) throw new Error('Not logged in');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);

    if (userIndex === -1) {
      throw new Error('User record not found in storage');
    }

    if (newPassword) {
      if (!oldPassword) {
        throw new Error('Please enter your current password to set a new password');
      }
      if (users[userIndex].password !== oldPassword) {
        throw new Error('Current password is incorrect');
      }
      users[userIndex].password = newPassword;
    }

    users[userIndex].firstName = newFirstName;
    users[userIndex].lastName = newLastName;
    localStorage.setItem('users', JSON.stringify(users));

    const updatedUser = {
      ...currentUser,
      firstName: newFirstName,
      lastName: newLastName,
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const logout = () => {
    console.log('User logged out. Removing currentUser from localStorage.');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
