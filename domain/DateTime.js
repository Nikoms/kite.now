import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateTime {
  /**
   * @param {Date} date
   * @param {string} timezone
   */
  constructor(date, timezone) {
    this.date = date;
    this.timezone = timezone;
  }

  format() {
    return dayjs(this.date).tz(this.timezone).format('dd DD/MM/YYYY HH:mm ZZ');
  }

  between(from, to) {
    return this.date.getHours() >= from && this.date.getHours() < to;
  }

  toString() {
    return this.format();
  }
}
