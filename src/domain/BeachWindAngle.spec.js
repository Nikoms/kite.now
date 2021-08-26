import {BeachWindAngle} from './BeachWindAngle.js';

const expectDirection = function ({from, to}, expectedDirection) {
  for (let i = from; i <= to; i++) {
    expect(`${i}:${new BeachWindAngle(i).direction()}`).toBe(`${i}:${expectedDirection}`);
  }
};
const expectShore = function ({from, to}, expectedShore) {
  for (let i = from; i <= to; i++) {
    expect(`${i}:${new BeachWindAngle(i).shore()}`).toBe(`${i}:${expectedShore}`);
  }
};

it('convert angle to direction', () => {
  expectDirection({from: 0, to: 14}, 'side');
  expectDirection({from: 15, to: 44}, 'mostly side');
  expectDirection({from: 45, to: 74}, 'mostly on');
  expectDirection({from: 75, to: 105}, 'on');
  expectDirection({from: 106, to: 135}, 'mostly on');
  expectDirection({from: 136, to: 165}, 'mostly side');
  expectDirection({from: 166, to: 195}, 'side');
  expectDirection({from: 196, to: 225}, 'mostly side');
  expectDirection({from: 226, to: 255}, 'mostly off');
  expectDirection({from: 256, to: 284}, 'off');
  expectDirection({from: 285, to: 314}, 'mostly off');
  expectDirection({from: 315, to: 344}, 'mostly side');
  expectDirection({from: 345, to: 360}, 'side');
});

it('0-180 = on shore', () => {
  expectShore({from: 0, to: 180}, 'on');
});

it('181-360 = off shore', () => {
  expectShore({from: 181, to: 360}, 'off');
});
