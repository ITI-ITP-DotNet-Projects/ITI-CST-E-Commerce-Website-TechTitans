import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { usersService } from '../../backend/services/users.service.js';
import { shoppingCartsService } from '../../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../../backend/services/shoppingCartItems.service.js';

/**
 * @returns {string}
 */
function getCurrentPage() {
  return window.location.pathname.split('/').pop();
}
/**
 * @param {string} authLinks
 * @returns {Promise<string>}
 */
async function renderNavBarForAdmins(authLinks) {
  return `
      <li class="nav-item">
          <a class="nav-link" href="./dashboard.html">Dashboard</a>
      </li>
      <li class="nav-item">
          <a class="nav-link" href="./products.html">Products</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./users.html">
          <i class="bi bi-people"></i> Users
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./orders.html">
          <i class="bi bi-card-checklist"></i> Orders
        </a>
      </li>
      ${authLinks}`;
}

/**
 * @param {string} authLinks
 * @returns {Promise<string>}
 */
async function renderNavBarForSellers(authLinks) {
  return `
        <li class="nav-item">
        <a class="nav-link" href="./orders.html">
          <i class="bi bi-card-checklist"></i> Orders
        </a>
      </li>
      ${authLinks}
      <li class="nav-item">
          <a class="nav-link" href="./contact.html">Contact</a>
      </li>
  `;
}

/**
 * @param {string} authLinks
 * @returns {Promise<string>}
 */
async function renderNavBarForCustomers(authLinks, loggedInUser) {
  // Fetch the user's shopping cart
  let cartItemCount = 0;

  if (loggedInUser) {
    const [shoppingCart] = await shoppingCartsService.getShoppingCarts({
      filterOptions: { customerId: loggedInUser.id },
    });

    if (shoppingCart) {
      // Fetch the number of items in the shopping cart
      const shoppingCartItems =
        await shoppingCartItemsService.getShoppingCartItems({
          filterOptions: { cartId: shoppingCart.id },
        });

      cartItemCount = shoppingCartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  }

  return `
      <li class="nav-item">
        <a class="nav-link" href="./home.html">Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./products.html">Products</a>
      </li>
      <li class="nav-item position-relative">
        <a class="nav-link bi bi-cart" href="./cart.html"></a>
        ${
          cartItemCount > 0
            ? `<span class="badge rounded-pill bg-light position-absolute top-0 start-100 translate-middle">${cartItemCount}</span>`
            : ''
        }
      </li>
      ${authLinks}
      <li class="nav-item">
        <a class="nav-link" href="./contact.html">Contact</a>
      </li>`;
}

/**
 * @returns {Promise<void>}
 */
export async function renderNavBar() {
  const loggedInUser = await usersService.getCurrentLoggedInUser();
  let userRole = loggedInUser?.role || 'customer'; // Default role is customer if not logged in

  // Conditionally render auth links
  const authLinks = loggedInUser
    ? `<li class="nav-item">
         <a class="nav-link" href="./profile.html">
           <i class="bi bi-person-circle"></i> Profile
         </a>
       </li>`
    : `<li class="nav-item">
         <a class="nav-link" href="./signin.html">
           <i class="bi bi-person"></i> Sign In
         </a>
       </li>`;

  // Define the nav template
  const navTemplate = `
    <a class="navbar-brand d-flex align-items-center" href="home.html">
      <img
        src="./imgs/logo.png"
        alt="Logo"
        class="img-fluid"
        style="max-width: 50px; max-height: 50px"
      />
      <span class="ms-2 fw-bold fs-4 brand-name">TechTitans</span>
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto fw-bold fs-6">
        ${await (userRole == 'customer'
          ? renderNavBarForCustomers(authLinks, loggedInUser)
          : userRole == 'admin'
          ? renderNavBarForAdmins(authLinks)
          : renderNavBarForSellers(authLinks))}
      </ul>
    </div>
  `;

  // Render the navbar content
  const navBarContent = renderTemplate(navTemplate);

  // Replace the content inside #mainNav
  document.getElementById('mainNav').innerHTML = navBarContent;

  // Dynamically add the active class to the current page link
  document.querySelectorAll('#mainNav .nav-link').forEach((ele) => {
    if (ele.getAttribute('href') === `./${getCurrentPage()}`) {
      ele.classList.add('active');
    }
  });
}
