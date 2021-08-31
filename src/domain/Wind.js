export class Wind {
  #speed;
  #unit;
  #gust;
  #angle;

  constructor(speed, unit, gust, angle) {
    this.#speed = speed;
    this.#unit = unit;
    this.#gust = gust;
    this.#angle = angle;
  }

  toKnots() {
    if (this.#unit === 'knots') {
      return this;
    }
    if (this.#unit === 'm/s') {
      return new Wind(
        this.#speed * 1.943844492,
        'knots',
        this.#gust * 1.943844492,
        this.#angle,
      );
    }
    throw new Error(`"${this.#unit}" can not be converted to knots`);
  }

  speed() {
    return Math.round(this.#speed);
  }

  gust() {
    return Math.round(this.#gust);
  }

  unit() {
    return this.#unit;
  }

  angle() {
    return this.#angle;
  }

  toSnapshot() {
    return {
      speed: this.#speed,
      unit: this.#unit,
      angle: this.#angle,
      gust: this.#gust,
    };
  }

  isEnough() {
    return this.toKnots().speed() >= 13;
  }

  isGusty() {
    return this.toKnots().gust() - this.toKnots().speed() >= 7;
  }
}
