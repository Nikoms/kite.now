export class BeachWindOrientation {
  /**
   * @type number
   */
  #angle;

  /**
   * @param {number} angle
   */
  constructor(angle) {
    if (angle < 0 || angle > 360) {
      throw new Error(`${angle} is not a valid angle`);
    }
    this.#angle = angle;
  }

  direction() {
    if (this.#angle >= 0 && this.#angle <= 14) {
      return 'side';
    }
    if (this.#angle >= 15 && this.#angle <= 44) {
      return 'mostly side';
    }
    if (this.#angle >= 45 && this.#angle <= 74) {
      return 'mostly on';
    }
    if (this.#angle >= 75 && this.#angle <= 105) {
      return 'on';
    }
    if (this.#angle >= 106 && this.#angle <= 135) {
      return 'mostly on';
    }
    if (this.#angle >= 135 && this.#angle <= 165) {
      return 'mostly side';
    }
    if (this.#angle >= 166 && this.#angle <= 195) {
      return 'side';
    }
    if (this.#angle >= 196 && this.#angle <= 225) {
      return 'mostly side';
    }
    if (this.#angle >= 226 && this.#angle <= 255) {
      return 'mostly off';
    }
    if (this.#angle >= 256 && this.#angle <= 284) {
      return 'off';
    }
    if (this.#angle >= 285 && this.#angle <= 314) {
      return 'mostly off';
    }
    if (this.#angle >= 315 && this.#angle <= 344) {
      return 'mostly side';
    }
    if (this.#angle >= 345 && this.#angle <= 360) {
      return 'side';
    }
  }
  
  #shore(){
    return this.#angle <= 180 ? 'on' : 'off';
  }
  
  isOn(){
    return this.#shore() === 'on';
  }
}
