import { usersService } from '../backend/services/users.service.js';

onload = async () => {
  const form = document.getElementsByTagName('form')[0];
  form.onsubmit = async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleInput = document.getElementById('role');

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;

    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    nameInput.classList.remove('is-invalid', 'is-valid');
    emailInput.classList.remove('is-invalid', 'is-valid');
    passwordInput.classList.remove('is-invalid', 'is-valid');
    roleInput.classList.remove('is-invalid', 'is-valid');

    const passwordFeedback = document.getElementById('passwordFeedback');
    passwordFeedback.style.display = 'none';

    let formIsValid = true;

    if (!name.match(namePattern)) {
      nameInput.classList.add('is-invalid');
      formIsValid = false;
    } else {
      nameInput.classList.add('is-valid');
    }
    if (!email.match(emailPattern)) {
      emailInput.classList.add('is-invalid');
      formIsValid = false;
    } else {
      emailInput.classList.add('is-valid');
    }

    if (!password.match(passwordPattern)) {
      passwordInput.classList.add('is-invalid');
      passwordFeedback.style.display = 'block';
      formIsValid = false;
    } else {
      passwordInput.classList.add('is-valid');
    }
    if (!role) {
      roleInput.classList.add('is-invalid');
      formIsValid = false;
    } else {
      roleInput.classList.add('is-valid');
    }

    if (formIsValid) {
      try {
        const newUser = await usersService.register({
          name,
          email,
          password,
          role,
        });
        const successAlert = document.createElement('div');
        successAlert.classList.add('alert', 'alert-success');
        successAlert.innerHTML = `User ${newUser.name} has been successfully registered!`;
        form.appendChild(successAlert);

        setTimeout(() => {
          window.location.href = './home.html';
        }, 2000);
      } catch (error) {
        const errorAlert = document.createElement('div');
        errorAlert.classList.add('alert', 'alert-danger');
        errorAlert.innerText = error.message;
        form.appendChild(errorAlert);
      }
    }
  };
};
