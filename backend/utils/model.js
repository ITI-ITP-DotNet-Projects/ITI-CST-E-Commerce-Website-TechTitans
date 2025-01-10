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

  async find(filterOptions, sortingOptions, paginationOptions) {
    /**
     * Utility function to check if an object matches the given filter criteria.
     * @param {object} item - The object to test.
     * @param {object} filterOptions - The filter options, which can be nested.
     * @returns {boolean} - Whether the object matches the filter criteria.
     */
    function matchesFilter(item, filterOptions) {
      return Object.entries(filterOptions).every(([key, value]) => {
        const itemValue = item[key];

        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Recursively check nested objects
          return matchesFilter(itemValue, value);
        }

        if (typeof value === 'function') {
          // Predicate function
          return value(itemValue);
        }

        // Direct equality
        return itemValue === value;
      });
    }

    /**
     * Utility function to get a nested value from an object based on a dot-separated key.
     * @param {object} obj - The object to extract the value from.
     * @param {string} path - The dot-separated path to the nested value (e.g., 'specification.brand').
     * @returns {any} - The value at the specified path, or undefined if the path does not exist.
     */
    function getNestedValue(obj, path) {
      return path
        .split('.')
        .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    }

    const collection = this.Collection;
    let results = collection;

    // Filtration
    if (filterOptions && Object.keys(filterOptions).length > 0) {
      results = collection.filter((item) => matchesFilter(item, filterOptions));
    }

    // Sorting
    if (sortingOptions && Object.keys(sortingOptions).length > 0) {
      results.sort((a, b) => {
        for (const [key, order] of Object.entries(sortingOptions)) {
          const valueA = getNestedValue(a, key);
          const valueB = getNestedValue(b, key);

          if (valueA < valueB) return order === 1 ? -1 : 1;
          if (valueA > valueB) return order === 1 ? 1 : -1;
        }
        return 0;
      });
    }

    // Pagination
    if (
      paginationOptions &&
      paginationOptions.pageNum &&
      paginationOptions.limit
    ) {
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
    return objData;
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
