import { loadData } from '../backend/utils/loadData.js';
import { renderNavBar } from './common/navbar.component.js';
import { FeaturedProductsComponent } from './home/featuredProducts.component.js';

onload = async () => {
  loadData();
  await renderNavBar();
  const featuredProductsComponent = new FeaturedProductsComponent();
  await featuredProductsComponent.render();
  document
    .querySelector(FeaturedProductsComponent.Selector)
    .addEventListener('click', renderNavBar);
};
