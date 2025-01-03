import { Model } from '../utils/model.js';

export class Promotion {
  /**
   * @param {number} id
   * @param {number} productId
   * @param {number} discount
   * @param {Date} startDate
   * @param {Date} endDate
   */
  constructor(id, productId, discount, startDate, endDate) {
    this.id = id;
    this.productId = productId;
    this.discount = discount;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }
}

export const promotionsModel = new Model('promotions');
