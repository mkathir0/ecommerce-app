// Global script for navigation and event tracking across all MeShop pages

document.addEventListener('DOMContentLoaded', () => {
  // 1. Console log which button was clicked (Requirement: "make basic events on click of buttons, and console log which button was clicked")
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      console.log('Button clicked:', btn.innerText.trim() || btn.id || btn.className);
    }
  });

  // 2. Update navigation according to auth status
  updateNavbarState();

  // 3. Update Cart badge count
  updateCartBadge();
});

function updateNavbarState() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const navLinks = document.querySelector('.nav-links');

  if (navLinks) {
    const loginLink = navLinks.querySelector('a[href*="login.html"]');
    const signupLink = navLinks.querySelector('a[href*="signup.html"]');
    const profileLink = navLinks.querySelector('a[href*="profile.html"]');

    if (currentUser && currentUser.token) {
      // User is logged in
      if (loginLink) loginLink.parentElement.style.display = 'none';
      if (signupLink) signupLink.parentElement.style.display = 'none';
      if (profileLink) profileLink.parentElement.style.display = 'inline-block';
    } else {
      // User is logged out
      if (loginLink) loginLink.parentElement.style.display = 'inline-block';
      if (signupLink) signupLink.parentElement.style.display = 'inline-block';
    }
  }
}

function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge-count');
  if (cartBadge) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    cartBadge.innerText = totalCount;
  }
}
