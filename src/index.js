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
    const isDuringDay = datetime.between(9, 19);
    icons.push(`${` ${f.cloud}`.substr(-3)} %`)
    if (f.cloud <=5) {
      icons.push('☀️ ');
    } else if (f.cloud <= 25) {
      icons.push('🌤 ');
    } else if (f.cloud <= 50) {
      icons.push('⛅️');
    } else if (f.cloud <= 75) {
      icons.push('🌥️ ');
    } else {
      icons.push('☁️️ ');
    }
    if (wind.isGusty()) {
      icons.push('🌪');
      icons.push('💨');
    } else {
      if (wind.isEnough()) {
        icons.push('🪁');
      } else {
        icons.push('🍃');
      }
    }
    const windDirection = kiteSpot.windOrientation(wind);
    if (windDirection.isOn()) {
      icons.push('🔛');
    } else {
      if (windDirection.direction() === 'side') {
        icons.push('⚠️');
      } else {
        icons.push('⛔️');
      }
    }
    if (wind.isEnough() && !wind.isGusty() && windDirection.isOn()) {
      icons.push('==> 🚀');
    } else {
      icons.push('==> 💩');
    }

    const color = isDuringDay ? '\x1b[37m%s\x1b[0m' : '\x1b[2m%s\x1b[0m';
    console.log(color, `${datetime.shortFormat()} => ${wind.speed()}-${wind.gust()} kn: ${icons.join('|')} `);
  }
}
