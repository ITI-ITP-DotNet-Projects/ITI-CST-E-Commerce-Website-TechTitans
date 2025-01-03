import { Model } from '../utils/model.js';

export class PaymentMethod {
  /**
   * @param {number} id
   * @param {string} type
   */
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

export const paymentMethodsModel = new Model('paymentMethods');
