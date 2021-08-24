import {kiteSpots, locationService, windService} from './infrastructure/di.js';
import {DateTime} from './domain/DateTime.js';

const house = {latitude: 50.87979439530528, longitude: 4.5829122025207365};

const closestKiteSpots = await kiteSpots().getClosest(house, {top: 1});
for (const kiteSpot of closestKiteSpots) {
  const locationForecast = await windService().getForecast(kiteSpot.coordinates);
  const kiteSpotTimeZone = locationService().getTimeZoneOfCoordinates(kiteSpot.coordinates);

  for (const f of locationForecast.forecastParts()) {
    const wind = f.wind.toKnots();
    const datetime = new DateTime(f.time, kiteSpotTimeZone);
    const icons = [];
    if (!datetime.between(9, 19)) {
      icons.push('💤');
    }
    if (wind.isEnough() && !wind.isGusty()) {
      icons.push('👍');
    }
    if (wind.isTooLight()) {
      icons.push('🍃');
    }
    if (wind.isGusty()) {
      icons.push('🌪💨');
    }

    console.log(`${datetime} => ${icons.join('|')} ${wind.speed()} to ${wind.gust()} ${wind.unit()}`);
  }
}
