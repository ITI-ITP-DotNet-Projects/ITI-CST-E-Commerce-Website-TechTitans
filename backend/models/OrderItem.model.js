export class OrderItem {
  /**
   * @param {number} orderId
   * @param {number} productId
   * @param {number} quantity
   * @param {number} totalPrice
   */
  constructor(orderId, productId, quantity, totalPrice) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
  }
}
