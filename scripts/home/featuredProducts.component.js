import { Product } from '../../backend/models/products.model.js';
import { productsService } from '../../backend/services/products.service.js';
import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { usersService } from '../../backend/services/users.service.js';
import { shoppingCartsService } from '../../backend/services/shoppingCarts.service.js';
import { shoppingCartItemsService } from '../../backend/services/shoppingCartItems.service.js';
import { showSuccessMessage } from '../common/showSuccessMessage.js';

export class FeaturedProductsComponent {
  #prodCardsBxElement = document.querySelector(
    FeaturedProductsComponent.Selector
  );

  static get Selector() {
    return '.prod-cards-bx';
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
    const prodCardTemplate = `<div class="col-11 col-sm-5 col-md-3 col-lg-3">
         <div class="card mb-4 card--prod p-2 d-flex flex-column" data-prod_id="{{id}}">
            <img
              src="./imgs/{{img}}"
              class="card-img-top mx-auto d-block"
              alt="Product Image"
              style="height: 150px; width: 100%; object-fit: contain"
            />
            <div class="card-body d-flex flex-column gap-2 flex-grow-1">
              <p class="card-category fs-6 text-capitalize">{{categoryName}}</p>
              <h5 class="card-title fs-5"><a href="productdetails.html" class="product-name" data-prod_id={{id}}>{{productName}}</a></h5>
              <div class="fs-6">
                {{avgRating}}
                <span>({{ratingQuantity}})</span>
              </div>
              <p class="card-text fs-5"><strong>&pound; {{productPrice}}</strong></p>
              <div class="w-100 mt-auto">
                <a href="#" class="btn add-cart-btn w-100"data-prod_id="{{id}}">Add to Cart</a>
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

    // register events related to add to cart
    document.querySelectorAll('.add-cart-btn').forEach((bnt) => {
      bnt.addEventListener('click', async (e) => {
        e.preventDefault();
        const productId = +e.target.dataset.prod_id;
        console.log(productId);
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

    // registerEvents for productName
    document.querySelectorAll('.product-name').forEach((ele) => {
      ele.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem('productId', e.target.dataset.prod_id);
        window.location.href = 'productdetails.html';
      });
    });
  }
}
