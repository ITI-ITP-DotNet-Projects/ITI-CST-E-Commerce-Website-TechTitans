export class ProductCategory {
  /**
   * @param {number} id
   * @param {string} name
   * @param {number?} parentId
   */
  constructor(id, name, parentId) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }
}

export const productCategoriesModel = new Model('productCategories');
