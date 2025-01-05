import { User, usersModel } from '../models/users.model.js';
import { IdGenerator, idGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class UsersService {
  #usersModel;
  #idGenerator;
  #currentLoggedInUser;
  static #loggedInUserIdKey = 'loggedInUserId';

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
   *+
   */
  async getCurrentLoggedInUser() {
    if (this.#currentLoggedInUser) {
      return this.#currentLoggedInUser;
    }
    return null;
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
    if (!name || !email || !password || !role) {
      throw new Error('All fields (name, email, password, role) are required.');
    }
    const validRoles = ['customer', 'seller', 'admin'];
    if (!validRoles.includes(role.toLowerCase())) {
      throw new Error(
        `Invalid role: ${role}. Allowed roles are: ${validRoles.join(', ')}.`
      );
    }

    const existingUsers = await this.#usersModel.find({ email });
    if (existingUsers.length > 0) {
      throw new Error(`A user with email ${email} already exists.`);
    }

    const newUser = new User(this.#idGenerator.ID, name, email, password, role);
    await this.#usersModel.create(newUser);
    return newUser;
  }

  /**
   * @param {object} options
   * @param {string} options.email
   * @param {string} options.password
   * @returns {Promise<void>}
   */
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const users = await this.#usersModel.find({ email });
    if (users.length === 0) {
      throw new Error('Invalid email or password.');
    }
    const user = users[0];
    if (user.password !== password) {
      throw new Error('Invalid email or password.');
    }
    localStorage.setItem(UsersService.#loggedInUserIdKey, user.id);
    this.#currentLoggedInUser = user;
  }

  /**
   * @returns {Promise<void>}
   */
  async logout() {
    this.#currentLoggedInUser = null;
    localStorage.removeItem(UsersService.#loggedInUserIdKey);
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
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      await this.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param  {('customer'|'seller'|'admin')[]} roles
   */
  async isAuthorized(...roles) {
    if (!this.#currentLoggedInUser) {
      throw new Error('No user is currently logged in.');
    }

    const user = this.#currentLoggedInUser;

    if (!roles.includes(user.role.toLowerCase())) {
      throw new Error(
        `User does not have the required role. Required roles: ${roles.join(
          ', '
        )}`
      );
    }

    console.log('User is authorized:', user);
  }

  /**
   * @returns {Promise<void>}
   */
  async authenticate() {
    try {
      if (!this.#currentLoggedInUser) {
        throw new Error('No user is currently logged in.');
      }

      const user = this.#currentLoggedInUser;

      if (!user.email || !user.password) {
        throw new Error('User does not have valid credentials.');
      }

      console.log('User authenticated:', user);
    } catch (error) {
      console.error('Authentication failed:', error.message);
      throw error;
    }
  }
}

export const usersService = new UsersService(usersModel, idGenerator);
