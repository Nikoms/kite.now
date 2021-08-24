import {KiteSpots} from '../domain/KiteSpots.js';
import {KiteSpot} from '../domain/KiteSpot.js';

export class InMemoryKiteSpots extends KiteSpots {
  /**
   * @param {import("../domain/types").KiteSpotSnapShot[]} kiteSpots
   */
  constructor(kiteSpots) {
    super();
    this.kiteSpots = kiteSpots;
  }

  async getClosest(coordinates, options) {
    let kiteSpotsWithDistance = this.kiteSpots.map(ks => ({
      ...ks,
      distance: Math.round(distanceBetween(coordinates, ks.coordinates)),
    }));
    if (options?.maxDistance !== undefined) {
      kiteSpotsWithDistance = kiteSpotsWithDistance.filter(ks => ks.distance <= options.maxDistance);
    }
    kiteSpotsWithDistance.sort((a, b) => (a.distance - b.distance));
    if (options?.top !== undefined)
      return kiteSpotsWithDistance.slice(0, options.top).map(snapshot => KiteSpot.fromSnapshot(snapshot));

    return kiteSpotsWithDistance.map(snapshot => KiteSpot.fromSnapshot(snapshot));
  }
}


/**
 * @param {import("../domain/types").Coordinates} coordinatesFrom
 * @param {import("../domain/types").Coordinates} coordinatesTo
 * @return {number}
 */
function distanceBetween(coordinatesFrom, coordinatesTo) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coordinatesTo.latitude - coordinatesFrom.latitude);  // deg2rad below
  const dLon = deg2rad(coordinatesTo.longitude - coordinatesFrom.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coordinatesFrom.latitude)) * Math.cos(deg2rad(coordinatesTo.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
