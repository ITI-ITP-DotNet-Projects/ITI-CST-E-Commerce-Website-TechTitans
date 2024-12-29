import { productsModel } from '../models/products.model';
import { Model } from '../utils/model';

export class ProductsService {
  #productsModel;
  /**
   * @param {Model} productsModel
   */
  constructor(productsModel) {
    this.#productsModel = productsModel;
  }
}

export const productsService = new ProductsService(productsModel);
