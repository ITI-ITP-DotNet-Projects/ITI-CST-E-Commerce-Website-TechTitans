export class ShoppingCartItem {
  /**
   * @param {number} CartId
   * @param {number} ProductId
   * @param {number} quantity
   */

  constructor(CartId, ProductId, quantity) {
    this.CartId = CartId;
    this.ProductId = ProductId;
    this.quantity = quantity;
  }
}
