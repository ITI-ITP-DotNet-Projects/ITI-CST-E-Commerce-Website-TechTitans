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

  const orderTemplate = `<tr class="table-{{statusClass}}">
      <td>{{orderId}}</td>
      <td>{{customerName}}</td>
      <td>
        <span class="badge bg-{{statusClass}}">{{orderStatus}}</span>
      </td>
      <td>{{orderDate}}</td>
      <td><a href="#" class="btn btn-primary btn-sm view-btn" data-orderid={{orderId}}>View</a></td>
    </tr>
  `;

  return renderTemplate(orderTemplate, {
    orderId: order.id,
    customerName: user.name,
    orderStatus: order.status,
    statusClass: statusClasses[order.status],
    orderDate: order.createdAt.toLocaleString(),
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
  registerEventListeners();
}

function registerEventListeners() {
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('orderId', e.target.dataset.orderid);
      window.location.href = 'orderdetails.html';
    });
  });
}
onload = async () => {
  await renderNavBar();
  // const orders = await ordersService.getOrders({});
  // NOTE:delete this static array and load data dynamically from ordersService
  const orders = [
    {
      createdAt: '2025-01-14T15:51:08.213Z',
      customerId: 20903,
      id: 81102,
      status: 'pending',
      totalPrice: 133832,
    },
    {
      createdAt: '2025-01-14T15:51:08.213Z',
      customerId: 20903,
      id: 81102,
      status: 'confirmed',
      totalPrice: 133832,
    },
    {
      createdAt: '2025-01-14T15:51:08.213Z',
      customerId: 20903,
      id: 81102,
      status: 'shipped',
      totalPrice: 133832,
    },
    {
      createdAt: '2025-01-14T15:51:08.213Z',
      customerId: 20903,
      id: 81102,
      status: 'delivered',
      totalPrice: 133832,
    },
    {
      createdAt: '2025-01-14T15:51:08.213Z',
      customerId: 20903,
      id: 81102,
      status: 'canceled',
      totalPrice: 133832,
    },
  ];
  await renderOrders(orders);

  // handle logic here
};
