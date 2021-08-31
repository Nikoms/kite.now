import {DateTime} from './DateTime.js';
import {probabilityMoreThan} from './probability.js';

export const scoreType = {
  windSpeed: 'windSpeed',
  windDirection: 'windDirection',
  constancy: '',
  sun: 'sun',
  dry: 'dry',
};

const chillLevelForSpeed = (windSpeed) => {
  if (windSpeed <= 12) {
    return 0;
  }
  if (windSpeed <= 17) {
    return 1;
  }

  if (windSpeed <= 21) {
    return 0.75;
  }

  if (windSpeed <= 25) {
    return 0.5;
  }

  if (windSpeed <= 30) {
    return 0.3;
  }

  return 0;
};

const windDirectionScore = (windDirection) => {
  if (windDirection.isOn()) {
    return 1;
  } else {
    if (windDirection.direction() === 'side') {
      return 0.5;
    } else {
      return 0;
    }
  }
};
const nicePercentage = (percentage) => Number(percentage.toFixed(2));

export class KiteScore {
  #kiteSpot;
  #timezone;
  #forecast;

  /**
   * @param {import("KiteSpot").KiteSpot} kiteSpot
   * @param {import("Forecast").Forecast} forecast
   * @param {string} timezone
   */
  constructor(kiteSpot, forecast, timezone) {
    this.#kiteSpot = kiteSpot;
    this.#timezone = timezone;
    this.#forecast = forecast;
  }

  /**
   * @param {import("./types").HourlyForecast} hourlyForecast
   * @return {import("./types").HourlyScore}
   */
  #hourlyScore(hourlyForecast) {
    const wind = hourlyForecast.wind.toKnots();
    const gustyLevel = (wind.gust() - wind.speed()) / 12;
    const sunLevel = (100 - hourlyForecast.cloud) / 100;
    const constancyLevel = 1 - gustyLevel;
    const dryLevel = hourlyForecast.rain.isRaining() ? 0 : 1;
    const directionScore = windDirectionScore(this.#kiteSpot.windOrientation(wind));
    const pieces = [
      {
        name: 'windSpeed',
        percentage: nicePercentage(chillLevelForSpeed(wind.speed())),
        weight: 1,
        raw: `Wind at ${wind.speed()} kts`,
      },
      {name: 'constancy', percentage: nicePercentage(constancyLevel), weight: 3, raw: `Gust at ${wind.gust()} kts`},
      {name: 'windDirection', percentage: nicePercentage(directionScore), weight: 1, raw: `${wind.angle()}°`},
      {
        name: 'sun',
        percentage: nicePercentage(sunLevel),
        weight: sunLevel > 0.5 ? 2 : 0.5,
        raw: `Cloudy at ${hourlyForecast.cloud} %`,
      },
      {
        name: 'dry',
        percentage: nicePercentage(dryLevel),
        weight: 1,
        raw: hourlyForecast.rain.isRaining() ? `${hourlyForecast.rain.toSnapshot()} mm` : 'no rain',
      },
    ];
    const totalScore = pieces.map(p => p.percentage * p.weight).reduce((a, b) => a + b, 0);
    const totalWeight = pieces.map(p => p.weight).reduce((a, b) => a + b, 0);
    const score = wind.isEnough() ? Math.round(100 * totalScore / totalWeight) / 100 : 0;

    return {
      speed: wind.speed(),
      gust: wind.gust(),
      enoughWind: wind.isEnough(),
      pieces,
      score,
      time: new DateTime(hourlyForecast.time, this.#timezone),
    };
  };

  /**
   * @return {{date:string, score:import("./types").DailyScore}[]}
   */
  byDay() {
    const dailyForecast = this.#forecast.splitByDay(this.#timezone);
    const days = [];
    for (const {time, forecast} of dailyForecast) {
      const dailyScore = this.#forecastResume(forecast, {from: 9, to: 20});
      if (dailyScore !== null) {
        days.push({date: time.ymd(), score: dailyScore});
      }
    }
    return days;
  }

  /**
   * @return {import("./types").HourlyScore[]}
   */
  byHour() {
    const hours = [];
    for (const hourlyForecast of this.#forecast.asList()) {
      hours.push(this.#hourlyScore(hourlyForecast));
    }
    return hours;
  }

  /**
   * @param {Forecast} forecast
   * @param {import("./types").Interval} timeInterval
   * @return {import("./types").DailyScore}
   */
  #forecastResume(forecast, timeInterval) {
    const hourlyAnalysis = [];
    for (const hourlyForecast of forecast.asList()) {
      const time = new DateTime(hourlyForecast.time, this.#timezone);
      if (time.hourBetween(timeInterval.from, timeInterval.to)) {
        const hourlyScore = this.#hourlyScore(hourlyForecast);
        hourlyAnalysis.push(hourlyScore);
      }
    }
    if (hourlyAnalysis.length === 0) {
      return null;
    }

    const hourlyWithWind = hourlyAnalysis.filter(ha => ha.enoughWind);
    const totalHours = hourlyAnalysis.length;
    const speeds = hourlyAnalysis.map(a => a.speed);
    const gusts = hourlyAnalysis.map(a => a.gust);

    return {
      precision: Number((totalHours / (timeInterval.to - timeInterval.from + 1)).toFixed(2)),
      average: Math.round(speeds.reduce((a, b) => a + b, 0) / totalHours),
      enoughProbability: probabilityMoreThan(speeds, 13),
      minSpeed: Math.min(...speeds),
      maxSpeed: Math.max(...speeds),
      maxGust: Math.max(...gusts),
      score: (hourlyAnalysis.map(ha => ha.score).reduce((a, b) => a + b, 0) / totalHours),
      windyScore: hourlyWithWind.length ? (hourlyWithWind.map(ha => ha.score).reduce((a, b) => a + b, 0) / hourlyWithWind.length) : 0,
    };
  }
}
