import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { Product } from '../../backend/models/products.model.js';
import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { productsService } from '../../backend/services/products.service.js';
import { usersService } from '../../backend/services/users.service.js';
import { shoppingCartsService } from '../../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../../backend/services/shoppingCartItems.service.js';
import { showSuccessMessage } from '../showSuccessMessage.js';

export class ProductsGalleryComponent {
  #filteredCategories = [];
  #filteredBrands = [];
  #sortPrice;
  #sortPopularity;
  #pageNum = 1;
  #limit = 9;

  static get Selector() {
    return `#productsGallery`;
  }

  get FiltrationOptions() {
    let filterOptions = {};

    if (this.#filteredCategories.length) {
      filterOptions.categoryId = (id) => this.#filteredCategories.includes(id);
    }

    if (this.#filteredBrands.length) {
      filterOptions.specification = {
        brand: (brand) => this.#filteredBrands.includes(brand),
      };
    }

    return filterOptions;
  }

  get SortingOptions() {
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

    return sortingOptions;
  }

  get PaginationOptions() {
    return {
      pageNum: this.PageNum,
      limit: this.Limit,
    };
  }

  async #getProducts() {
    return productsService.getProducts({
      filterOptions: this.FiltrationOptions,
      sortingOptions: this.SortingOptions,
      paginationOptions: this.PaginationOptions,
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
    this.#filteredCategories = filterCategories;
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
   * @returns {number}
   */
  get PageNum() {
    return this.#pageNum;
  }

  /**
   * @param {number} pageNum
   */
  set PageNum(pageNum) {
    this.#pageNum = pageNum;
    this.#getProducts().then((products) => this.renderProductList(products));
  }

  /**
   * @returns {number}
   */
  get Limit() {
    return this.#limit;
  }

  /**
   * @param {number} limit
   */
  set Limit(limit) {
    this.#limit = limit;
    this.#getProducts().then((products) => this.renderProductList(products));
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
    <div class="card mb-4 card--prod p-2 d-flex flex-column" data-prod_id="{{id}}">
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
          <a href="#" class="btn add-cart-btn w-100" data-prod_id="{{id}}">Add to Cart</a>
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
      id: product.id,
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
    const totNumOProducts = await productsService.countProducts({
      filterOptions: this.FiltrationOptions,
    });
    const numOfProducts = products.length;

    // render num of products paragraph
    document.querySelector('#totNumOfProducts').innerHTML = totNumOProducts;
    document.querySelector('#numOfProducts').innerHTML = numOfProducts;

    // render products
    document.querySelector(ProductsGalleryComponent.Selector).innerHTML = (
      await Promise.all(products.map((prod) => this.renderProduct(prod)))
    ).join('');

    // render pagination
    document.querySelector('.pagination').innerHTML = (() => {
      const pageItemTemplate = `<li class="page-item {{active}}" data-page="{{pageNum}}">
      <a class="page-link fs-5" href="#">{{pageNum}}</a>
    </li>`;
      let html = '';
      const totNumOfPages = Math.ceil(totNumOProducts / this.#limit);
      for (let i = 1; i <= totNumOfPages; ++i) {
        html += renderTemplate(pageItemTemplate, {
          pageNum: i,
          active: i == this.PageNum ? 'active' : '',
        });
      }
      return html;
    })();

    // register events on page links
    document.querySelector('.pagination').addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.tagName === 'A') {
        const pageNum = e.target.parentElement.getAttribute('data-page');
        if (pageNum) {
          this.PageNum = +pageNum;
        }
      }
    });

    // register events related to add to cart
    document.querySelectorAll('.add-cart-btn').forEach((bnt) => {
      bnt.addEventListener('click', async (e) => {
        e.preventDefault();
        const productId = +e.target.dataset.prod_id;
        const loggedInUser = await usersService.getCurrentLoggedInUser();

        if (!loggedInUser) {
          window.location.href = 'signin.html';
        } else {
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
        }
      });
    });
  }

  async render() {
    const products = await this.#getProducts();
    await this.renderProductList(products);
  }
}
