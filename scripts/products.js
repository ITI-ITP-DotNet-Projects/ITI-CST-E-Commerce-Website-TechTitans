import { productCategoriesService } from '../backend/services/productCategories.service.js';
import { ProductCategory } from '../backend/models/productCategories.model.js';
import { productsService } from '../backend/services/products.service.js';
class ProductFiltersComponent {
  /**
   * @param {ProductCategory} category
   * @returns {string}
   */
  static renderFilterOptionCheckbox(id, name, value, label) {
    return `<div class="form-check">
                    <input
                      type="checkbox"
                      name="${name}"
                      id="${id}"
                      value="${value}"
                    />
                    <label for="${id}" class="text-capitalize">${label}</label>
                  </div>`;
  }

  static async renderProductCategoriesFilters() {
    const categories = await productCategoriesService.getProductCategories({});
    document.querySelector('#categories').innerHTML = categories
      .map((category) =>
        ProductFiltersComponent.renderFilterOptionCheckbox(
          category.id,
          'categories',
          category.id,
          category.name
        )
      )
      .join('');
  }

  static async renderProductBrandsFilters() {
    const products = await productsService.getProducts({});
    const brandsSet = new Set(
      products.map((product) => product.specification.brand)
    );
    const brands = Array.from(brandsSet);
    console.log(brands);
    document.querySelector('#brands').innerHTML = brands
      .map((brand) =>
        ProductFiltersComponent.renderFilterOptionCheckbox(
          brand,
          'brands',
          brand,
          brand
        )
      )
      .join('');
  }

  static async render() {
    await Promise.all([
      ProductFiltersComponent.renderProductCategoriesFilters(),
      ProductFiltersComponent.renderProductBrandsFilters(),
    ]);
  }
}

onload = async () => {
  await ProductFiltersComponent.render();
};
