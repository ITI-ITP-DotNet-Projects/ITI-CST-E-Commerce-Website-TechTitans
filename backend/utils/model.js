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
      const collection = this.Collection;
      collection.push(objData);
      this.Collection = collection;
  }

  /**
   * @param {number} objId
   * @param {object} data2Update
   * @returns {Promise<object|undefined>}
   */
  async update(objId, data2Update) {
        // TODO: @MohamedBreya
    const collection = this.Collection;


    const index = collection.findIndex(item => item.id === objId);

    if (index === -1) {
      return Promise.reject(`Object with ID ${objId} not found`);
    }


    const { id, ...safeDataToUpdate } = data2Update;

    const deepMerge = (target, source) => {
      for (const key in source) {

        if (!target.hasOwnProperty(key)) {
    
          return Promise.reject(`Key "${key}" does not exist in the target object`);
        }


        if (source[key] instanceof Object && !(source[key] instanceof Array)) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        }

        else if (Array.isArray(source[key])) {
          target[key] = [...(target[key] || []), ...source[key]];
        }

        else {
          target[key] = source[key];
        }
      }
      return target;
    };


    try {
      const updatedObject = await deepMerge(collection[index], safeDataToUpdate);
      collection[index] = updatedObject;


      this.Collection = collection;


      return Promise.resolve(updatedObject);
    } catch (error) {

      return Promise.reject(error);
    }
    
    // throw new Error('Method not implemented yet!');
  }

  /**
   * @param {number} objId
   * @returns {Promise<object|undefined>}
   */
  async delete(objId) {
    // TODO: @MohamedBreya
    const collection = this.Collection;
    const index = collection.findIndex(item => item.id === objId);

    if (index === -1) {
      return Promise.reject(`Object with ID ${objId} not found`);
    }

    const [deletedObject] = collection.splice(index, 1);
    this.Collection = collection;

    return Promise.resolve(deletedObject);
 
    // throw new Error('Method not implemented yet!');
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
