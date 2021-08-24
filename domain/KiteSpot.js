export class KiteSpot {
  static fromSnapshot(snapshot) {
    return new KiteSpot(snapshot);
  }

  constructor({name, coordinates}) {
    this.name = name;
    this.coordinates = coordinates;
  }

  toSnapshot() {
    return {
      name: this.name,
      coordinates: this.coordinates,
    };
  }
}
