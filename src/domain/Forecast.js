import {Wind} from './Wind.js';

export class Forecast {
  /**
   * @type {import("./types").ForecastPart[]}
   */
  #forecastParts;

  /**
   * @param {import("./types").ForecastSnapshot} snapshot
   * @return {Forecast}
   */
  static fromSnapshot(snapshot) {
    return new Forecast(snapshot.map(s => {
      return {
        time: new Date(s.time),
        type: s.type,
        wind: new Wind(s.wind.speed, s.wind.unit, s.wind.gust, s.wind.angle),
      };
    }));
  }

  byHour() {
    return new Forecast(this.#forecastParts.filter(f => f.type === 'hour'));
  }

  /**
   * @return {import("./types").ForecastPart[]}
   */
  asList() {
    return [...this.#forecastParts];
  }

  /**
   *
   * @param {import("./types").ForecastPart[]} forecastParts
   */
  constructor(forecastParts) {
    this.#forecastParts = forecastParts;
  }

  /**
   * @returns {import("./types").ForecastSnapshot}
   */
  toSnapshot() {
    return this.#forecastParts.map(s => ({
      time: s.time.getTime(),
      type: s.type,
      wind: s.wind.toSnapshot(),
    }));
  }
}
