// Profile Page Logic: View, Edit Information, and Logout

document.addEventListener('DOMContentLoaded', () => {
  // 1. Auth Guard: If the user isn't logged in make sure to remove them and take them back to login page
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser || !currentUser.token) {
    console.warn('Unauthorized access attempt to profile.html. Redirecting to login.html...');
    window.location.href = 'login.html';
    return;
  }

  // 2. Populate user information
  const firstNameInput = document.getElementById('profile-firstName');
  const lastNameInput = document.getElementById('profile-lastName');
  const emailInput = document.getElementById('profile-email');
  const userGreeting = document.getElementById('user-greeting');
  const tokenDisplay = document.getElementById('user-token');

  if (firstNameInput) firstNameInput.value = currentUser.firstName || '';
  if (lastNameInput) lastNameInput.value = currentUser.lastName || '';
  if (emailInput) emailInput.value = currentUser.email || '';
  if (userGreeting) userGreeting.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  if (tokenDisplay) tokenDisplay.textContent = currentUser.token || 'N/A';

  // 3. Handle Profile Update
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newFirstName = firstNameInput.value.trim();
      const newLastName = lastNameInput.value.trim();
      const oldPassword = document.getElementById('profile-oldPassword').value;
      const newPassword = document.getElementById('profile-newPassword').value;

      console.log('Profile update submitted:', { newFirstName, newLastName });

      if (!newFirstName || !newLastName) {
        showProfileAlert('First name and Last name cannot be empty!', 'error');
        return;
      }

      // Update in users array
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((u) => u.email === currentUser.email);

      if (userIndex !== -1) {
        if (newPassword) {
          if (!oldPassword) {
            showProfileAlert('Please enter your current password to set a new password!', 'error');
            return;
          }
          if (users[userIndex].password !== oldPassword) {
            showProfileAlert('Current password does not match!', 'error');
            return;
          }
          users[userIndex].password = newPassword;
        }

        users[userIndex].firstName = newFirstName;
        users[userIndex].lastName = newLastName;
        localStorage.setItem('users', JSON.stringify(users));

        // Update currentUser in localStorage
        currentUser.firstName = newFirstName;
        currentUser.lastName = newLastName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (userGreeting) {
          userGreeting.textContent = `${newFirstName} ${newLastName}`;
        }

        showProfileAlert('Profile updated successfully!', 'success');
        document.getElementById('profile-oldPassword').value = '';
        document.getElementById('profile-newPassword').value = '';
      } else {
        showProfileAlert('User record not found in database!', 'error');
      }
    });
  }

  // 4. Logout Functionality
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      console.log('Logout button clicked. Clearing currentUser session.');
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  }
});

function showProfileAlert(message, type = 'error') {
  const alertBox = document.getElementById('profile-alert');
  if (alertBox) {
    alertBox.textContent = message;
    alertBox.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    alertBox.style.display = 'block';
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3500);
  } else {
    alert(message);
  }
}
