import {
  shoppingCartsModel,
  ShoppingCart,
} from '../models/shoppingCarts.model.js';
import { idGenerator, IdGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class ShoppingCartsService {
  #shoppingCartsModel;
  #idGenerator;

  /**
   * @param {Model} shoppingCartsModel
   * @param {IdGenerator} idGenerator
   */
  constructor(shoppingCartsModel, idGenerator) {
    this.#shoppingCartsModel = shoppingCartsModel;
    this.#idGenerator = idGenerator;
  }

  /**
   * @param {Object} options - The options for fetching shoppingCarts.
   * @param {Product} options.filterOptions - The filter criteria for shoppingCarts.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<ShoppingCart[]>} A promise that resolves to an array of shoppingCarts.
   */
  async getShoppingCarts({ filterOptions, paginationOptions, sortingOptions }) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {number} customerId
   * @returns {Promise<ShoppingCart>}
   */
  async createShoppingCart(customerId) {
    throw new Error('Not Implemented yet!');
  }
}

export const shoppingCartsService = new ShoppingCartsService(
  shoppingCartsModel,
  idGenerator
);
