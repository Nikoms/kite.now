import {BeachWindOrientation} from './BeachWindOrientation.js';

export class KiteSpot {
  /**
   *
   * @param {import("./types").KiteSpotSnapshot} snapshot
   * @returns KiteSpot
   */
  static fromSnapshot(snapshot) {
    return new KiteSpot(snapshot);
  }

  /**
   * @param {{name:string, coordinates:import("./types").Coordinates, beachAngle:number}} constructor
   * For beachAngle:
   * 0 = "perfect equator parallel" beach: sea UP, beach DOWN
   * 90 = sea LEFT, beach right
   * 180 = beach UP, sea DOWN
   * 270 = beach LEFT, sea RIGHT
   * @example "beachAngle" of "Surfers Paradise" in Belgium is 18°
   */
  constructor({name, coordinates, beachAngle}) {
    this.name = name;
    this.coordinates = coordinates;
    this.beachAngle = beachAngle;
  }

  /**
   * @return {import("./types").KiteSpotSnapshot}
   */
  toSnapshot() {
    return {
      name: this.name,
      coordinates: this.coordinates,
      beachAngle: this.beachAngle,
    };
  }

  /**
   * @param {import("./Wind").Wind} wind
   * @return {BeachWindOrientation}
   */
  windOrientation(wind) {
    // In real life, 0° is a wind coming from the north. 
    // To simplify understanding/computation, we say that 90° is a wind coming from the North
    const simplifiedWind = (wind.angle() + 90) % 360;

    // All beach are not 0°, so we just "turn" the wind to fake the fact the the beach is 0°
    // Adding angle to the wind is turning the wind clockwise.
    // For example, a beach of 20° have a perpendicular wind of 340° (in real life)
    // 20 + 340 = 360° = 0° = wind coming from the north of the "0° fake turned" beach
    const angleFromBeach = (simplifiedWind + this.beachAngle) % 360;

    return new BeachWindOrientation(angleFromBeach);
  }
}
