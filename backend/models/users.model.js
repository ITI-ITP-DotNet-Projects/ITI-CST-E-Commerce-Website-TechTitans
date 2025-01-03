import { Model } from '../utils/model.js';

export class User {
  /**
   * @param {number} id
   * @param {string} name
   * @param {string} password
   * @param {'customer'|'seller'|'admin'} role
   * @param {string?} avatar
   */
  constructor(id, name, password, role, avatar) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.role = role;
    this.avatar = avatar;
  }
}

export const usersModel = new Model('users');
