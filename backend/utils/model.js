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
    const collection = this.Collection;
    const results = collection.filter((item) => {
      return Object.entries(filterOptions).every(
        ([key, value]) => item[key] === value
      );
    });

    return results;
  }

  /**
   * @param {object} objData
   * @returns {Promise<object>}
   */
  async create(objData) {
    try {
      if (!objData || objData.constructor.name !== 'Object') {
        throw new Error('Invalid data provided for creation.');
      }
      const collection = this.Collection;
      objData.id =
        collection.length > 0 ? collection[collection.length - 1].id + 1 : 1;
      collection.push(objData);
      this.Collection = collection;
    } catch (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
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
