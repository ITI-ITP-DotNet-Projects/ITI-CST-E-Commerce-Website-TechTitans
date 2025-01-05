import {
  productCategoriesModel,
  ProductCategory,
} from '../models/productCategories.model.js';

export class ProductCategoriesService {
  #productCategoriesModel;

  /**
   * @param {Model} productCategoriesModel
   */
  constructor(productCategoriesModel) {
    this.#productCategoriesModel = productCategoriesModel;
  }

  /**
   * Fetches productCategories based on the provided filter, pagination, and sorting options.
   *
   * @param {Object} options - The options for fetching productCategories.
   * @param {Product} options.filterOptions - The filter criteria for productCategories.
   * @param {Object} options.paginationOptions - The pagination options.
   * @param {number} options.paginationOptions.pageNum - The page number to fetch.
   * @param {number} options.paginationOptions.limit - The number of items per page.
   * @param {Object<string, -1|1>} options.sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @returns {Promise<ProductCategory[]>} A promise that resolves to an array of productCategories.
   */
  async getProductCategories({
    filterOptions,
    paginationOptions,
    sortingOptions,
  }) {
    return this.#productCategoriesModel.find(
      filterOptions,
      sortingOptions,
      paginationOptions
    );
  }
  /**
   * Fetches productCategories count based on the provided filter.
   *
   * @param {Object} options - The options for fetching productCategories.
   * @param {Product} options.filterOptions - The filter criteria for productCategories.
   * @returns {Promise<number>} A promise that resolves to the productCategories number
   */
  async countProductCategories({ filterOptions }) {
    return (await this.#productCategoriesModel.find(filterOptions)).length;
  }
}

export const productCategoriesService = new ProductCategoriesService(
  productCategoriesModel
);
