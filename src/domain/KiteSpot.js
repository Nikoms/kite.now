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
}
