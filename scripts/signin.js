import { usersService } from '../backend/services/users.service.js';
import { renderNavBar } from './common/navbar.component.js';

onload = async () => {
  await renderNavBar();
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const passwordToggle = document.getElementById('passwordToggle');
  const adminPage = './dashboard.html';
  const sellerPage = './dashboard.html';
  const customerPage = './home.html';

  // Password toggle functionality
  passwordToggle.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.querySelector('i').classList.replace('bi-eye', 'bi-eye-slash'); // Change icon
    } else {
      passwordInput.type = 'password';
      this.querySelector('i').classList.replace('bi-eye-slash', 'bi-eye'); // Change icon
    }
  });

  // Allow keyboard interaction (e.g., pressing Enter or Space)
  passwordToggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default behavior (e.g., scrolling)
      this.click(); // Trigger the click event
    }
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  // Function to display an alert
  const displayAlert = (message, type) => {
    // Remove any existing alerts
    const existingAlert = form.querySelector('.alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    // Create a new alert
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`);
    alert.innerHTML = message;

    // Append the alert to the form
    form.prepend(alert); // Add the alert at the top of the form
  };

  form.onsubmit = async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Reset validation states
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    passwordFeedback.style.display = 'none';

    let formIsValid = true;

    // Validate email
    if (!email) {
      emailInput.classList.add('is-invalid');
      formIsValid = false;
    } else if (!email.match(emailPattern)) {
      emailInput.classList.add('is-invalid');
      formIsValid = false;
    }

    // Validate password
    if (!password) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.style.display = 'none';
      formIsValid = false;
    } else if (!password.match(passwordPattern)) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.style.display = 'block';
      passwordFeedback.textContent =
        'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number.';
      formIsValid = false;
    }

    // If form is valid, proceed with login
    if (formIsValid) {
      try {
        await usersService.login({ email, password });

        const loggedInUser = await usersService.getCurrentLoggedInUser();

        if (!loggedInUser) {
          displayAlert(
            'Unable to retrieve logged-in user information.',
            'danger'
          );
          return;
        }

        // Redirect based on user role
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
            displayAlert('Unknown role. Please contact support.', 'danger');
        }

        // Display success alert
        displayAlert('Logged in successfully!', 'success');
      } catch (error) {
        // Display error alert
        displayAlert(error.message, 'danger');
      }
    }
  };
};
