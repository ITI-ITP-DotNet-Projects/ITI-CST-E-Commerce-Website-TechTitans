import { Model } from '../utils/model.js';

export class ShoppingCart {
  /**
   * @param {number} id
   * @param {number} customerId
   */
  constructor(id, customerId) {
    this.id = id;
    this.customerId = customerId;
  }
}

export const shoppingCartsModel = new Model('shoppingCarts');
