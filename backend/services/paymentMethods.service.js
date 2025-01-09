import {
  PaymentMethod,
  paymentMethodsModel,
} from '../models/paymentMethods.model.js';
import { Model } from '../utils/model.js';

export class PaymentMethodsService {
  #paymentMethodModel;

  /**
   * @param {Model} paymentMethodsModel
   */
  constructor(paymentMethodsModel) {
    this.#paymentMethodModel = paymentMethodsModel;
  }

  /**
   * @param {Object} options - The options for fetching payment methods.
   * @param {Product} options.filterOptions - The filter criteria for payment methods.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<ShoppingCart[]>} A promise that resolves to an array of payment methods.
   */
  async getPaymentMethods({
    filterOptions,
    paginationOptions,
    sortingOptions,
  }) {
    return this.#paymentMethodModel.find(
      filterOptions,
      sortingOptions,
      paginationOptions
    );
  }
}

export const paymentMethodsService = new PaymentMethodsService(
  paymentMethodsModel
);
