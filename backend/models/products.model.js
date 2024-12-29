import { Model } from '../utils/model.js';

export class ProductRating {
  /**
   * @param {number} avgRating
   * @param {number} quantity
   */
  constructor(avgRating, quantity) {
    this.avgRating = avgRating;
    this.quantity = quantity;
  }
}

export class ProductSpec {
  /**
   * @param {string} brand
   * @param {string} size
   * @param {string} weight
   * @param {string?} display
   * @param {string?} processor
   * @param {string?} graphics
   * @param {string?} memory
   * @param {string?} storage
   * @param {string?} audio
   * @param {string?} connection
   * @param {string?} keyboard
   * @param {string?} battery
   * @param {string?} dimensions
   */
  constructor(
    brand,
    size,
    weight,
    display,
    processor,
    graphics,
    memory,
    storage,
    audio,
    connection,
    keyboard,
    battery,
    dimensions
  ) {
    this.brand = brand;
    this.size = size;
    this.weight = weight;
    this.display = display;
    this.processor = processor;
    this.graphics = graphics;
    this.memory = memory;
    this.storage = storage;
    this.audio = audio;
    this.connection = connection;
    this.keyboard = keyboard;
    this.battery = battery;
    this.dimensions = dimensions;
  }
}

export class Product {
  /**
   *
   * @param {number} id
   * @param {string} name
   * @param {number} price
   * @param {ProductRating} rating
   * @param {number} categoryId
   * @param {string} description
   * @param {number} stock
   * @param {number} sellerId
   * @param {string[]} images
   * @param {ProductSpec} specification
   */
  constructor(
    id,
    name,
    price,
    rating,
    categoryId,
    description,
    stock,
    sellerId,
    images,
    specification
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.rating = rating;
    this.categoryId = categoryId;
    this.description = description;
    this.stock = stock;
    this.sellerId = sellerId;
    this.images = images;
    this.specification = specification;
  }
}

export const productsModel = new Model('products');
