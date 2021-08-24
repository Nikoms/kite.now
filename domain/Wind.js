export class Wind {
  #speed;
  #unit;
  #gust;
  #degree;

  constructor(speed, unit, gust, degree) {
    this.#speed = speed;
    this.#unit = unit;
    this.#gust = gust;
    this.#degree = degree;
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
        this.#degree,
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

  toSnapshot() {
    return {
      speed: this.#speed,
      unit: this.#unit,
      degree: this.#degree,
      gust: this.#gust,
    };
  }

  isTooLight() {
    return !this.isEnough();
  }

  isEnough() {
    return this.toKnots().speed() >= 12;
  }

  isGusty() {
    return this.toKnots().gust() - this.toKnots().speed() >= 8;
  }
}
