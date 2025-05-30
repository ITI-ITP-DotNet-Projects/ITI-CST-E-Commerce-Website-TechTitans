import { usersCollectionData } from '../data/users.collection.data.js';
import { productCategoriesCollectionData } from '../data/productCategories.collection.data.js';
import { productsCollectionData } from '../data/products.collection.data.js';
import { usersModel } from '../models/users.model.js';
import { productsModel } from '../models/products.model.js';
import { productCategoriesModel } from '../models/productCategories.model.js';
import { shoppingCartsModel } from '../models/shoppingCarts.model.js';
import { shoppingCartsCollectionData } from '../data/shoppingCarts.collection.data.js';
import { shoppingCartItemsModel } from '../models/shoppingCartItems.model.js';
import { shoppingCartItemsCollectionData } from '../data/shoppingCartItems.collection.data.js';
import { ordersCollectionData } from '../data/orders.collection.data.js';
import { ordersModel } from '../models/orders.model.js';
import { orderItemsModel } from '../models/orderItems.model.js';
import { orderItemsCollectionData } from '../data/orderItems.collection.data.js';
import { Model } from './model.js';

/**
 * @param {Model} model
 */
function try2Load(model, data) {
  if (localStorage.getItem(model.collectionKey)) return;
  model.Collection = data;
}

export function loadData() {
  console.log('start loading data...');
  try2Load(usersModel, usersCollectionData);
  try2Load(productsModel, productsCollectionData);
  try2Load(productCategoriesModel, productCategoriesCollectionData);
  try2Load(shoppingCartsModel, shoppingCartsCollectionData);
  try2Load(shoppingCartItemsModel, shoppingCartItemsCollectionData);
  try2Load(ordersModel, ordersCollectionData);
  try2Load(orderItemsModel, orderItemsCollectionData);
  console.log('finish loading data...');
}
