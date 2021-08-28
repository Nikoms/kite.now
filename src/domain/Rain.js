export class Rain {
  #mm;

  static fromSnapshot(snapshot) {
    if (snapshot === 'no') {
      return new Rain(0);
    }
    return new Rain(snapshot);
  }

  constructor(mm) {
    this.#mm = mm;
  }

  isRaining() {
    return this.#mm > 0;
  }

  toSnapshot() {
    if (this.#mm === 0) {
      return 'no';
    }
    return this.#mm;
  }
}
