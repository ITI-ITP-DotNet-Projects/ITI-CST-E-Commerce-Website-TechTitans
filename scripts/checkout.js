import { renderNavBar } from './common/navbar.component.js';
import { paymentMethodsService } from '../backend/services/paymentMethods.service.js';
import { ordersService } from '../backend/services/orders.service.js';

onload = async () => {
  await renderNavBar();
  setupFormValidation(); // Set up form validation
};

/**
 * Sets up validation for the checkout form.
 */
function setupFormValidation() {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const firstName = document.getElementById('first-name').value.trim();
    const secondName = document.getElementById('second-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const zip = document.getElementById('zip').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expirationDate = document
      .getElementById('expiration-date')
      .value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const paymentMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    )?.value; // Get selected payment method

    // Error messages for validation
    const errorMessages = {
      'first-name': 'First Name is required.',
      'second-name': 'Second Name is required.',
      email: 'Invalid email format.',
      phone: 'Phone number must be 10 digits.',
      zip: 'ZIP code must be 5 or 6 digits.',
      'card-number':
        'Card Number is invalid or does not match the selected payment method.',
      'expiration-date': 'Expiration Date must be in the future.',
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
    if (!cardNumber || !validateCardNumber(cardNumber, paymentMethod)) {
      errors['card-number'] = errorMessages['card-number'];
    }
    if (!expirationDate || !isFutureDate(expirationDate)) {
      errors['expiration-date'] = errorMessages['expiration-date'];
    }
    if (!cvv || !/^\d{3}$/.test(cvv)) {
      errors.cvv = errorMessages.cvv;
    }
    if (!paymentMethod) {
      errors['payment-method'] = errorMessages['payment-method'];
    }

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
        paymentMethod,
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
 * Validates a card number using the Luhn Algorithm and checks if it matches the selected payment method.
 * @param {string} cardNumber - The card number to validate.
 * @param {string} paymentMethod - The selected payment method (Visa or MasterCard).
 * @returns {boolean} - True if the card number is valid and matches the payment method, false otherwise.
 */
function validateCardNumber(cardNumber, paymentMethod) {
  // Remove all non-digit characters
  cardNumber = cardNumber.replace(/\D/g, '');

  // Check if the card number is valid using the Luhn Algorithm
  if (!isValidLuhn(cardNumber)) {
    return false;
  }

  // Check if the card number matches the selected payment method
  if (paymentMethod === 'Visa' && !isVisaCard(cardNumber)) {
    return false;
  }
  if (paymentMethod === 'MasterCard' && !isMasterCard(cardNumber)) {
    return false;
  }

  return true;
}

/**
 * Checks if a card number is valid using the Luhn Algorithm.
 * @param {string} cardNumber - The card number to validate.
 * @returns {boolean} - True if the card number is valid, false otherwise.
 */
function isValidLuhn(cardNumber) {
  let sum = 0;
  for (let i = 0; i < cardNumber.length; i++) {
    let digit = parseInt(cardNumber[i], 10);
    if ((cardNumber.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/**
 * Checks if a card number is a valid Visa card.
 * @param {string} cardNumber - The card number to validate.
 * @returns {boolean} - True if the card number is a valid Visa card, false otherwise.
 */
function isVisaCard(cardNumber) {
  // Visa cards start with 4 and have 16 digits
  return /^4\d{15}$/.test(cardNumber);
}

/**
 * Checks if a card number is a valid MasterCard.
 * @param {string} cardNumber - The card number to validate.
 * @returns {boolean} - True if the card number is a valid MasterCard, false otherwise.
 */
function isMasterCard(cardNumber) {
  // MasterCard numbers start with 51-55 or 2221-2720 and have 16 digits
  return /^(5[1-5]\d{14}|222[1-9]\d{12}|27[0-2]\d{13})$/.test(cardNumber);
}

/**
 * Checks if the expiration date is in the future.
 * @param {string} dateString - The date string in "YYYY-MM" format.
 * @returns {boolean} - True if the date is in the future, false otherwise.
 */
function isFutureDate(dateString) {
  const [year, month] = dateString.split('-');
  const expirationDate = new Date(year, month - 1);
  const currentDate = new Date();
  return expirationDate > currentDate;
}

/**
 * Displays validation errors in the form.
 * @param {Object} errors - An object containing field error messages.
 */
function displayErrors(errors) {
  document.querySelectorAll('.error-message').forEach((el) => el.remove());

  Object.keys(errors).forEach((field) => {
    if (field === 'payment-method') {
      const paymentMethodContainer =
        document.querySelector('.d-flex.gap-3').parentElement;
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message text-danger mt-1';
      errorElement.textContent = errors[field];
      paymentMethodContainer.appendChild(errorElement);
    } else {
      const inputField = document.getElementById(field);
      if (inputField) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message text-danger mt-1';
        errorElement.textContent = errors[field];
        inputField.parentElement.appendChild(errorElement);
      }
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
    const updatedOrder = await ordersService.updateOrder(orderId, {
      shippingDetails,
      status: 'confirmed',
    });
    console.log('Order updated successfully:', updatedOrder);
    alert('Order updated successfully!');
  } catch (error) {
    console.log(error);
    alert('Failed to update order. Please try again.');
  }
}
