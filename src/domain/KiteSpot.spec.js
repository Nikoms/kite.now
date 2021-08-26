import {Wind} from './Wind.js';
import {BeachWindOrientation} from './BeachWindOrientation.js';
import {KiteSpot} from './KiteSpot.js';

const computeDirectionFromBeachAngle = (beachAngle) => (windAngle) => {
  const kiteSpot = new KiteSpot({name: '', coordinates: {latitude: 0, longitude: 0}, beachAngle});
  return kiteSpot.windOrientation(new Wind(0, 'ms', 0, windAngle));
};


describe('#calculate wind direction depending on the beach', () => {
  describe('The "perfect equator beach" angle is 0°', () => {
    const computeEquatorDirection = computeDirectionFromBeachAngle(0);

    it('The wind is perfectly "on" to this beach when the wind is 0° _⬇_ and +/-15%', () => {
      expect(computeEquatorDirection(0)).toEqual(new BeachWindOrientation(90));
      expect(computeEquatorDirection(15)).toEqual(new BeachWindOrientation(105));

      expect(computeEquatorDirection(359)).toEqual(new BeachWindOrientation(89));
      expect(computeEquatorDirection(345)).toEqual(new BeachWindOrientation(75));
    });

    it('The wind is "mostly on" when it is between 16° and 45° _↙_ or between 315° to 344° _↘_', () => {
      expect(computeEquatorDirection(16)).toEqual(new BeachWindOrientation(106));
      expect(computeEquatorDirection(45)).toEqual(new BeachWindOrientation(135));

      expect(computeEquatorDirection(344)).toEqual(new BeachWindOrientation(74));
      expect(computeEquatorDirection(315)).toEqual(new BeachWindOrientation(45));
    });

    it('The wind is "mostly side" (on) when it is between 46° and 75° _↙_ or between 285° to 314° _↘_', () => {
      expect(computeEquatorDirection(46)).toEqual(new BeachWindOrientation(136));
      expect(computeEquatorDirection(75)).toEqual(new BeachWindOrientation(165));

      expect(computeEquatorDirection(285)).toEqual(new BeachWindOrientation(15));
      expect(computeEquatorDirection(314)).toEqual(new BeachWindOrientation(44));
    });

    it('The wind is parallel (side) to this beach when the wind is 90° _⬅_ or 270° _➡_ (+/- 15%)', () => {
      expect(computeEquatorDirection(76)).toEqual(new BeachWindOrientation(166));
      expect(computeEquatorDirection(105)).toEqual(new BeachWindOrientation(195));

      expect(computeEquatorDirection(255)).toEqual(new BeachWindOrientation(345));
      expect(computeEquatorDirection(284)).toEqual(new BeachWindOrientation(14));
    });

    it('The wind is "mostly side" (off) when it is between 106° and 135° _↖_ or between 225° to 254° _↗_', () => {
      expect(computeEquatorDirection(106)).toEqual(new BeachWindOrientation(196));
      expect(computeEquatorDirection(135)).toEqual(new BeachWindOrientation(225));

      expect(computeEquatorDirection(225)).toEqual(new BeachWindOrientation(315));
      expect(computeEquatorDirection(254)).toEqual(new BeachWindOrientation(344));
    });

    it('The wind is "mostly off" when it is between 136° and 165° _↖_ or between 315° to 344° _↗_', () => {
      expect(computeEquatorDirection(136)).toEqual(new BeachWindOrientation(226));
      expect(computeEquatorDirection(165)).toEqual(new BeachWindOrientation(255));

      expect(computeEquatorDirection(195)).toEqual(new BeachWindOrientation(285));
      expect(computeEquatorDirection(224)).toEqual(new BeachWindOrientation(314));
    });

    it('The wind is perfectly off to this beach when the wind is 180 _⬆_ (+/-15°)', () => {
      expect(computeEquatorDirection(175)).toEqual(new BeachWindOrientation(265));
      expect(computeEquatorDirection(194)).toEqual(new BeachWindOrientation(284));
    });
  });
  describe('Beach angle is 90°', () => {
    const compute90BeachDirection = computeDirectionFromBeachAngle(90);
    it('The wind is perfectly "on" to this beach when the wind is 270° +/-15%', () => {
      expect(compute90BeachDirection(255)).toEqual(new BeachWindOrientation(75));
      expect(compute90BeachDirection(270)).toEqual(new BeachWindOrientation(90));
      expect(compute90BeachDirection(285)).toEqual(new BeachWindOrientation(105));
    });
    it('The wind is perfectly "off" to this beach when the wind is 90° +/-15%', () => {
      expect(compute90BeachDirection(76)).toEqual(new BeachWindOrientation(256));
      expect(compute90BeachDirection(90)).toEqual(new BeachWindOrientation(270));
      expect(compute90BeachDirection(104)).toEqual(new BeachWindOrientation(284));
    });
  });
});
