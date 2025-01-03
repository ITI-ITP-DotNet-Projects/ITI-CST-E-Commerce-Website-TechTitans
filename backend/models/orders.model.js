import { Model } from '../utils/model.js';

export class shippingDetailsOrder {
  /**
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} phoneNumber
   * @param {string} address
   * @param {string} email
   */
  constructor(firstName, lastName, phoneNumber, address, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.email = email;
  }
}

export class Order {
  /**
   * @param {number} id
   * @param {number} customerId
   * @param {number} totalPrice
   * @param {number} deliveryFee
   * @param {number} paymentMethodId
   * @param {shippingDetailsOrder} shippingDetails
   * @param {'pending'|'confirmed'|'shipped'|'delivered'|'canceled'} status
   * @param {Date} createdAt
   */
  constructor(
    id,
    customerId,
    totalPrice,
    deliveryFee,
    paymentMethodId,
    shippingDetails,
    status,
    createdAt
  ) {
    this.id = id;
    this.customerId = customerId;
    this.totalPrice = totalPrice;
    this.deliveryFee = deliveryFee;
    this.paymentMethodId = paymentMethodId;
    this.shippingDetails = shippingDetails;
    this.status = status; //('pending', 'confirmed', 'shipped', 'delivered', 'canceled')
    this.createdAt = createdAt;
  }
}

export const ordersModel = new Model('orders');
