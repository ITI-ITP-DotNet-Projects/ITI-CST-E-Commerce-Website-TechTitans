import { renderNavBar } from './common/navbar.component.js';
import { paymentMethodsService } from '../backend/services/paymentMethods.service.js';
import { ordersService } from '../backend/services/orders.service.js';

onload = async () => {
  await renderNavBar();
  await populatePaymentMethods();
  setupFormValidation();
};

/**
 * Populates the Payment Method dropdown with options fetched from the PaymentMethodsService.
 */
async function populatePaymentMethods() {
  try {
    // Fetch payment methods using the service
    const paymentMethods = await paymentMethodsService.getPaymentMethods({
      filterOptions: {},
      paginationOptions: { pageNum: 1, limit: 10 },
      sortingOptions: { type: 1 },
    });
    console.log(paymentMethods);
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Clear existing options
    dropdownMenu.innerHTML = '';

    // Populate dropdown with payment methods
    paymentMethods.forEach((method) => {
      const dropdownItem = document.createElement('li');
      dropdownItem.innerHTML = `<a class="dropdown-item" href="#">${method.type}</a>`;
      dropdownMenu.appendChild(dropdownItem);
    });

    // Set up event listeners for payment method selection
    const paymentItems = dropdownMenu.querySelectorAll('.dropdown-item');
    paymentItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        // Store the selected payment method
        document.getElementById('payment-method').value =
          event.target.textContent;
      });
    });
  } catch (error) {
    console.error('Failed to load payment methods:', error);
  }
}

/**
 * Sets up validation for the checkout form.
 */
function setupFormValidation() {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const firstName = document.getElementById('first-name').value.trim();
    const secondName = document.getElementById('second-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expirationDate = document
      .getElementById('Expiration-Date')
      .value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const paymentMethod = document
      .getElementById('payment-method')
      .value.trim(); // Get selected payment method

    const errorMessages = {
      'first-name': 'First Name is required.',
      'second-name': 'Second Name is required.',
      email: 'Invalid email format.',
      phone: 'Phone number must be 10 digits.',
      zip: 'ZIP code must be 5 or 6 digits.',
      'card-number': 'Card Number must be 16 digits.',
      'Expiration-Date': 'Expiration Date is required.',
      cvv: 'CVV must be 3 digits.',
      'payment-method': 'Payment method is required.',
    };

    const errors = {}; // Store error messages for each field

    // Validate fields and add error messages
    if (!firstName) errors['first-name'] = errorMessages['first-name'];
    if (!secondName) errors['second-name'] = errorMessages['second-name'];
    if (!email || !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = errorMessages.email;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      errors.phone = errorMessages.phone;
    }
    if (!zip || !/^\d{5,6}$/.test(zip)) {
      errors.zip = errorMessages.zip;
    }
    if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
      errors['card-number'] = errorMessages['card-number'];
    }
    if (!expirationDate)
      errors['Expiration-Date'] = errorMessages['Expiration-Date'];
    if (!cvv || !/^\d{3}$/.test(cvv)) {
      errors.cvv = errorMessages.cvv;
    }
    if (!paymentMethod)
      errors['payment-method'] = errorMessages['payment-method']; // Validate payment method

    // Display errors or proceed with form submission
    displayErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Proceed with form submission logic here
      const shippingDetails = {
        firstName,
        secondName,
        email,
        phone,
        zip,
        cardNumber,
        expirationDate,
        cvv,
        paymentMethod, // Include selected payment method
      };
      const oderId = localStorage.getItem('orderId');
      console.log('Shipping details:', shippingDetails);

      try {
        // Fetch the current order directly from ordersService
        const order = await ordersService.getOrders({
          filterOptions: { id: parseInt(oderId) },
        });

        if (!order || order.length === 0) {
          alert('No order found for the current user.');
          return;
        }

        const orderId = order[0].id;

        await updateOrderShippingDetails(orderId, shippingDetails);
      } catch (error) {
        console.error('Failed to retrieve order or update shipping:', error);
        alert('An error occurred during the checkout. Please try again.');
      }
    }
  });
}

/**
 * Displays validation errors in the form.
 * @param {Object} errors - An object containing field error messages.
 */
function displayErrors(errors) {
  // Clear previous error messages
  document.querySelectorAll('.error-message').forEach((el) => el.remove());

  // Loop through errors and display them
  Object.keys(errors).forEach((field) => {
    const inputField = document.getElementById(field);
    if (inputField) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message text-danger mt-1';
      errorElement.textContent = errors[field];
      inputField.parentElement.appendChild(errorElement);
    }
  });
}

/**
 * Updates the order with shipping details.
 * @param {string} orderId - The order ID to update.
 * @param {Object} shippingDetails - The shipping details to update the order with.
 */
async function updateOrderShippingDetails(orderId, shippingDetails) {
  try {
    // Assuming we have a method to update the order (add shipping details to the order)
    const updatedOrder = await ordersService.updateOrder(orderId, {
      shippingDetails,
    });
    console.log('Order updated successfully:', updatedOrder);
    alert('Order updated successfully!');
  } catch (error) {
    console.log(error);
    alert('Failed to update order. Please try again.');
  }
}
