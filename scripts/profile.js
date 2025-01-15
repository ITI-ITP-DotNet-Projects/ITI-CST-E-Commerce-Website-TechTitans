import { renderNavBar } from './common/navbar.component.js';
import { usersService } from '../backend/services/users.service.js';

const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const passwordInput = document.querySelector('#password');
const passwordFeedback = document.getElementById('passwordFeedback');
const emailInput = document.querySelector('#email');
const firstNameFeedback = document.getElementById('firstNameFeedback');
const lastNameFeedback = document.getElementById('lastNameFeedback');
const emailFeedback = document.getElementById('emailFeedback');
const userNameLabel = document.querySelector('#userName');
const userEmailLabel = document.querySelector('#userEmail');
const togglePasswordElement = document.querySelector('#togglePassword');
const logoutBtn = document.querySelector('#logoutBtn');
const editBtn = document.querySelector('#editButton');
let loggedInUser = null;

// Patterns for validation
const namePattern = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/; // Accepts only letters and spaces
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

function registerEvents() {
  togglePasswordElement.addEventListener('click', () => {
    const type =
      passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePasswordElement.querySelector('i').classList.toggle('bi-eye');
    togglePasswordElement.querySelector('i').classList.toggle('bi-eye-slash');
  });

  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await usersService.logout();
    window.location.href = 'home.html';
  });

  editBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = document.querySelector('#accountDetailsForm');

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isFormValid = true;

    const resetValidationFeedback = (input, feedbackElement) => {
      input.classList.remove('is-valid', 'is-invalid');
      feedbackElement.textContent = '';
    };

    resetValidationFeedback(firstNameInput, firstNameFeedback);
    resetValidationFeedback(lastNameInput, lastNameFeedback);
    resetValidationFeedback(emailInput, emailFeedback);
    resetValidationFeedback(passwordInput, passwordFeedback);

    // First Name Validation
    if (!firstName.match(namePattern)) {
      firstNameInput.classList.add('is-invalid');
      firstNameFeedback.textContent =
        'First name must only contain letters and spaces.';
      isFormValid = false;
    } else {
      firstNameInput.classList.add('is-valid');
    }

    // Last Name Validation
    if (!lastName.match(namePattern)) {
      lastNameInput.classList.add('is-invalid');
      lastNameFeedback.textContent =
        'Last name must only contain letters and spaces.';
      isFormValid = false;
    } else {
      lastNameInput.classList.add('is-valid');
    }

    // Email Validation
    if (!email.match(emailPattern)) {
      emailInput.classList.add('is-invalid');
      emailFeedback.textContent = 'Enter a valid email address.';
      isFormValid = false;
    } else {
      emailInput.classList.add('is-valid');
    }

    // Password Validation
    if (!password.match(passwordPattern)) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.textContent =
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.';
      isFormValid = false;
    } else {
      passwordInput.classList.add('is-valid');
    }

    if (isFormValid) {
      try {
        await usersService.updateUser(loggedInUser.id, {
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        });
        const successAlert = document.createElement('div');
        successAlert.classList.add('alert', 'alert-success');
        successAlert.innerHTML = `Profile updated successfully!`;
        form.appendChild(successAlert);
        window.location.href = 'profile.html';
      } catch (error) {
        const errorAlert = document.createElement('div');
        errorAlert.classList.add('alert', 'alert-danger');
        errorAlert.innerText = error.message;
        form.appendChild(errorAlert);
      }
    }
  });
}

async function renderProfileData() {
  loggedInUser = await usersService.getCurrentLoggedInUser();

  if (!loggedInUser) {
    window.location.href = 'signin.html';
    return;
  }

  const { id, name, email, password, role, avatar } = loggedInUser;

  firstNameInput.value = name.split(' ')[0];
  lastNameInput.value = name.split(' ')[1] || '';
  passwordInput.value = password;
  emailInput.value = email;
  userNameLabel.innerHTML = name;
  userEmailLabel.innerHTML = email;

  if (role !== 'customer') {
    document.querySelector('#orderItem').classList.add('d-none');
    document.querySelector('#cartItem').classList.add('d-none');
  }
}

onload = async () => {
  await renderNavBar();
  await renderProfileData();
  registerEvents();
};
