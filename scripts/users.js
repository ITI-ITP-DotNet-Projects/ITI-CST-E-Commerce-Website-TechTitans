import { renderNavBar } from './common/navbar.component.js';
import { usersService } from '../backend/services/users.service.js';
import { renderTemplate } from '../backend/utils/renderTemplate.js';

window.onload = async () => {
  await renderNavBar();
  try {
    const loggedInUser = await usersService.getCurrentLoggedInUser();

    if (!loggedInUser) {
      window.location.href = './signin.html';
      return;
    }

    const users = await usersService.getUsers({});
    const nonAdminUsers = users.filter((user) => user.role !== 'admin');
    populateUsersTable(nonAdminUsers);
    document.getElementById('search-input').addEventListener('input', () => {
      searchUsersByName(nonAdminUsers);
    });
    const userCount = nonAdminUsers.length;
    const userCountElement = document.querySelector('.card-body h2');
    if (userCountElement) {
      userCountElement.textContent = userCount;
    }

    document.getElementById('roleSelect').addEventListener('change', (e) => {
      const role = e.target.value == 'all' ? undefined : e.target.value;
      filterUsersByRole(nonAdminUsers, role);
    });
  } catch (error) {
    console.error('Error during onload:', error);
  }
};

/**
 * @param {Array} users
 */
function populateUsersTable(users) {
  const tableBody = document.querySelector('table tbody');
  tableBody.innerHTML = '';

  users.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = renderUserRow(user);
    tableBody.appendChild(row);
  });
}

function searchUsersByName(users) {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  populateUsersTable(filteredUsers);
}

function filterUsersByRole(users, role) {
  let filteredUsers = users;

  if (role) {
    filteredUsers = users.filter(
      (user) => user.role.toLowerCase() === role.toLowerCase()
    );
  }
  populateUsersTable(filteredUsers);
}
/**
 * @param {Object} user
 * @returns {string}
 */
function renderUserRow(user) {
  const template = `
   
    <td>{{name}}</td>
    <td><img src="../imgs/{{avatar}}" style="width: 50px; height: 50px; border-radius:50%"></td>
    <td>{{email}}</td>
    <td>{{role}}</td>
  `;

  const data = {
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    role: user.role,
  };

  return renderTemplate(template, data);
}
