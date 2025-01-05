import { OrderItem, orderItemsModel } from '../models/orderItems.model.js';
import { IdGenerator, idGenerator } from '../utils/idGenerator';
import { Model } from '../utils/model.js';
import { UsersService, usersService } from './users.service.js';

export class OrderItemsService {
  #orderItemsModel;
  #idGenerator;
  #usersService;

  /**
   * @param {Model} orderItemsModel
   * @param {IdGenerator} idGenerator
   * @param {UsersService} usersService
   */
  constructor(orderItemsModel, idGenerator, usersService) {
    this.#orderItemsModel = orderItemsModel;
    this.#idGenerator = idGenerator;
    this.#usersService = usersService;
  }

  /**
   * @param {Object} options - The options for fetching orderItems.
   * @param {Product} options.filterOptions - The filter criteria for orderItems.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<OrderItem[]>} A promise that resolves to an array of orderItems.
   */
  async getOrderItems({ filterOptions, paginationOptions, sortingOptions }) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {Omit<OrderItem, 'id'>} orderData
   * @returns {Promise<OrderItem>}
   */
  async createOrderItem(orderData) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {number} itemId
   * @param {Partial<Omit<OrderItem, 'id'>>} data2Update
   * @returns {Promise<OrderItem>}
   */
  async updateOrderItem(itemId, data2Update) {
    throw new Error('Not Implemented yet!');
  }

  /**
   * @param {number} itemId
   * @returns {Promise<OrderItem>}
   */
  async deleteOrderItem(itemId) {
    throw new Error('Not Implemented yet!');
  }
}

export const orderItemsService = new OrderItemsService(
  orderItemsModel,
  idGenerator,
  usersService
);
