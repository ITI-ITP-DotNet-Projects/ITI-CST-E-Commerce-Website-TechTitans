import { usersService } from '../backend/services/users.service.js';
import { productsService } from '../backend/services/products.service.js';
import { renderNavBar } from './common/navbar.component.js';

export function createProductionChart(textContent) {
  var xValues = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var yValues = [55, 49, 44, 24, 15, 30, 50, 25, 40, 15, 24, 44];
  var barColors = [
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
    '#ff644c',
  ];
  var canvas = document.getElementById('myChart');
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  canvas.style.width = '80%';
  canvas.style.maxWidth = '800px';
  new Chart('myChart', {
    type: 'bar',
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: textContent,
      },
    },
  });
}

window.onload = async () => {
  await renderNavBar();

  createProductionChart('Sales Insights');

  const users = await usersService.getUsers({});
  const nonAdminUsers = users.filter((user) => user.role == 'seller');
  const userCount = nonAdminUsers.length;
  const userCountElement = document.querySelector('.card-body h2');
  if (userCountElement) {
    userCountElement.textContent = userCount;
  }

  const customers = users.filter((user) => user.role === 'customer');
  const customerCount = customers.length;
  const customerCountElement = document.querySelector('.roles-container');

  if (customerCountElement) {
    customerCountElement.textContent = customerCount;
  }
  displayCustomerCount();
  displaySellerCount();

  const productCount = await productsService.countProducts({});

  const productCountElement = document.querySelector('.product-container');
  console.log(productCountElement);
  if (productCountElement) {
    productCountElement.textContent = productCount;
  }
};

async function displayCustomerCount() {
  try {
    const users = await usersService.getUsers({});
    const customerCount = users.filter(
      (user) => user.role === 'customer'
    ).length;
    updateUserCount(customerCount, '.customer-count');
  } catch (error) {
    console.error('Error fetching customer count:', error);
  }
}

async function displaySellerCount() {
  try {
    const users = await usersService.getUsers({});
    const sellerCount = users.filter((user) => user.role === 'seller').length;
    updateUserCount(sellerCount, '.seller-count');
  } catch (error) {
    console.error('Error fetching seller count:', error);
  }
}

function updateUserCount(count, selector) {
  const userCountElement = document.querySelector(selector);
  if (userCountElement) {
    userCountElement.textContent = count;
  }
}
