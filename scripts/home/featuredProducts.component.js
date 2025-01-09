import { Product } from '../../backend/models/products.model.js';
import { productsService } from '../../backend/services/products.service.js';
import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { renderTemplate } from '../../backend/utils/renderTemplate.js';

export class FeaturedProductsComponent {
  #prodCardsBxElement = document.querySelector('.prod-cards-bx');

  /**
   * @param {number} avgRating
   * @returns {string}
   */
  renderStars(avgRating) {
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
  async renderProduct(product) {
    const prodCardTemplate = `<div class="col-11 col-sm-5 col-md-3 col-lg-3">
        <div class="card mb-4 card--prod p-2">
          <img
            src="./imgs/{{img}}"
            class="card-img-top mx-auto d-block"
            alt="Product 4"
            style="height: 150px; width: 100%; object-fit: contain"
          />
          <div class="card-body d-flex flex-column gap-2">
            <p class="card-category fs-6 text-capitalize">{{categoryName}}</p>
            <h5 class="card-title fs-5"><a href="#">{{productName}}</a></h5>
            <div class="fs-6">
              {{avgRating}}
              <span>({{ratingQuantity}})</span>
            </div>
            <p class="card-text fs-5"><strong>&pound; {{productPrice}}</strong></p>
            <a href="#" class="btn add-cart-btn">Add to Cart</a>
          </div>
        </div>
      </div>`;

    const [category] = await productCategoriesService.getProductCategories({
      filterOptions: {
        id: product.categoryId,
      },
    });

    return renderTemplate(prodCardTemplate, {
      img: product.images[0],
      productName: product.name,
      productPrice: product.price.toLocaleString(),
      avgRating: this.renderStars(product.rating.avgRating),
      ratingQuantity: product.rating.quantity,
      categoryName: category.name,
    });
  }

  async render() {
    const products = await productsService.getProducts({
      sortingOptions: { 'rating.avgRating': -1, 'rating.quantity': -1 },
      paginationOptions: {
        pageNum: 1,
        limit: 8,
      },
    });
    this.#prodCardsBxElement.innerHTML = (
      await Promise.all(products.map((prod) => this.renderProduct(prod)))
    ).join('');
  }
}
