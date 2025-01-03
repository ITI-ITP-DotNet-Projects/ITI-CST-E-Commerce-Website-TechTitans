import { productsModel, Product } from '../models/products.model.js';
import { Model } from '../utils/model.js';
import { IdGenerator, idGenerator } from '../utils/idGenerator.js';
import { usersService, UsersService } from './users.service.js';

export class ProductsService {
  #productsModel;
  #idGenerator;
  #usersService;

  /**
   * @param {Model} productsModel
   * @param {IdGenerator} idGenerator
   * @param {UsersService} usersService
   */
  constructor(productsModel, idGenerator, usersService) {
    this.#productsModel = productsModel;
    this.#idGenerator = idGenerator;
    this.#usersService = usersService;
  }

  /**
   * Fetches products based on the provided filter, pagination, and sorting options.
   *
   * @param {Object} options - The options for fetching products.
   * @param {Product} options.filterOptions - The filter criteria for products.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<Product[]>} A promise that resolves to an array of products.
   */
  async getProducts({ filterOptions, paginationOptions, sortingOptions }) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * Creates a new product with the provided data, excluding the `id` property.
   * This action authorized for sellers only.
   *
   * @param {Omit<Product, 'id'>} productData - The product data without the `id` property.
   * @returns {Promise<Product>} A promise that resolves to the newly created product.
   */
  async createProduct(productData) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * Update an existing product with the provided data, excluding the `id` property.
   * This action authorized for sellers
   *
   *@param {number} id - The product id
   * @param {Partial<Omit<Product, 'id'>>} productData - The product data without the `id` property.
   * @returns {Promise<Product>} A promise that resolves to the updated product
   */
  async updateProduct(id, data2Update) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * Delete an existing product using product id
   * This action only authorized for admins and sellers for their products only
   *
   * @param {number} id - The product id
   * @returns {Promise<Product>}
   */
  async deleteProduct(id) {
    throw new Error('Method not implemented yet!');
  }
}

export const productsService = new ProductsService(
  productsModel,
  idGenerator,
  usersService
);
