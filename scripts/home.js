import { Product } from '../backend/models/products.model.js';
import { productsService } from '../backend/services/products.service.js';
import { productCategoriesService } from '../backend/services/productCategories.service.js';
import { loadData } from '../backend/utils/loadData.js';

function renderStars(avgRating) {
  const fullStars = Math.floor(avgRating);
  const halfStar = avgRating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    '<span class="text-warning">' +
    '<i class="bi bi-star-fill"></i>'.repeat(fullStars) +
    '<i class="bi bi-star-half"></i>'.repeat(halfStar) +
    '<i class="bi bi-star"></i>'.repeat(emptyStars) +
    '</span>'
  );
}

/**
 * @param {Product} product
 * @returns {string}
 */
async function renderProduct(product) {
  const [category] = await productCategoriesService.getProductCategories({
    filterOptions: { id: product.categoryId },
  });
  return `<div class="col-11 col-sm-5 col-md-3 col-lg-3">
      <div class="card mb-4 card--prod p-2">
        <img
          src="./imgs/${product.images[0]}"
          class="card-img-top mx-auto d-block"
          alt="Product 4"
          style="height: 150px; width: 100%; object-fit: contain"
        />
        <div class="card-body d-flex flex-column gap-2">
          <p class="card-category fs-6 text-capitalize">${category.name}</p>
          <h5 class="card-title fs-5"><a href="#">${product.name}</a></h5>
          <div class="fs-6">
            ${renderStars(product.rating.avgRating)}
            <span>(${product.rating.quantity})</span>
          </div>
          <p class="card-text fs-5"><strong>&pound; ${product.price.toLocaleString()}</strong></p>
          <a href="#" class="btn add-cart-btn">Add to Cart</a>
        </div>
      </div>
    </div>`;
}

onload = async () => {
  loadData();
  const products = await productsService.getProducts({
    sortingOptions: { 'rating.avgRating': -1, 'rating.quantity': -1 },
    paginationOptions: {
      pageNum: 1,
      limit: 8,
    },
  });

  async function render() {
    document.querySelector('.prod-cards-bx').innerHTML = (
      await Promise.all(products.map((prod) => renderProduct(prod)))
    ).join('');
  }
  render();
};
