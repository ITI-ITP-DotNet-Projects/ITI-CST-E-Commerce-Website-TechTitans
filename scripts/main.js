import { loadData } from '../backend/utils/loadData.js';
import { usersService } from '../backend/services/users.service.js';
import { productsService } from '../backend/services/products.service.js';

onload = async () => {
  localStorage.clear();
  loadData();
  await usersService.login({
    email: 'taylor@example.com',
    password: '1234',
  });
  const prod = await productsService.createProduct({
    name: 'Apple iPhone 15 Pro Max',
    price: 59950,
    rating: { avgRating: 4.8, quantity: 50 },
    categoryId: 10111,
    description: `
        1. 6.7-inch Super Retina XDR display with ProMotion (120Hz refresh rate).
        2. Periscope telephoto lens with 5x optical zoom for enhanced photography.
        3. Powered by the A17 Pro chip, delivering exceptional performance.
        4. USB-C connectivity for universal charging standards.
      `,
    stock: 30,
    sellerId: 20904,
    images: ['Apple15_img1.jpg', 'Apple15_img2.jpg', 'Apple15_img3.jpg'],
    specification: {
      brand: 'Apple',
      size: '6.7 inches',
      weight: '240 grams',
      display: 'Super Retina XDR OLED, 120Hz, HDR10',
      processor: 'A17 Pro chip',
      memory: '8GB RAM',
      storage: '256GB',
      battery: '4,441 mAh',
      dimensions: '160.7 x 77.6 x 7.85 mm',
    },
  });
  console.log(prod);
  console.log(
    await productsService.updateProduct(prod.id, {
      name: 'Apple iPhone 15 Pro',
    })
  );
  console.log(await productsService.deleteProduct(prod.id));

  console.log(
    await productsService.getProducts({
      filterOptions: {
        price: (val) => val >= 20000 && val <= 35000,
      },
      sortingOptions: {
        price: -1,
      },
      paginationOptions: {
        pageNum: 2,
        limit: 2,
      },
    })
  );
  console.log(
    await productsService.countProducts({
      filterOptions: {
        price: (val) => val >= 20000 && val <= 35000,
      },
    })
  );
};
