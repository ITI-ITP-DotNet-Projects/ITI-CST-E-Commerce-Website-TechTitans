import { Order, ordersModel } from '../models/orders.model.js';
import { usersService, UsersService } from './users.service.js';
import { idGenerator, IdGenerator, IdGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class OrdersService {
  #ordersModel;
  #idGenerator;
  #usersService;

  /**
   * @param {Model} ordersModel
   * @param {IdGenerator} idGenerator
   * @param {UsersService} usersService
   */
  constructor(ordersModel, idGenerator, usersService) {
    this.#ordersModel = ordersModel;
    this.#idGenerator = idGenerator;
    this.#usersService = usersService;
  }

  /**
   * @param {Object} options - The options for fetching orders.
   * @param {Product} options.filterOptions - The filter criteria for orders.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<ShoppingCart[]>} A promise that resolves to an array of orders.
   */
  async getOrders({ filterOptions, paginationOptions, sortingOptions }) {
    if (!(await this.#usersService.isAuthenticated())) {
      throw new Error(`Can't Access this action, Please Login!`);
    }
    // NOTE: Future enhancement - We should modify the filtration options based on the user's role to enforce access control, ensuring users can only view orders related to their account.
    return this.#ordersModel.find(
      filterOptions,
      sortingOptions,
      paginationOptions
    );
  }

  /**
   * @param {Omit<Order, 'id'>} orderData
   * @returns {Promise<Order>}
   */
  async createOder(orderData) {
    const currentUser = await this.#usersService.getCurrentLoggedInUser();
    if (
      !(await this.#usersService.isAuthorized('customer')) ||
      orderData.customerId !== currentUser.id
    ) {
      throw new Error('Unauthorized access!');
    }

    const order = new Order({
      id: this.#idGenerator.generateId(),
      ...orderData,
    });

    return this.#ordersModel.create(order);
  }

  /**
   * @param {number} orderId
   * @param {Partial<Omit<Order, 'id'>>} data2Update
   * @returns {Promise<Order>}
   */
  async updateOrder(orderId, data2Update) {
    const currentUser = await this.#usersService.getCurrentLoggedInUser();
    if (!(await this.#usersService.isAuthorized('customer'))) {
      throw new Error('Unauthorized access!');
    }

    const [order] = await this.#ordersModel.find({ orderId });
    if (!order || order.customerId !== currentUser.id) {
      throw new Error('Order not found or unauthorized access.');
    }

    const updatedOrder = await this.#ordersModel.update(orderId, data2Update);
    return updatedOrder;
  }
}

export const ordersService = new OrdersService(
  ordersModel,
  idGenerator,
  usersService
);
