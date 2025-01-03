import { User, usersModel } from '../models/users.model.js';
import { IdGenerator, idGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class UsersService {
  #usersModel;
  #idGenerator;
  #currentLoggedInUser;

  /**
   * @param {Model} usersModel
   * @param {IdGenerator} idGenerator
   */
  constructor(usersModel, idGenerator) {
    this.#usersModel = usersModel;
    this.#idGenerator = idGenerator;
  }

  /**
   * @returns {User|null}
   */
  async getCurrentLoggedInUser() {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {object} options
   * @param {string} options.name
   * @param {string} options.email
   * @param {string} options.password
   * @param {'customer|'seller'|'admin'} options.role
   * @returns {Promise<User>}
   */
  async register({ name, email, password, role }) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {object} options
   * @param {string} options.email
   * @param {string} options.password
   * @returns {Promise<void>}
   */
  async login({ email: string, password: string }) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @returns {Promise<void>}
   */
  async logout() {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {Partial < Omit < User, 'password' >>} filterOptions
   * @returns {Promise<User[]>}
   */
  async getUsers(filterOptions) {
    throw new Error('Method not implemented yet!');
  }

  /**
   *
   * @param {number} id
   * @param {Partial<Omit<User, 'id'>>} data2Update
   * @returns {Promise<User>}
   */
  async updateUser(id, data2Update) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {number} id
   * @returns {Promise<User>}
   */
  async deleteUser(id) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @returns {Promise<boo>}
   */
  async isAuthenticated() {
    throw new Error('Method not implemented yet!');
  }

  /**
   *
   * @param  {('customer'|'seller'|'admin')[]} roles
   */
  async isAuthorized(...roles) {
    throw new Error('Method not implemented yet!');
  }

  /**
   * @returns {Promise<void>}
   */
  async #authenticate() {
    throw new Error('Method not implemented yet!');
  }
}

export const usersService = new UsersService(usersModel, idGenerator);
