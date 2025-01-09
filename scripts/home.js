import { loadData } from '../backend/utils/loadData.js';
import { FeaturedProductsComponent } from './home/featuredProducts.component.js';

onload = async () => {
  loadData();
  const featuredProductsComponent = new FeaturedProductsComponent();
  featuredProductsComponent.render();
};
