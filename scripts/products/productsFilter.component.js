import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { ProductCategory } from '../../backend/models/productCategories.model.js';
import { productsService } from '../../backend/services/products.service.js';
import { renderTemplate } from '../../backend/utils/renderTemplate.js';

class ProductCategoriesFilterComponent {
  /**
   * @returns {string}
   */
  get SelectorOnLargeScreen() {
    return `#categories`;
  }

  /**
   * @returns {string}
   */
  get SelectorOnSmallScreen() {
    return `#categories-sm`;
  }
  /**
   * @returns {string}
   */
  get CategoryOptionTemplateOnLargeScreen() {
    return `<div class="form-check">
                    <input
                      type="checkbox"
                      name="categories"
                      id="{{categoryId}}"
                      value="{{categoryId}}"
                    />
                    <label for="{{categoryId}}" class="text-capitalize">{{categoryName}}</label>
                  </div>`;
  }

  /**
   * @returns {string}
   */
  get CategoryOptionTemplateOnSmallScreen() {
    return `<div class="form-check">
                    <input
                      type="checkbox"
                      name="categories"
                      id="{{categoryId}}"
                      value="{{categoryId}}"
                    />
                    <label for="{{categoryId}}" class="text-capitalize">{{categoryName}}</label>
                  </div>`;
  }

  /**
   * @returns {Promise<void>}
   */
  async render() {
    const categories = await productCategoriesService.getProductCategories({});

    // large screen
    document.querySelector(this.SelectorOnLargeScreen).innerHTML = categories
      .map((category) =>
        renderTemplate(this.CategoryOptionTemplateOnLargeScreen, {
          categoryId: category.id,
          categoryName: category.name,
        })
      )
      .join('');

    // TODO:small screen
  }
}

class ProductBrandsFilterComponent {
  /**
   * @returns {string}
   */
  get SelectorOnLargeScreen() {
    return `#brands`;
  }

  /**
   * @returns {string}
   */
  get SelectorOnSmallScreen() {
    return `#brands-sm`;
  }
  /**
   * @returns {string}
   */
  get BrandOptionTemplateOnLargeScreen() {
    return `<div class="form-check">
                    <input
                      type="checkbox"
                      name="brands"
                      id="{{brand}}"
                      value="{{brand}}"
                    />
                    <label for="{{brand}}" class="text-capitalize">{{brand}}</label>
                  </div>`;
  }

  /**
   * @returns {string}
   */
  get BrandOptionTemplateOnSmallScreen() {
    return `<div class="form-check">
                    <input
                      type="checkbox"
                      name="brands"
                      id="{{brand}}"
                      value="{{brand}}"
                    />
                    <label for="{{brand}}" class="text-capitalize">{{brand}}</label>
                  </div>`;
  }

  /**
   * @returns {Promise<void>}
   */
  async render() {
    const products = await productsService.getProducts({});
    const brandsSet = new Set(
      products.map((product) => product.specification.brand)
    );
    const brands = Array.from(brandsSet);

    // large screen
    document.querySelector(this.SelectorOnLargeScreen).innerHTML = brands
      .map((brand) =>
        renderTemplate(this.BrandOptionTemplateOnLargeScreen, {
          brand,
        })
      )
      .join('');

    // TODO:small screen
  }
}

export class ProductsFilterComponent {
  /**
   * @returns {Promise<void>}
   */
  async render() {
    const categoriesFilterComponent = new ProductCategoriesFilterComponent();
    const brandsFilterComponent = new ProductBrandsFilterComponent();
    await categoriesFilterComponent.render();
    await brandsFilterComponent.render();
  }
}
