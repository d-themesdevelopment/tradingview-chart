import { get_cal, get_timezone, get_year, get_month, get_day_of_month, add_date } from './someModule';

class BusinessDay {
  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  compareTo(other) {
    if (this.year > other.year || (this.year === other.year && this.month > other.month) || (this.year === other.year && this.month === other.month && this.day > other.day)) {
      return 1;
    } else if (this.year === other.year && this.month === other.month && this.day === other.day) {
      return 0;
    } else {
      return -1;
    }
  }

  before(other) {
    return this.compareTo(other) === -1;
  }

  toCalendar() {
    const timezone = get_timezone("Etc/UTC");
    const calendar = get_cal(timezone, this.year, this.month - 1, this.day);
    return calendar;
  }

  addDays(days) {
    const calendar = this.toCalendar();
    add_date(calendar, days);
    return BusinessDay.fromCalendar(calendar);
  }

  static fromCalendar(calendar) {
    const year = get_year(calendar);
    const month = get_month(calendar) + 1;
    const day = get_day_of_month(calendar);
    return new BusinessDay(year, month, day);
  }
}
