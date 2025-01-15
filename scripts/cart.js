import { renderNavBar } from './common/navbar.component.js';
import { usersService } from '../backend/services/users.service.js';
import { shoppingCartsService } from '../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../backend/services/shoppingCartItems.service.js';
import { productsService } from '../backend/services/products.service.js';
import { ordersService } from '../backend/services/orders.service.js';
import { orderItemsService } from '../backend/services/orderItems.service.js';
import { OrderItem } from '../backend/models/orderItems.model.js';
import { showErrorMessage } from './common/showErrorMessage.js';
import { showSuccessMessage } from './common/showSuccessMessage.js';

let loggedInUser = null;
let shoppingCart = null;
let shoppingCartItems = null;
const cartItemsBx = document.querySelector('#cartItemsBx');
const summaryTotalPriceElement = document.querySelector('#total');
const checkoutBtn = document.querySelector('#checkoutBtn');

async function authenticate() {
  loggedInUser = await usersService.getCurrentLoggedInUser();

  if (!loggedInUser || loggedInUser.role != 'customer') {
    window.location.href = 'signin.html';
  }
}

async function fetchData() {
  [shoppingCart] = await shoppingCartsService.getShoppingCarts({
    filterOptions: {
      customerId: loggedInUser.id,
    },
  });

  shoppingCartItems = await shoppingCartItemsService.getShoppingCartItems({
    filterOptions: {
      cartId: shoppingCart.id,
    },
  });
}

function updateSummary(cartItems, productMap) {
  // Calculate total price of all items
  const total = cartItems.reduce((sum, item) => {
    const product = productMap[item.productId] || {};
    return sum + (product.price || 0) * item.quantity;
  }, 0);

  // Update the total price display
  summaryTotalPriceElement.value = `£${total.toFixed(2)}`;

  // Disable checkout button if cart is empty
  checkoutBtn.disabled = cartItems.length === 0;
}

function addCartEventListeners(productMap) {
  document.querySelectorAll('.quantity-increase').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const itemId = +e.target.dataset.itemId;
      const productId = parseInt(e.target.dataset.productId, 10);
      const product = productMap[productId] || {};

      const quantityDisplay = e.target.previousElementSibling;
      const decreaseButton =
        e.target.previousElementSibling.previousElementSibling;
      const totalDisplay = e.target
        .closest('.card-body')
        .querySelector('.item-total');

      let currentQuantity = parseInt(quantityDisplay.textContent, 10);
      const availableStock = product.stock || 0;

      // Prevent jumping to full stock
      if (currentQuantity < availableStock) {
        currentQuantity++; // Increment by 1
        quantityDisplay.textContent = currentQuantity;

        // Enable/disable buttons based on quantity
        e.target.disabled = currentQuantity === availableStock; // Disable increase if at stock
        decreaseButton.disabled = currentQuantity === 1; // Disable decrease if at 1

        // Update the total price for this item dynamically
        const newTotal = currentQuantity * product.price;
        totalDisplay.textContent = `Total: $${newTotal.toFixed(2)}`;

        try {
          // Update quantity on the server
          await shoppingCartItemsService.updateShoppingCartItem(itemId, {
            quantity: currentQuantity,
          });
          renderCart();
        } catch (error) {
          console.error('Error increasing item quantity:', error.message);
          // Roll back UI if there's an error
          quantityDisplay.textContent = currentQuantity - 1;
        }
      }
    });
  });

  document.querySelectorAll('.quantity-decrease').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const itemId = +e.target.dataset.itemId;
      const productId = parseInt(e.target.dataset.productId, 10);
      const product = productMap[productId] || {};

      const quantityDisplay = e.target.nextElementSibling;
      const increaseButton = e.target.nextElementSibling.nextElementSibling;
      const totalDisplay = e.target
        .closest('.card-body')
        .querySelector('.item-total');

      let currentQuantity = parseInt(quantityDisplay.textContent, 10);

      // Prevent resetting to 1
      if (currentQuantity > 1) {
        currentQuantity--; // Decrement by 1
        quantityDisplay.textContent = currentQuantity;

        // Enable/disable buttons based on quantity
        e.target.disabled = currentQuantity === 1; // Disable decrease if at 1
        increaseButton.disabled = false; // Enable increase if not at stock limit

        // Update the total price for this item dynamically
        const newTotal = currentQuantity * product.price;
        totalDisplay.textContent = `Total: $${newTotal.toFixed(2)}`;

        try {
          // Update quantity on the server
          await shoppingCartItemsService.updateShoppingCartItem(itemId, {
            quantity: currentQuantity,
          });
          renderCart();
        } catch (error) {
          console.error('Error decreasing item quantity:', error.message);
          // Roll back UI if there's an error
          quantityDisplay.textContent = currentQuantity + 1;
          showSuccessMessage(error.message);
        }
      }
    });
  });

  document.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const itemId = +e.target.dataset.itemId;
      try {
        await shoppingCartItemsService.deleteShoppingCartItem(itemId);
        await renderCart(); // Re-render the cart after item removal

        // Check if the cart is now empty
        if (shoppingCartItems.length === 0) {
          await renderNavBar(); // Re-render the navbar to update the cart count
        }
      } catch (error) {
        console.error('Error removing item:', error.message);
        showSuccessMessage(error.message);
      }
    });
  });
}

async function renderCart() {
  await authenticate();
  await fetchData();

  if (shoppingCartItems.length === 0) {
    cartItemsBx.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    updateSummary([]);
    return;
  }

  cartItemsBx.innerHTML = '';
  const productIds = shoppingCartItems.map((item) => item.productId);
  const products = (
    await Promise.all(
      productIds.map((id) =>
        productsService.getProducts({
          filterOptions: {
            id,
          },
        })
      )
    )
  ).flat();

  const productMap = Object.fromEntries(
    products.map((product) => [product.id, product])
  );

  // Iterate over shoppingCartItems to render each item as a card
  shoppingCartItems.forEach((item) => {
    const product = productMap[item.productId] || {};
    const itemTotalPrice = (product.price || 0) * item.quantity;

    const itemHTML = `
      <div class="card mb-4" data-item-id="${item.id}">
        <div class="card-header">
          <h5>${product.name || 'Unknown Product'}</h5>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-3">
              <img src="./imgs/${
                product.images?.[0] ||
                'https://v...content-available-to-author-only...r.com/150'
              }" class="img-fluid" alt="${product.name || 'Product Image'}">
            </div>
            <div class="col-md-6">
              <h5>${product.name || 'Unknown Product'}</h5>
              <p>Price: &pound;${product.price?.toFixed(2) || '0.00'}</p>
              <p class="item-total">Total: &pound;${itemTotalPrice.toFixed(
                2
              )}</p>
            </div>
            <div class="col-md-3 text-end">
              <div class="d-flex align-items-center mb-2">
                <button class="btn btn-secondary btn-sm quantity-decrease" 
                        data-item-id="${item.id}" 
                        data-product-id="${item.productId}"
                        ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-secondary btn-sm quantity-increase" 
                        data-item-id="${item.id}" 
                        data-product-id="${item.productId}"
                        ${
                          item.quantity >= (product.stock || Infinity)
                            ? 'disabled'
                            : ''
                        }>+</button>
              </div>
              <button class="btn btn-danger btn-sm remove-btn" data-item-id="${
                item.id
              }">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Append the itemHTML to the container
    cartItemsBx.insertAdjacentHTML('beforeend', itemHTML);
  });

  addCartEventListeners(productMap);

  // Update the summary section with the cart total
  updateSummary(shoppingCartItems, productMap);

  renderNavBar();
}

async function handleCheckout() {
  if (shoppingCartItems.length === 0) {
    showErrorMessage('Your cart is empty. Add items to proceed to checkout.');
    return; // Prevent redirection if the cart is empty
  }

  try {
    const orderData = {
      customerId: loggedInUser.id,
      totalPrice: parseFloat(summaryTotalPriceElement.value.replace('£', '')),
      status: 'pending',
      createdAt: new Date(),
    };

    // Step 1: Create the order
    const order = await ordersService.createOder(orderData);

    // Store the order ID locally for potential future use
    localStorage.setItem('orderId', order.id);

    // Step 2: Create order items for each shopping cart item
    const orderItems = shoppingCartItems.map((item) => {
      const product = item.product || {}; // Assuming you have a reference to products
      return {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: (product.price || 0) * item.quantity,
      };
    });

    // Save each order item to the backend
    await Promise.all(
      orderItems.map((orderItem) =>
        orderItemsService.createOrderItem(orderItem)
      )
    );

    // Step 3: Update product stock
    await Promise.all(
      shoppingCartItems.map(async (item) => {
        const [product] = await productsService.getProducts({
          filterOptions: {
            id: item.productId,
          },
        });
        const newStock = (product.stock || 0) - item.quantity;

        if (newStock < 0) {
          throw new Error(
            `Not enough stock for product: ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`
          );
        }

        await productsService.updateProduct(item.productId, {
          stock: newStock,
        });
      })
    );

    // Step 4: Clear shopping cart items
    await Promise.all(
      shoppingCartItems.map((item) =>
        shoppingCartItemsService.deleteShoppingCartItem(item.id)
      )
    );

    // Step 5: Notify the user and refresh the cart
    showSuccessMessage('Order placed successfully!');
    await renderCart();
    setTimeout(() => {
      window.location.href = 'checkout.html';
    }, 2000);
  } catch (error) {
    console.error('Error during checkout:', error.message);
    showErrorMessage(`Error during checkout: ${error.message}`);
  }
}

onload = async () => {
  await renderNavBar();
  await renderCart();
  checkoutBtn.addEventListener('click', handleCheckout);
};
