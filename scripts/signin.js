import { usersService } from '../backend/services/users.service.js';

onload = async () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const adminPage = './home.html';
  const sellerPage = './home.html';
  const customerPage = './home.html';
  // Handle form submission
  form.onsubmit = async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous feedback
    passwordFeedback.style.display = 'none';

    try {
      // Call login function from usersService
      await usersService.login({ email, password });

      // Get current logged-in user
      const loggedInUser = await usersService.getCurrentLoggedInUser();

      if (!loggedInUser) {
        alert('Unable to retrieve logged-in user information.');
      }

      switch (loggedInUser.role) {
        case 'admin':
          window.location.href = adminPage;
          break;
        case 'seller':
          window.location.href = sellerPage;
          break;
        case 'customer':
          window.location.href = customerPage;
          break;
        default:
          alert('Unknown role. Please contact support.');
      }
    } catch (error) {
      // Display error feedback
      passwordFeedback.style.display = 'block';
      passwordFeedback.textContent = error.message;
    }
  };
};
