import fs from 'fs';
import {LocationForecast} from './LocationForecast.js';

export class WindService {
  /**
   *
   * @param {Api} api
   * @param apiKey
   * @param rootDir
   */
  constructor(api, apiKey = '', rootDir = '') {
    this.rootDir = rootDir;
    this.api = api;
    this.apiKey = apiKey;
  }

  /**
   * @param {import("./types").Coordinates} coordinates
   * @return {LocationForecast}
   */
  async getForecast(coordinates) {
    if (this.#hasCache(coordinates)) {
      return this.#getCache(coordinates);
    }
    const twoDaysForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric&exclude=minutely,current,daily,alerts`;
    const twoDaysForecastResponse = await this.api.getJson(twoDaysForecastUrl);

    const forecastSnapshot = {};
    for (const forecast of twoDaysForecastResponse['hourly']) {
      console.log(forecast)
      forecastSnapshot[forecast['dt'] * 1000] = {
        time: forecast['dt'] * 1000,
        type: 'hour',
        wind: {
          speed: forecast['wind_speed'],
          angle: forecast['wind_deg'],
          gust: forecast['wind_gust'],
          unit: 'm/s',
        },
        cloud: forecast['clouds'],
      };
    }

    const fiveDaysForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
    const fiveDaysForecastResponse = await this.api.getJson(fiveDaysForecastUrl);

    console.log(JSON.stringify(fiveDaysForecastResponse, null, '    '));

    for (const forecast of fiveDaysForecastResponse.list) {
      if (forecastSnapshot[forecast['dt'] * 1000] === undefined) {
        forecastSnapshot[forecast['dt'] * 1000] = {
          time: forecast['dt'] * 1000,
          type: 'hour',
          wind: {
            speed: forecast['wind']['speed'],
            angle: forecast['wind']['deg'],
            gust: forecast['wind']['gust'],
            unit: 'm/s',
          },
          cloud: forecast['clouds']['all'],
        };
      }
    }

    const locationForecast = LocationForecast.fromSnapshot({
      coordinates,
      forecast: Object.values(forecastSnapshot),
      date: Date.now(),
    });

    this.#setCache(coordinates, locationForecast);

    return locationForecast;
  }

  /**
   * @param {import("./types").Coordinates} coordinates
   * @return {boolean}
   */
  #hasCache(coordinates) {
    const cacheName = `${coordinates.latitude}-${coordinates.longitude}`;
    return fs.existsSync(`${this.rootDir}/cache/${cacheName}.json`);
  }

  /**
   * @param {import("./types").Coordinates} coordinates
   * @return {LocationForecast}
   */
  #getCache(coordinates) {
    const cacheName = `${coordinates.latitude}-${coordinates.longitude}`;
    return LocationForecast.fromSnapshot(JSON.parse(fs.readFileSync(`${this.rootDir}/cache/${cacheName}.json`)));
  }

  /**
   * @param {import("./types").Coordinates} coordinates
   * @param {LocationForecast} forecast
   */
  #setCache(coordinates, forecast) {
    const cacheName = `${coordinates.latitude}-${coordinates.longitude}`;
    fs.writeFileSync(`${this.rootDir}/cache/${cacheName}.json`, JSON.stringify(forecast.toSnapshot(), null, '    '));
  }
}
