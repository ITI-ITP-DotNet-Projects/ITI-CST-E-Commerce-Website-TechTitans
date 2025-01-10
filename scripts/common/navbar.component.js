import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { usersService } from '../../backend/services/users.service.js';
import { shoppingCartsService } from '../../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../../backend/services/shoppingCartItems.service.js';

/**
 * @returns {Promise<void>}
 */
export async function renderNavBar() {
  const loggedInUser = await usersService.getCurrentLoggedInUser();

  let cartItemCount = 0;
  if (loggedInUser) {
    // Fetch the user's shopping cart
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
        <li class="nav-item">
          <a class="nav-link {{isActiveHome}}" href="./home.html">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link {{isActiveProducts}}" href="./products.html">Products</a>
        </li>
        <li class="nav-item">
          <a class="nav-link {{isActiveContact}}" href="./contact.html">Contact</a>
        </li>
        {{authLinks}}
        <li class="nav-item position-relative">
          <a class="nav-link bi bi-cart" href="./cart.html"></a>
          ${
            cartItemCount > 0
              ? `<span class="badge rounded-pill bg-light position-absolute top-0 start-100 translate-middle">${cartItemCount}</span>`
              : ''
          }
        </li>
      </ul>
    </div>
  `;

  // Determine the active page
  const currentPage = window.location.pathname.split('/').pop();
  const isActiveHome = currentPage === 'home.html' ? 'active' : '';
  const isActiveProducts = currentPage === 'products.html' ? 'active' : '';
  const isActiveContact = currentPage === 'contact.html' ? 'active' : '';
  const isActiveSignin = currentPage === 'signin.html' ? 'active' : '';
  const isActiveProfile = currentPage === 'profile.html' ? 'active' : '';

  // Conditionally render auth links
  const authLinks = loggedInUser
    ? `<li class="nav-item">
         <a class="nav-link ${isActiveProfile}" href="./profile.html">
           <i class="bi bi-person-circle"></i> Profile
         </a>
       </li>`
    : `<li class="nav-item">
         <a class="nav-link ${isActiveSignin}" href="./signin.html">
           <i class="bi bi-person"></i> Sign In
         </a>
       </li>`;

  // Render the navbar content
  const navBarContent = renderTemplate(navTemplate, {
    isActiveHome,
    isActiveProducts,
    isActiveContact,
    authLinks,
    cartItemCount,
  });

  // Replace the content inside #mainNav
  document.getElementById('mainNav').innerHTML = navBarContent;
}
