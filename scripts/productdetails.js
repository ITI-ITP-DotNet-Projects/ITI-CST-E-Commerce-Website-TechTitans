import { renderNavBar } from './common/navbar.component.js';
import { productsService } from '../backend/services/products.service.js';
import { usersService } from '../backend/services/users.service.js';
import { shoppingCartsService } from '../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../backend/services/shoppingCartItems.service.js';
import { showSuccessMessage } from './common/showSuccessMessage.js';

window.onload = async () => {
  await renderNavBar();
  try {
    const productId = localStorage.getItem('productId');
    if (!productId) {
      redirectToHome('Product not found.');
      return;
    }

    const product = await fetchProductDetails(+productId);
    if (!product) {
      redirectToHome('Product details are unavailable.');
      return;
    }

    populateProductDetails(product);
    populateSpecifications(product.specification);
  } catch (error) {
    console.error('Error during page load:', error);
    alert('An error occurred while loading product details.');
  }
  document
    .getElementById('add-to-cart-btn')
    .addEventListener('click', async () => {
      const loggedInUser = await usersService.getCurrentLoggedInUser();
      const productId = +localStorage.getItem('productId');
      if (loggedInUser) {
        const [shoppingCart] = await shoppingCartsService.getShoppingCarts({
          filterOptions: {
            customerId: loggedInUser.id,
          },
        });
        if (
          !Boolean(
            (
              await shoppingCartItemsService.getShoppingCartItems({
                filterOptions: { cartId: shoppingCart.id, productId },
              })
            ).length
          )
        ) {
          await shoppingCartItemsService.createShoppingCartItem({
            cartId: shoppingCart.id,
            productId,
            quantity: 1,
          });
        }

        // Show success message
        showSuccessMessage('Product added to cart successfully!');

        setTimeout(() => {
          window.location.href = 'cart.html';
        }, 1500);
      } else {
        window.location.href = './signin.html';
      }
    });
};

async function fetchProductDetails(productId) {
  try {
    const filterOptions = { id: productId };
    const sortingOptions = {};
    const paginationOptions = { pageNum: 1, limit: 1 };

    const products = await productsService.getProducts({
      filterOptions,
      paginationOptions,
      sortingOptions,
    });

    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

addThumbnailClickListeners();

function redirectToHome(message) {
  alert(message);
  window.location.href = './home.html';
}

function populateProductDetails(product) {
  document.getElementById(
    'main-product-image'
  ).src = `../imgs/${product.images[0]}`;
  document.getElementById('thumbnail-1').src = `../imgs/${product.images[1]}`;
  document.getElementById('thumbnail-2').src = `../imgs/${product.images[2]}`;

  document.getElementById('product-name').textContent = product.name;
  document.getElementById('stars').innerHTML = renderStars(
    product.rating.avgRating
  );
  document.getElementById(
    'Quantity'
  ).innerHTML = ` (${product.rating.quantity})`;
  document.getElementById('product-price').textContent = `$${product.price}`;
  document.getElementById('description').textContent = product.description;
  document.getElementById('brand').textContent = product.specification.brand;
  document.getElementById('size').textContent = product.specification.size;
  document.getElementById('weight').textContent = product.specification.weight;
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;
  let starsHTML = '';

  for (let i = 0; i < fullStars; i++)
    starsHTML += '<span class="bi bi-star-fill text-warning"></span>';
  if (halfStars)
    starsHTML += '<span class="bi bi-star-half text-warning"></span>';
  for (let i = 0; i < emptyStars; i++)
    starsHTML += '<span class="bi bi-star text-warning"></span>';

  return starsHTML;
}
function populateSpecifications(specification) {
  if (!specification || Object.keys(specification).length === 0) {
    return;
  }

  const specsListElement = document.getElementById('specs-list');
  specsListElement.innerHTML = '';

  for (let key in specification) {
    if (specification.hasOwnProperty(key)) {
      const value = specification[key];

      const listItem = document.createElement('li');
      listItem.className = 'list-group-item custom-item';
      listItem.style.backgroundColor = '#f9f9f9';
      listItem.style.border = '1px solid #ddd';
      listItem.style.borderRadius = '5px';
      listItem.style.padding = '10px';
      listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
      listItem.addEventListener('mouseenter', () => {
        listItem.style.backgroundColor = '#e7e7e7';
        listItem.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        listItem.style.transform = 'translateY(-2px)';
      });

      listItem.addEventListener('mouseleave', () => {
        listItem.style.backgroundColor = '#f9f9f9';
        listItem.style.boxShadow = '';
        listItem.style.transform = '';
      });
      listItem.style.display = 'flex';
      listItem.style.justifyContent = 'start';
      listItem.style.alignItems = 'center';
      listItem.style.textAlign = 'center';
      specsListElement.appendChild(listItem);
    }
  }
}

function addThumbnailClickListeners() {
  const thumbnails = [
    document.getElementById('thumbnail-1'),
    document.getElementById('thumbnail-2'),
  ];

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
      const mainImage = document.getElementById('main-product-image');
      mainImage.src = thumbnail.src;
    });
  });
}
