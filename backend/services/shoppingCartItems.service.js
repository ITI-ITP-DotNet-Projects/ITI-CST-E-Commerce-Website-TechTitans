import {
  shoppingCartItemsModel,
  ShoppingCartItem,
} from '../models/shoppingCartItems.model.js';
import { idGenerator, IdGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';
import { usersService, UsersService } from './users.service.js';
export class ShoppingCartItemsService {
  #shoppingCartItemsModel;
  #idGenerator;
  #usersService;

  /**
   * @param {Model} shoppingCartItemsModel
   * @param {IdGenerator} idGenerator
   * @param {UsersService} usersService
   */
  constructor(shoppingCartItemsModel, idGenerator, usersService) {
    this.#shoppingCartItemsModel = shoppingCartItemsModel;
    this.#idGenerator = idGenerator;
    this.#usersService = usersService;
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
    if (!(await this.#usersService.isAuthorized('customer', 'admin'))) {
      throw new Error('Unauthorized access!');
    }

    //NOTE: We should scope down authority level of customer to only see items related to himself by enforce cartId of him in filtration object (future enhancements)

    return this.#shoppingCartItemsModel.find(
      filterOptions,
      paginationOptions,
      sortingOptions
    );
  }

  /**
   * @param {ShoppingCartItem} itemData
   * @returns {Promise<ShoppingCartItem>}
   */
  async createShoppingCartItem(itemData) {
    const { cartId, productId, quantity } = itemData;
    if (!(await this.#usersService.isAuthorized('customer'))) {
      throw new Error('Unauthorized access!');
    }
    const newShoppingCartItem = new ShoppingCartItem(
      this.#idGenerator.ID,
      cartId,
      productId,
      quantity
    );
    await this.#shoppingCartItemsModel.create(newShoppingCartItem);
    return newShoppingCartItem;
  }

  /**
   * @param {number} itemId
   * @param {ShoppingCartItem} data2Update
   * @returns {Promise<ShoppingCartItem>}
   */
  async updateShoppingCartItem(itemId, data2Update) {
    if (!(await this.#usersService.isAuthorized('customer'))) {
      throw new Error('Unauthorized access!');
    }

    try {
      return await this.#shoppingCartItemsModel.update(itemId, data2Update);
    } catch (error) {
      if (error.message.includes('found')) {
        throw new Error(`Shopping cart item with ID ${itemId} not found.`);
      } else {
        throw error;
      }
    }
  }

  /**
   * @param {number} itemId
   * @returns {Promise<ShoppingCartItem>}
   */
  async deleteShoppingCartItem(itemId) {
    if (!(await this.#usersService.isAuthorized('customer'))) {
      throw new Error('Unauthorized access!');
    }

    try {
      return await this.#shoppingCartItemsModel.delete(itemId);
    } catch (error) {
      if (error.message.includes('found')) {
        throw new Error(`Shopping cart item with ID ${itemId} not found.`);
      } else {
        throw error;
      }
    }
  }
}

export const shoppingCartItemsService = new ShoppingCartItemsService(
  shoppingCartItemsModel,
  idGenerator,
  usersService
);
