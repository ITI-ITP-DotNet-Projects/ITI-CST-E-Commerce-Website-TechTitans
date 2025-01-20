import { usersService } from '../backend/services/users.service.js';
import { loadData } from '../backend/utils/loadData.js';
import { renderNavBar } from './common/navbar.component.js';
import { FeaturedProductsComponent } from './home/featuredProducts.component.js';

onload = async () => {
  loadData();
  await renderNavBar();
  const loggedInUser = await usersService.getCurrentLoggedInUser();

  if (
    loggedInUser &&
    (loggedInUser.role === 'admin' || loggedInUser.role === 'seller')
  ) {
    window.location.href = 'dashboard.html';
  } else {
    const featuredProductsComponent = new FeaturedProductsComponent();
    await featuredProductsComponent.render();
    document
      .querySelector(FeaturedProductsComponent.Selector)
      .addEventListener('click', renderNavBar);
  }
};
