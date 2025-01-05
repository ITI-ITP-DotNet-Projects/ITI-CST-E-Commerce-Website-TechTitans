import {
  shoppingCartItemsModel,
  ShoppingCartItem,
} from '../models/shoppingCartItems.model.js';
import { idGenerator, IdGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class ShoppingCartItemsService {
  #shoppingCartItemsModel;
  #idGenerator;

  /**
   * @param {Model} shoppingCartItemsModel
   * @param {IdGenerator} idGenerator
   */
  constructor(shoppingCartItemsModel, idGenerator) {
    this.#shoppingCartItemsModel = shoppingCartItemsModel;
    this.#idGenerator = idGenerator;
  }

  /**
   * @param {Object} options - The options for fetching shoppingCartItems.
   * @param {Product} options.filterOptions - The filter criteria for shoppingCartItems.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<ShoppingCartItem[]>} A promise that resolves to an array of shoppingCartItems.
   */
  async getShoppingCartItems({
    filterOptions,
    paginationOptions,
    sortingOptions,
  }) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {ShoppingCartItem} itemData
   * @returns {Promise<ShoppingCartItem>}
   */
  async createShoppingCartItem(itemData) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {number} itemId
   * @param {ShoppingCartItem} data2Update
   * @returns {Promise<ShoppingCartItem>}
   */
  async updateShoppingCartItem(itemId, data2Update) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {number} itemId
   * @returns {Promise<ShoppingCartItem>}
   */
  async deleteShoppingCartItem(itemId) {
    throw new Error('Not Implemented yet!');
  }
}

export const shoppingCartItemsService = new ShoppingCartItemsService(
  shoppingCartItemsModel,
  idGenerator
);
