import { usersService } from '../backend/services/users.service.js';

onload = async () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const adminPage = './home.html';
  const sellerPage = './home.html';
  const customerPage = './home.html';

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  form.onsubmit = async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    emailInput.classList.remove('is-invalid', 'is-valid');
    passwordInput.classList.remove('is-invalid', 'is-valid');
    passwordFeedback.style.display = 'none';

    let formIsValid = true;

    if (!email) {
      emailInput.classList.add('is-invalid');
      formIsValid = false;
    } else if (!email.match(emailPattern)) {
      emailInput.classList.add('is-invalid');
      formIsValid = false;
    } else {
      emailInput.classList.add('is-valid');
    }

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
    } else {
      passwordInput.classList.add('is-valid');
    }

    if (formIsValid) {
      try {
        await usersService.login({ email, password });

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
        const successAlert = document.createElement('div');
        successAlert.classList.add('alert', 'alert-success');
        successAlert.innerHTML = `User ${newUser.name} has been successfully registered!`;
        form.appendChild(successAlert);
      } catch (error) {
        const errorAlert = document.createElement('div');
        errorAlert.classList.add('alert', 'alert-danger');
        errorAlert.innerText = error.message;
        form.appendChild(errorAlert);
      }
    }
  };
};
