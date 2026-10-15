// Authentication Logic: Signup & Login

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

// ---------------------------------------------------------------------
// SIGNUP PAGE LOGIC
// ---------------------------------------------------------------------
function initSignup() {
  const signupForm = document.getElementById('signup-form');
  const alertBox = document.getElementById('alert-message');

  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Store all inputs in variables
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 2. Console log all inputs on click of signup button
    console.log('Signup Button Clicked! Input values:');
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    // 3. Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showAlert('All fields are mandatory!', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Passwords do not match! Please verify.', 'error');
      return;
    }

    if (password.length < 4) {
      showAlert('Password must be at least 4 characters long.', 'error');
      return;
    }

    // 4. Retrieve existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 5. Check if email is already used
    const userExists = users.some((u) => u.email === email);
    if (userExists) {
      showAlert('An account with this email already exists! Please login instead.', 'error');
      return;
    }

    // 6. Save new user into users array in localStorage
    const newUser = {
      firstName,
      lastName,
      email,
      password, // In real life hash it, but this is client localStorage contest
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showAlert('Account created successfully! Redirecting to login...', 'success');

    // Clear form
    signupForm.reset();

    // Redirect to login page after short delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });
}

// ---------------------------------------------------------------------
// LOGIN PAGE LOGIC
// ---------------------------------------------------------------------
function initLogin() {
  const loginForm = document.getElementById('login-form');
  const alertBox = document.getElementById('alert-message');

  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Store all inputs in variables
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    // 2. Console log all inputs on click of login button
    console.log('Login Button Clicked! Input values:');
    console.log('Email:', email);
    console.log('Password:', password);

    // 3. Validation
    if (!email || !password) {
      showAlert('Please enter both email and password.', 'error');
      return;
    }

    // 4. Check users array in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const matchedUser = users.find((u) => u.email === email);

    if (!matchedUser) {
      showAlert('No user found with this email. Please check or sign up.', 'error');
      return;
    }

    if (matchedUser.password !== password) {
      showAlert('Incorrect password! Please try again.', 'error');
      return;
    }

    // 5. Generate a random 16-byte string token
    const token = generate16ByteToken();
    console.log('Generated 16-byte session token:', token);

    // 6. Save currentUser in localStorage
    const currentUser = {
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      email: matchedUser.email,
      token: token,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    showAlert('Login successful! Redirecting to shop...', 'success');

    // 7. Redirect to shop.html
    setTimeout(() => {
      window.location.href = 'shop.html';
    }, 900);
  });
}

function showAlert(message, type = 'error') {
  const alertBox = document.getElementById('alert-message');
  if (alertBox) {
    alertBox.textContent = message;
    alertBox.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.style.display = 'block';
  } else {
    alert(message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSignup();
  initLogin();
});
