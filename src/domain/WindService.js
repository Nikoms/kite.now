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
      console.log(forecast);
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
        sky: WindService.#convertSkyIconToText(forecast['weather'][0]['icon']),
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
          sky: WindService.#convertSkyIconToText(forecast['weather'][0]['icon']),
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
   * @param {string} icon
   */
  static #convertSkyIconToText(icon) {
    switch (icon.substr(0, 2)) {
      case '01':
        return 'clearSky';
      case '02':
        return 'fewClouds';
      case '03':
        return 'scatteredClouds';
      case '04':
        return 'brokenClouds';
      case '09':
        return 'rain';
      case '10':
        return 'rain';
      case '11':
        return 'thunderstorm';
      case '13':
        return 'snow';
      case '50':
        return 'mist';
    }
    throw new Error(`Icon "${icon}" unknown`);
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
