export class IdGenerator {
  /**
   * @returns {number}
   */
  get ID() {
    return (
      (Date.now() * 1000 +
        Math.floor(performance.now() * 1000) +
        Math.round(Math.random() * 10) +
        100000) %
      100000
    );
  }
}

export const idGenerator = new IdGenerator();
