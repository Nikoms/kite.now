import {Forecast} from './Forecast.js';

export class LocationForecast {
  /**
   * @type {import("./types").Coordinates}
   */
  #coordinates;
  /**
   * @type {Forecast}
   */
  #forecast;
  /**
   * @type {Date}
   */
  #date;

  /**
   * @param {import("./types").LocationForecastSnapshot} snapshot
   * @return {LocationForecast}
   */
  static fromSnapshot(snapshot) {
    return new LocationForecast(snapshot.coordinates, Forecast.fromSnapshot(snapshot.forecast), new Date(snapshot.date));
  }

  /**
   *
   * @param {Coordinates} coordinates
   * @param {Forecast} forecast
   * @param {Date} date
   */
  constructor(coordinates, forecast, date) {
    this.#coordinates = coordinates;
    this.#forecast = forecast;
    this.#date = date;
  }

  /**
   * @return {LocationForecast}
   */
  byHour() {
    return new LocationForecast(this.#coordinates, this.#forecast.byHour(), this.#date);
  }

  /**
   * @return {import("./types").ForecastPart[]}
   */
  forecastParts() {
    return this.#forecast.asList();
  }

  /**
   * @return {import("./types").LocationForecastSnapshot}
   */
  toSnapshot() {
    return {
      coordinates: this.#coordinates,
      forecast: this.#forecast.toSnapshot(),
      date: this.#date.getTime(),
    };
  }
}
