import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { Product } from '../../backend/models/products.model.js';
import { ProductCategory } from '../../backend/models/productCategories.model.js';
import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { productsService } from '../../backend/services/products.service.js';

export class ProductsGalleryComponent {
  #filteredCategories = [];
  #filteredBrands = [];
  #sortPrice;
  #sortPopularity;

  static get Selector() {
    return `#productsGallery`;
  }

  async #getProducts() {
    let filterOptions = {};

    if (this.#filteredCategories.length) {
      filterOptions.categoryId = (id) => this.#filteredCategories.includes(id);
    }

    if (this.#filteredBrands.length) {
      filterOptions.specification = {
        brand: (brand) => this.#filteredBrands.includes(brand),
      };
    }

    let sortingOptions = {};

    if (this.#sortPrice) {
      sortingOptions.price = this.#sortPrice;
    }

    if (this.#sortPopularity) {
      sortingOptions = {
        ...sortingOptions,
        'rating.avgRating': this.#sortPopularity,
        'rating.quantity': this.#sortPopularity,
      };
    }

    return productsService.getProducts({
      filterOptions,
      sortingOptions,
    });
  }

  /**
   * @returns {Array<number>}
   */
  get FilterCategories() {
    return this.#filteredCategories;
  }

  /**
   * @param {Array<number>} filterCategories
   */
  set FilterCategories(filterCategories) {
    this.#filteredCategories;
    this.#getProducts().then((products) => this.renderProductList(products));
  }

  /**
   * @param {Array<number>} filteredBrands
   */
  set FilteredBrands(filteredBrands) {
    this.#filteredBrands = filteredBrands;
    this.#getProducts().then((products) => this.renderProductList(products));
  }

  /**
   * @returns {Array<number>}
   */
  get FilteredBrands() {
    return this.#filteredBrands;
  }

  /**
   * @param {number} sortPrice
   */
  set SortPrice(sortPrice) {
    this.#sortPrice = sortPrice;
    this.#getProducts().then((products) => this.renderProductList(products));
  }

  /**
   * @returns {number}
   */
  get SortPrice() {
    return this.#sortPrice;
  }

  /**
   * @param {number} sortPopularity
   */
  set SortPopularity(sortPopularity) {
    this.#sortPopularity = sortPopularity;
    this.#getProducts().then((products) => this.renderProductList(products));
  }

  /**
   * @returns {number}
   */
  get SortPopularity() {
    return this.#sortPopularity;
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

  /**
   * @param {Product[]} products
   */
  async renderProductList(products) {
    const totNumOProducts = await productsService.countProducts({});
    const numOfProducts = products.length;
    document.querySelector('#totNumOfProducts').innerHTML = totNumOProducts;
    document.querySelector('#numOfProducts').innerHTML = numOfProducts;
    document.querySelector(ProductsGalleryComponent.Selector).innerHTML = (
      await Promise.all(products.map((prod) => this.renderProduct(prod)))
    ).join('');
  }

  async render() {
    const products = await productsService.getProducts({});
    await this.renderProductList(products);
  }
}
