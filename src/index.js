import {kiteSpots, locationService, windService} from './infrastructure/di.js';
import {KiteScore} from './domain/KiteScore.js';

const house = {latitude: 50.87979439530528, longitude: 4.5829122025207365};

const closestKiteSpots = await kiteSpots().getClosest(house, {top: 1});
for (const kiteSpot of closestKiteSpots) {
  const locationForecast = await windService().getForecast(kiteSpot.coordinates);
  const locationTimezone = locationService().getTimeZoneOfCoordinates(kiteSpot.coordinates);

  const happy = new KiteScore(kiteSpot, locationForecast.forecast(), locationTimezone);

  const percentageDisplay = (percentage) => `${Math.round(percentage * 100)} %`.padStart(5, ' ');
  const happinessIcon = (percentage) => {
    if (percentage >= 0.95) {
      return '🚀';
    }
    if (percentage >= 0.9) {
      return '😎';
    }
    if (percentage >= 0.7) {
      return '👍';
    }
    if (percentage >= 0.7) {
      return '😬';
    }
    if (percentage >= 0.5) {
      return '🤔';
    }

    return '💩';
  };

  for (const stats of happy.byHour()) {
    const icons = [];
    const windSpeed = stats.pieces.find(p => p.name === 'windSpeed');
    const windDirection = stats.pieces.find(p => p.name === 'windDirection');
    const sun = stats.pieces.find(p => p.name === 'sun');
    const constancy = stats.pieces.find(p => p.name === 'constancy');
    const dry = stats.pieces.find(p => p.name === 'dry');

    icons.push(`${percentageDisplay(sun.percentage)}`.padStart(5, ' '));
    if (sun.percentage >= 0.9) {
      icons.push('☀️ ');
    } else if (sun.percentage >= 0.8) {
      icons.push('🌤 ');
    } else if (sun.percentage >= 0.5) {
      icons.push('⛅️');
    } else {
      icons.push('☁️️ ');
    }

    if (dry.percentage === 1) {
      icons.push(`   ☂️   `);
    } else {
      icons.push(`🌧 ${`--`.padStart(5, ' ')}`);
    }

    if (constancy.percentage < 0.5) {
      icons.push('🌪 '.padEnd(9, ' '));
    } else {
      if (windSpeed.percentage > 0) {
        icons.push(`🪁 ${percentageDisplay(windSpeed.percentage)}`);
      } else {
        icons.push('🍃'.padEnd(8, ' '));
      }
    }
    if (windDirection.percentage === 1) {
      icons.push('🔛');
    } else {
      if (windDirection.percentage === 0) {
        icons.push('⛔️');
      } else {
        icons.push('⚠️ ');
      }
    }
    icons.push('###');
    icons.push(`🌬 ${percentageDisplay(windSpeed.percentage)}`);
    icons.push(`🧭 ${percentageDisplay(windDirection.percentage)}`);
    icons.push(`🕶 ${percentageDisplay(sun.percentage)}`);
    icons.push(`📈 ${percentageDisplay(constancy.percentage)}`);
    icons.push(`🌵 ${percentageDisplay(dry.percentage)}`);

    icons.push(`🤓 ${windSpeed.raw} (${windDirection.raw}), ${constancy.raw}, ${sun.raw}, ${dry.raw}`);

    const isDuringDay = stats.time.between(9, 20);
    const color = isDuringDay ? '\x1b[37m%s\x1b[0m' : '\x1b[2m%s\x1b[0m';
    console.log(color, `${stats.time.shortFormat()} => ${percentageDisplay(stats.score)} ${happinessIcon(stats.score)} => ${`${stats.speed}`.padStart(2, ' ')} - ${`${stats.gust}`.padStart(2, ' ')} kts (${icons.join('|')})`);
  }

  console.log('--------');
  console.log('► BY DAY');
  console.log('--------');

  for (const {date, score} of happy.byDay()) {
    const icons = [];
    icons.push(`Kiteable ${percentageDisplay(score.enoughProbability)} of the day`);
    icons.push(`⨏ ${score.average} kts`);
    icons.push(`${score.minSpeed} to ${score.maxSpeed} kts 💨 ${score.maxGust} kts`);
    const color = score.windyScore > 0.7 ? '\x1b[32m%s\x1b[0m' : '\x1b[2m%s\x1b[0m';

    console.log(color, `${date} => ${percentageDisplay(score.windyScore)} ${happinessIcon(score.windyScore)} (${icons.join('|')})`);
  }
}
