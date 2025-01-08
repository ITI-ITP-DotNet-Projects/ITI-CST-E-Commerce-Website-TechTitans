import { User, usersModel } from '../models/users.model.js';
import { IdGenerator, idGenerator } from '../utils/idGenerator.js';
import { Model } from '../utils/model.js';

export class UsersService {
  #usersModel;
  #idGenerator;
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
   * @returns {Promise<User|null>}
   *+
   */
  async getCurrentLoggedInUser() {
    const userId = localStorage.getItem(UsersService.#loggedInUserIdKey);
    if (!userId) {
      return null;
    }
    const [user] = await this.#usersModel.find({ id: Number(userId) });

    return user ? user : null;
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

    const [existingUser] = await this.#usersModel.find({ email });
    if (existingUser) {
      throw new Error(`A user with email ${email} already exists.`);
    }

    const newUser = new User(
      this.#idGenerator.ID,
      name,
      email,
      password,
      role.toLowerCase()
    );
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
  }

  /**
   * @returns {Promise<void>}
   */
  async logout() {
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
    const loggedInUser = await this.getCurrentLoggedInUser();
    return Boolean(loggedInUser);
  }

  /**
   * @param  {('customer'|'seller'|'admin')[]} roles
   * @returns {Promise<boolean>}
   */
  async isAuthorized(...roles) {
    const loggedInUser = await this.getCurrentLoggedInUser();

    if (!loggedInUser || !roles.includes(loggedInUser.role.toLowerCase())) {
      return false;
    }

    return true;
  }
}

export const usersService = new UsersService(usersModel, idGenerator);
