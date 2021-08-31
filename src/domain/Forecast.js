import {Wind} from './Wind.js';
import {Rain} from './Rain.js';
import {DateTime} from './DateTime.js';

export class Forecast {
  /**
   * @type {import("./types").HourlyForecast[]}
   */
  #hourlyForecasts;

  /**
   * @param {import("./types").ForecastSnapshot} snapshot
   * @return {Forecast}
   */
  static fromSnapshot(snapshot) {
    return new Forecast(snapshot.map(s => {
      return {
        time: new Date(s.time),
        wind: new Wind(s.wind.speed, s.wind.unit, s.wind.gust, s.wind.angle),
        cloud: s.cloud,
        sky: s.sky,
        rain: Rain.fromSnapshot(s.rain),
      };
    }));
  }

  /**
   * @return {import("./types").HourlyForecast[]}
   */
  asList() {
    return [...this.#hourlyForecasts];
  }

  /**
   * @param {string} timeZone
   * @return {{time:DateTime, forecast:Forecast}[]}
   */
  splitByDay(timeZone) {
    const days = {};
    const firstTime = {};
    for (const hourlyForecast of this.#hourlyForecasts) {
      const time = new DateTime(hourlyForecast.time, timeZone);
      if (!days[time.ymd()]) {
        days[time.ymd()] = [];
      }
      days[time.ymd()].push(hourlyForecast);
      if (!firstTime[time.ymd()]) {
        firstTime[time.ymd()] = time;
      }
    }

    const locationForecasts = [];
    for (const [day, hourlyForecasts] of Object.entries(days)) {
      locationForecasts.push({
        forecast: new Forecast(hourlyForecasts),
        time: firstTime[day],
      });
    }
    return locationForecasts;
  }

  /**
   *
   * @param {import("./types").HourlyForecast[]} hourlyForecasts
   */
  constructor(hourlyForecasts) {
    this.#hourlyForecasts = hourlyForecasts;
  }

  /**
   * @returns {import("./types").ForecastSnapshot}
   */
  toSnapshot() {
    return this.#hourlyForecasts.map(s => ({
      time: s.time.getTime(),
      wind: s.wind.toSnapshot(),
      cloud: s.cloud,
      sky: s.sky,
      rain: s.rain.toSnapshot(),
    }));
  }
}
