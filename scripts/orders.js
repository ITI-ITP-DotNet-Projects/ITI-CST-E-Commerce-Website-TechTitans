import { renderNavBar } from './common/navbar.component.js';
import { Order } from '../backend/models/orders.model.js';
import { renderTemplate } from '../backend/utils/renderTemplate.js';
import { usersService } from '../backend/services/users.service.js';
import { ordersService } from '../backend/services/orders.service.js';

/**
 * @param {Order} order
 * @returns {string}
 */
async function renderOrder(order) {
  const statusClasses = {
    pending: 'secondary', // Grey
    confirmed: 'info', // Light Blue
    shipped: 'warning', // Yellow
    delivered: 'success', // Green
    canceled: 'danger', // Red
  };

  const [user] = await usersService.getUsers({
    id: order.customerId,
  });

  // Format the date
  const formattedDate = new Date(order.createdAt).toLocaleString();

  const orderTemplate = `<tr>
      <td>{{orderId}}</td>
      <td>{{customerName}}</td>
      <td>
        <span class="badge bg-{{statusClass}}">{{orderStatus}}</span>
      </td>
      <td>{{orderDate}}</td>
      <td><a href="#" class="btn btn-sm view-btn" data-orderid="{{orderId}}">View</a></td>
    </tr>
  `;

  return renderTemplate(orderTemplate, {
    orderId: order.id,
    customerName: user.name,
    orderStatus: order.status,
    statusClass: statusClasses[order.status],
    orderDate: formattedDate, // Pass the formatted date
  });
}

/**
 * @param {Order[]} orders
 * @returns {Promise<void>}
 */
async function renderOrders(orders) {
  document.querySelector('tbody').innerHTML = (
    await Promise.all(orders.map((order) => renderOrder(order)))
  ).join('');

  // Register events on view button
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('orderId', e.target.dataset.orderid);
      window.location.href = 'orderdetails.html';
    });
  });
}

function handleFilters() {
  const orderIdInput = document.getElementById('orderIdFilter');
  const customerNameInput = document.getElementById('customerNameFilter');
  const createdAtInput = document.getElementById('createdAtFilter');
  const statusInput = document.getElementById('orderStatusFilter');

  const filterOptions = {};

  // Function to fetch and apply filters
  const applyFilters = async () => {
    console.log(filterOptions);
    // Handle customerName filter by finding matching user
    if (filterOptions.customerName) {
      const nameToMatch = filterOptions.customerName.toLowerCase();
      const users = await usersService.getUsers({});
      const matchedUser = users.find((user) =>
        user.name.toLowerCase().includes(nameToMatch)
      );

      if (matchedUser) {
        filterOptions.customerId = matchedUser.id;
      } else {
        filterOptions.customerId = null; // No matches, set to undefined
      }
      delete filterOptions.customerName; // Clear customerName to prevent backend issues
    }

    // Fetch filtered orders
    const filteredOrders = await ordersService.getOrders({
      filterOptions: Object.keys(filterOptions).length
        ? filterOptions
        : undefined,
    });
    renderOrders(filteredOrders);
  };

  // Event listeners for filter inputs
  orderIdInput.addEventListener('input', (e) => {
    const id = e.target.value ? parseInt(e.target.value) : undefined;
    if (!id) {
      delete filterOptions?.id;
    } else {
      filterOptions.id = id;
    }
    applyFilters();
  });

  customerNameInput.addEventListener('input', (e) => {
    const name = e.target.value.trim();
    if (name.length == 0) {
      delete filterOptions?.customerName;
      delete filterOptions?.customerId;
    } else {
      filterOptions.customerName = name;
    }
    applyFilters();
  });

  createdAtInput.addEventListener('input', (e) => {
    const createdAt = e.target.value || undefined;

    if (!createdAt) {
      delete filterOptions?.createdAt;
    } else {
      // Store a callback function to match the date only
      filterOptions.createdAt = (orderDate) => {
        const inputDate = new Date(createdAt).toISOString().split('T')[0]; // Extract the date part
        const orderDateOnly = new Date(orderDate).toISOString().split('T')[0];
        return inputDate === orderDateOnly; // Compare only the date part
      };
    }
    applyFilters();
  });

  statusInput.addEventListener('change', (e) => {
    if (e.target.value == 'all') {
      delete filterOptions?.status;
    } else {
      filterOptions.status = e.target.value || undefined;
    }
    applyFilters();
  });
}

onload = async () => {
  await renderNavBar();
  await renderOrders(await ordersService.getOrders({})); // Load all orders initially
  handleFilters();
};
