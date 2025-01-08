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
    if (!(await this.#usersService.isAuthenticated())) {
      throw new Error(`Can't Access this action, Please Login!`);
    }
    // NOTE: Future enhancement - We should modify the filtration options based on the user's role to enforce access control, ensuring users can only view order items related to their account.
    return this.#orderItemsModel.find(
      filterOptions,
      sortingOptions,
      paginationOptions
    );
  }

  /**
   * @param {Omit<OrderItem, 'id'>} orderData
   * @returns {Promise<OrderItem>}
   */
  async createOrderItem(orderData) {
    const currentLoggedInUser =
      await this.#usersService.getCurrentLoggedInUser();
    if (
      !(await this.#usersService.isAuthorized('customer')) ||
      orderData.customerId != currentLoggedInUser.id
    ) {
      throw new Error('Unauthorized access!');
    }

    const orderItem = new OrderItem({
      id: this.#idGenerator.generateId(),
      ...orderData,
    });

    return this.#orderItemsModel.create(orderItem);
  }

  /**
   * @param {number} itemId
   * @param {Partial<Omit<OrderItem, 'id'>>} data2Update
   * @returns {Promise<OrderItem>}
   */
  async updateOrderItem(itemId, data2Update) {
    const currentLoggedInUser =
      await this.#usersService.getCurrentLoggedInUser();
    const orderItem = await this.#orderItemsModel.findById(itemId);
    if (orderItem.customerId !== currentLoggedInUser.id) {
      throw new Error('Unauthorized access!');
    }

    return this.#orderItemsModel.update(itemId, data2Update);
  }

  /**
   * @param {number} itemId
   * @returns {Promise<OrderItem>}
   */
  async deleteOrderItem(itemId) {
    const currentLoggedInUser =
      await this.#usersService.getCurrentLoggedInUser();
    const orderItem = await this.#orderItemsModel.findById(itemId);
    if (orderItem.customerId !== currentLoggedInUser.id) {
      throw new Error('Unauthorized access!');
    }

    return this.#orderItemsModel.delete(itemId);
  }
}

export const orderItemsService = new OrderItemsService(
  orderItemsModel,
  idGenerator,
  usersService
);
