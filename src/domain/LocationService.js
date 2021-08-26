import geoTz from 'geo-tz';

export class LocationService {
  getTimeZoneOfCoordinates(coordinates) {
    return geoTz(coordinates.latitude, coordinates.longitude);
  }
}
