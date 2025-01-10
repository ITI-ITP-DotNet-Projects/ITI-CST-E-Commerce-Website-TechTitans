import { productCategoriesService } from '../../backend/services/productCategories.service.js';
import { ProductCategory } from '../../backend/models/productCategories.model.js';
import { productsService } from '../../backend/services/products.service.js';
import { renderTemplate } from '../../backend/utils/renderTemplate.js';
import { ProductsGalleryComponent } from './productsGallery.components.js';

class ProductCategoriesFilterComponent {
  /**
   * @returns {string}
   */
  static get Selector() {
    return `#categories`;
  }

  /**
   * @returns {string}
   */
  get CategoryOptionTemplate() {
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
    document.querySelector(
      ProductCategoriesFilterComponent.Selector
    ).innerHTML = categories
      .map((category) =>
        renderTemplate(this.CategoryOptionTemplate, {
          categoryId: category.id,
          categoryName: category.name,
        })
      )
      .join('');
  }
}

class ProductBrandsFilterComponent {
  /**
   * @returns {string}
   */
  static get Selector() {
    return `#brands`;
  }

  /**
   * @returns {string}
   */
  get BrandOptionTemplate() {
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
    document.querySelector(ProductBrandsFilterComponent.Selector).innerHTML =
      brands
        .map((brand) =>
          renderTemplate(this.BrandOptionTemplate, {
            brand,
          })
        )
        .join('');
  }
}

export class ProductsFilterComponent {
  static get Selector() {
    return '#filterSection';
  }

  /**
   * @param {ProductsGalleryComponent} productsGalleryComponent
   * @returns {Promise<void>}
   */
  async registerEvents(productsGalleryComponent) {
    /**
     * @param {Array} arr
     * @param {any} item
     * @returns {Array}
     */
    function toggleItemInArray(arr, item) {
      const existingItemIndex = arr.findIndex((ele) => ele == item);
      if (existingItemIndex > -1) {
        arr.splice(existingItemIndex, 1);
        return arr;
      } else {
        arr.push(item);
        return arr;
      }
    }

    document
      .querySelector(ProductsFilterComponent.Selector)
      .addEventListener('click', async (e) => {
        if (['categories', 'brands'].includes(e.target.name)) {
          if (e.target.name == 'categories') {
            productsGalleryComponent.FilterCategories = toggleItemInArray(
              productsGalleryComponent.FilterCategories,
              +e.target.value
            );
          } else if (e.target.name == 'brands') {
            productsGalleryComponent.FilteredBrands = toggleItemInArray(
              productsGalleryComponent.FilteredBrands,
              e.target.value
            );
          }
        }
      });

    document
      .querySelector('#sortPrice')
      .addEventListener('click', async (e) => {
        e.preventDefault();
        productsGalleryComponent.SortPopularity = undefined;
        productsGalleryComponent.SortPrice = +e.target.dataset.order;
      });

    document
      .querySelector('#sortPopular')
      .addEventListener('click', async (e) => {
        e.preventDefault();
        productsGalleryComponent.SortPrice = undefined;
        productsGalleryComponent.SortPopularity = +e.target.dataset.order;
      });
  }

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
