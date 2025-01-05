import { Model } from '../utils/model.js';

export class ShoppingCartItem {
  /**
   * @param {number} id
   * @param {number} cartId
   * @param {number} productId
   * @param {number} quantity
   */
  constructor(id, cartId, productId, quantity) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
  }
}

export const shoppingCartItemsModel = new Model('shoppingCartItems');
