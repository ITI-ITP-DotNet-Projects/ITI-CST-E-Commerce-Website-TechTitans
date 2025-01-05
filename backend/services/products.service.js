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
    const allProducts = await this.#productsModel.find(filterOptions);

    const sortedProducts = allProducts.sort((a, b) => {
      for (const [key, order] of Object.entries(sortingOptions)) {
        if (a[key] < b[key]) return order === 1 ? -1 : 1;
        if (a[key] > b[key]) return order === 1 ? 1 : -1;
      }
      return 0;
    });

    const { pageNum = 1, limit = 10 } = paginationOptions;
    const startIndex = (pageNum - 1) * limit;
    const paginatedProducts = sortedProducts.slice(
      startIndex,
      startIndex + limit
    );

    return paginatedProducts;
  }

  /**
   * Creates a new product with the provided data, excluding the `id` property.
   * This action authorized for sellers only.
   *
   * @param {Omit<Product, 'id'>} productData - The product data without the `id` property.
   * @returns {Promise<Product>} A promise that resolves to the newly created product.
   */
  async createProduct(productData) {
    const {
      name,
      price,
      rating,
      categoryId,
      description,
      stock,
      sellerId,
      images,
      specification,
    } = productData;
    const currentLoggedInUser =
      await this.#usersService.getCurrentLoggedInUser();
    if (
      !(await this.#usersService.isAuthorized('seller')) ||
      sellerId != currentLoggedInUser.id
    ) {
      throw new Error('Unauthorized access!');
    }

    const newProduct = new Product(
      this.#idGenerator.ID,
      name,
      price,
      rating,
      categoryId,
      description,
      stock,
      sellerId,
      images,
      specification
    );

    await this.#productsModel.create(newProduct);
    return newProduct;
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
    const currentUser = await this.#usersService.getCurrentLoggedInUser();
    if (!(await this.#usersService.isAuthorized('seller'))) {
      throw new Error('Unauthorized access!');
    }

    const [product] = await this.#productsModel.find({ id });
    if (!product || product.sellerId !== currentUser.id) {
      throw new Error('Product not found or unauthorized access.');
    }

    const updatedProduct = await this.#productsModel.update(id, data2Update);
    return updatedProduct;
  }

  /**
   * Delete an existing product using product id
   * This action only authorized for admins and sellers for their products only
   *
   * @param {number} id - The product id
   * @returns {Promise<Product>}
   */
  async deleteProduct(id) {
    const currentUser = await this.#usersService.getCurrentLoggedInUser();
    if (!(await this.#usersService.isAuthorized('seller', 'admin'))) {
      throw new Error('Unauthorized access!');
    }

    const [product] = await this.#productsModel.find({ id });
    if (!product) {
      throw new Error('Product not found.');
    }

    if (currentUser.role === 'seller' && product.sellerId !== currentUser.id) {
      throw new Error('Unauthorized access!');
    }

    const deletedProduct = await this.#productsModel.delete(id);
    return deletedProduct;
  }
}

export const productsService = new ProductsService(
  productsModel,
  idGenerator,
  usersService
);
