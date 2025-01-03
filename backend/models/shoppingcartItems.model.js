import { Model } from '../utils/model.js';

export class ShoppingCartItem {
  /**
   * @param {number} cartId
   * @param {number} productId
   * @param {number} quantity
   */
  constructor(cartId, productId, quantity) {
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
  }
}

export const shoppingCartItemsModel = new Model('shoppingCartItems');
