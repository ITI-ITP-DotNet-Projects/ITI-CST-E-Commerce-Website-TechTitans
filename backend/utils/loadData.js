import { usersCollectionData } from '../data/users.collection.data.js';
import { productCategoriesCollectionData } from '../data/productCategories.collection.data.js';
import { productsCollectionData } from '../data/products.collection.data.js';
import { usersModel } from '../models/users.model.js';
import { productsModel } from '../models/products.model.js';
import { productCategoriesModel } from '../models/productCategories.model.js';
import {
  ShoppingCart,
  shoppingCartsModel,
} from '../models/shoppingCarts.model.js';
import { shoppingCartsCollectionData } from '../data/shoppingCarts.collection.data.js';

export function loadData() {
  console.log('start loading data...');
  usersModel.Collection = usersCollectionData;
  productCategoriesModel.Collection = productCategoriesCollectionData;
  productsModel.Collection = productsCollectionData;
  shoppingCartsModel.Collection = shoppingCartsCollectionData;
  console.log('finish loading data...');
}
