import { renderNavBar } from './common/navbar.component.js';
import { ordersService } from '../backend/services/orders.service.js';
import { renderTemplate } from '../backend/utils/renderTemplate.js';
import { usersService } from '../backend/services/users.service.js';
import { orderItemsService } from '../backend/services/orderItems.service.js';
import { productsService } from '../backend/services/products.service.js';
import { OrderItem } from '../backend/models/orderItems.model.js';

/**
 * @param {number} orderId
 * @returns {Promise<void>}
 */
async function renderOrderSummary(orderId) {
  const statusClasses = {
    pending: 'secondary', // Grey
    confirmed: 'info', // Light Blue
    completed: 'success', // Green
    canceled: 'danger', // Red
  };

  const [order] = await ordersService.getOrders({
    filterOptions: {
      id: orderId,
    },
  });

  const [user] = await usersService.getUsers({ id: order.customerId });

  const orderInformationTemplate = `<div class="col-md-6">
                  <h5 class="mb-3">Order Information</h5>
                  <p><strong>Order ID:</strong> #{{orderId}}</p>
                  <p>
                    <strong>Status:</strong>
                    <span class="badge bg-{{statusClass}}">{{orderStatus}}</span>
                  </p>
                  <p><strong>Order Date:</strong> {{orderDate}}</p>
                  <p><strong>Total Price:</strong> &pound;{{totPrice}}</p>
                </div>`;

  const customerInformationTemplate = `<h5 class="mb-3">Customer Information</h5>
                  <p>
                    <strong>Name:</strong>{{customerName}}
                  </p>
                  <p>
                    <strong>Email:</strong>
                    {{customerEmail}}
                  </p>
                  <p><strong>Phone:</strong> {{customerPhone}}</p>
                  <p>
                    <strong>Address:</strong> {{customerAddress}}
                  </p>`;

  document.getElementById('orderInformation').innerHTML = renderTemplate(
    orderInformationTemplate,
    {
      orderId,
      statusClass: statusClasses[order.status],
      orderStatus: order.status,
      totPrice: order.totalPrice,
      orderDate: new Date(order.createdAt).toISOString(),
    }
  );

  const customerName =
    order?.shippingDetails?.firstName && order?.shippingDetails?.lastName
      ? `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
      : user.name;

  document.getElementById('customerInformation').innerHTML = renderTemplate(
    customerInformationTemplate,
    {
      customerName,
      customerEmail: order?.shippingDetails?.email || user.email,
      customerPhone: order?.shippingDetails?.phoneNumber ?? 'N/A',
      customerAddress: order?.shippingDetails?.address ?? 'N/A',
    }
  );

  document
    .getElementById('completeOrderBtn')
    .addEventListener('click', async (e) => {
      await ordersService.updateOrder(order.id, {
        status: 'completed',
      });
      renderOrderSummary(order.id);
    });

  document
    .getElementById('cancelOrderBtn')
    .addEventListener('click', async (e) => {
      await ordersService.updateOrder(order.id, {
        status: 'canceled',
      });
      renderOrderSummary(order.id);
    });
}

/**
 * @param {OrderItem} orderItem
 * @returns {Promise<string>}
 */
async function renderOrderItem(orderItem) {
  const orderItemTemplate = `<tr>
                      <td>{{itemId}}</td>
                      <td>{{productName}}</td>
                      <td>{{quantity}}</td>
                      <td>{{sellerEmail}}</td>
                    </tr>`;

  const [product] = await productsService.getProducts({
    filterOptions: {
      id: orderItem.productId,
    },
  });

  const [user] = await usersService.getUsers({ id: product.sellerId });

  return renderTemplate(orderItemTemplate, {
    itemId: orderItem.id,
    productName: product.name,
    quantity: orderItem.quantity,
    sellerEmail: user.email,
  });
}

/**
 * @param {number} orderId
 * @param {Promise<void>}
 */
async function renderOrderItems(orderId) {
  const orderItems = await orderItemsService.getOrderItems({
    filterOptions: {
      orderId,
    },
  });

  document.querySelector('tbody').innerHTML = (
    await Promise.all(orderItems.map((item) => renderOrderItem(item)))
  ).join('');
}

onload = async () => {
  const loggedInUser = await usersService.getCurrentLoggedInUser();
  if (
    !localStorage.getItem('orderId') ||
    !loggedInUser ||
    loggedInUser.role != 'admin'
  ) {
    window.location.href = 'home.html';
  } else {
    await renderNavBar();
    let orderId = +localStorage.getItem('orderId');
    await renderOrderSummary(orderId);
    await renderOrderItems(orderId);
  }
};
