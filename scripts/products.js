import { renderNavBar } from './common/navbar.component.js';
import { ProductsFilterComponent } from './products/productsFilter.component.js';
import { ProductsGalleryComponent } from './products/productsGallery.components.js';

onload = async () => {
  const productFiltersComponent = new ProductsFilterComponent();
  const productsGalleryComponent = new ProductsGalleryComponent();

  await renderNavBar();
  await productFiltersComponent.render();
  await productsGalleryComponent.render();
  await productFiltersComponent.registerEvents(productsGalleryComponent);
  document
    .querySelector(ProductsGalleryComponent.Selector)
    .addEventListener('click', renderNavBar);
};
