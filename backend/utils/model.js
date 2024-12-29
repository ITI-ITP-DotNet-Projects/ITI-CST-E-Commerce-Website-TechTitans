export class Model {
  #collectionKey;

  constructor(collectionKey) {
    this.#collectionKey = collectionKey;
  }

  /**
   * @returns {string}
   */
  get collectionKey() {
    return this.#collectionKey;
  }

  /**
   * @param {object} filterOptions
   * @returns {Promise<any[]>}
   */
  async find(filterOptions) {
    // TODO: @Alaa20khedr
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {object} objData
   * @returns {Promise<object>}
   */
  async create(objData) {
    // TODO: @Alaa20khedr
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {number} objId
   * @param {object} data2Update
   * @returns {Promise<object|undefined>}
   */
  async update(objId, data2Update) {
    // TODO: @MohamedBreya
    throw new Error('Method not implemented yet!');
  }

  /**
   * @param {number} objId
   * @returns {Promise<object|undefined>}
   */
  async delete(objId) {
    // TODO: @MohamedBreya
    throw new Error('Method not implemented yet!');
  }

  /**
   * @returns {any[]}
   */
  get Collection() {
    const collection = localStorage.getItem(this.#collectionKey);
    return collection ? JSON.parse(collection) : [];
  }

  set Collection(collection) {
    localStorage.setItem(this.collectionKey, JSON.stringify(collection));
  }
}
