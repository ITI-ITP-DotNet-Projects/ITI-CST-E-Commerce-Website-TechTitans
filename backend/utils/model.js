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
   * @param {Object<string, -1|1>?} sortingOptions - The sorting options, where keys are fields and values are -1 (descending) or 1 (ascending).
   * @param {Object?} paginationOptions - The pagination options.
   * @param {number} paginationOptions.pageNum - The page number to fetch.
   * @param {number} paginationOptions.limit - The number of items per page.
   * @returns {Promise<any[]>}
   */
  async find(filterOptions, sortingOptions, paginationOptions) {
    const collection = this.Collection;
    let results = collection;

    // filtration
    if (filterOptions) {
      results = collection.filter((item) => {
        return Object.entries(filterOptions).every(([key, value]) => {
          // filter with single predicate
          if (value.constructor.name === 'Function') {
            return value(item[key]);
          }

          // normal filtration
          return item[key] === value;
        });
      });
    }

    // sorting
    if (sortingOptions) {
      results.sort((a, b) => {
        for (const [key, order] of Object.entries(sortingOptions)) {
          if (a[key] < b[key]) return order === 1 ? -1 : 1;
          if (a[key] > b[key]) return order === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    // pagination
    if (paginationOptions) {
      const { pageNum = 1, limit = 10 } = paginationOptions;
      const startIndex = (pageNum - 1) * limit;
      results = results.slice(startIndex, startIndex + limit);
    }
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
    const collection = this.Collection;

    const index = collection.findIndex((item) => item.id === objId);

    if (index === -1) {
      throw new Error(`Object with ID ${objId} not found`);
    }

    const { id, ...safeDataToUpdate } = data2Update;

    const deepMerge = (target, source) => {
      for (const key in source) {
        if (!target.hasOwnProperty(key)) {
          throw new Error(`Key "${key}" does not exist in the target object`);
        }

        if (source[key] instanceof Object && !(source[key] instanceof Array)) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    const updatedObject = await deepMerge(collection[index], safeDataToUpdate);
    collection[index] = updatedObject;

    this.Collection = collection;

    return updatedObject;
  }

  /**
   * @param {number} objId
   * @returns {Promise<object|undefined>}
   */
  async delete(objId) {
    const collection = this.Collection;
    const index = collection.findIndex((item) => item.id === objId);

    if (index === -1) {
      throw new Error(`Object with ID ${objId} not found`);
    }

    const [deletedObject] = collection.splice(index, 1);
    this.Collection = collection;

    return deletedObject;
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
