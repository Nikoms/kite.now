import {constructorShouldBeConcrete, methodMustBeImplemented} from '../sharedKernel/AbstractClass.js';

export class KiteSpots {
  constructor() {
    constructorShouldBeConcrete(this.constructor, KiteSpots);
  }

  /**
   * @param {import("./types").Coordinates} coordinates
   * @param {{top: number, maxDistance: number}} options
   * @return {Promise<import("./KiteSpot").KiteSpot[]>}
   */
  async getClosest(coordinates, options) {
    throw methodMustBeImplemented(coordinates);
  }
}
