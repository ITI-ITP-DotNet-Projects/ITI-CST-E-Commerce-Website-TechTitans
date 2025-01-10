import { ProductsFilterComponent } from './products/productsFilter.component.js';
import { ProductsGalleryComponent } from './products/productsGallery.components.js';

onload = async () => {
  const productFiltersComponent = new ProductsFilterComponent();
  const productsGalleryComponent = new ProductsGalleryComponent();

  await productFiltersComponent.render();
  await productsGalleryComponent.render();
  await productFiltersComponent.registerEvents(productsGalleryComponent);
};
