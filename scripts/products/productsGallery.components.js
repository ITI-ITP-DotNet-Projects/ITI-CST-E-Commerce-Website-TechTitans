import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { Product } from '../../backend/models/products.model.js';
import { ProductCategory } from '../../backend/models/productCategories.model.js';
import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { productsService } from '../../backend/services/products.service.js';

export class ProductsGalleryComponent {
  get Selector() {
    return `#productsGallery`;
  }

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
    const prodCardTemplate = `<div class="col-lg-4 col-md-6 col-12 mb-4">
          <div class="card mb-4 card--prod p-2 d-flex flex-column">
            <img
              src="./imgs/{{img}}"
              class="card-img-top mx-auto d-block"
              alt="Product Image"
              style="height: 150px; width: 100%; object-fit: contain"
            />
            <div class="card-body d-flex flex-column gap-2 flex-grow-1">
              <p class="card-category fs-6 text-capitalize">{{categoryName}}</p>
              <h5 class="card-title fs-5"><a href="#">{{productName}}</a></h5>
              <div class="fs-6">
                {{avgRating}}
                <span>({{ratingQuantity}})</span>
              </div>
              <p class="card-text fs-5"><strong>&pound; {{productPrice}}</strong></p>
              <div class="w-100 mt-auto">
                <a href="#" class="btn add-cart-btn w-100">Add to Cart</a>
              </div>
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
    const products = await productsService.getProducts({});
    document.querySelector(this.Selector).innerHTML = (
      await Promise.all(products.map((prod) => this.renderProduct(prod)))
    ).join('');
  }
}
