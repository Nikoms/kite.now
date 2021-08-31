import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateTime {
  #date;
  #timezone;
  #timezonedDate;

  /**
   * @param {Date} date
   * @param {string} timezone
   */
  constructor(date, timezone) {
    this.#date = date;
    this.#timezone = timezone;
    this.#timezonedDate = dayjs(this.#date).tz(this.#timezone);
  }

  format() {
    return this.#timezonedDate.format('dd DD/MM/YYYY HH:mm ZZ');
  }

  hourBetween(from, to) {
    const hour = Number(this.#timezonedDate.format('H'));
    return from <= hour && hour <= to;
  }

  shortFormat() {
    return this.#timezonedDate.format('dd DD/MM HH:mm');
  }

  ymd() {
    return this.#timezonedDate.format('YYYY-MM-DD');
  }

  between(from, to) {
    return this.#date.getHours() >= from && this.#date.getHours() <= to;
  }

  toString() {
    return this.format();
  }
}
