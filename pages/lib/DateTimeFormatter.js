import { hourMinuteSecondFormat } from '79206';
import { DateFormatter, TimeFormatter } from '53741';

const defaultOptions = {
  dateFormat: 'yyyy-MM-dd',
  withWeekday: false,
  timeFormat: hourMinuteSecondFormat,
  dateTimeSeparator: ' '
};

class DateTimeFormatter {
  constructor(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    this._dateFormatter = new DateFormatter(mergedOptions.dateFormat, mergedOptions.withWeekday);
    this._timeFormatter = new TimeFormatter(mergedOptions.timeFormat);
    this._separator = mergedOptions.dateTimeSeparator;
  }

  format(date) {
    return `${this._dateFormatter.format(date)}${this._separator}${this._timeFormatter.format(date)}`;
  }

  formatLocal(date) {
    return `${this._dateFormatter.formatLocal(date)}${this._separator}${this._timeFormatter.formatLocal(date)}`;
  }
}

export {
  DateTimeFormatter
};
