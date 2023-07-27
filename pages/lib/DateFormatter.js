



import { customFormatters } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { getDateFormatWithWeekday, dateFormatFunctions } from 'some-library'; // Replace 'some-library' with the actual library you're using

class DateFormatter {
  constructor(format = 'yyyy-MM-dd', useWeekday = false) {
    this._dateFormatFunc = useWeekday ? getDateFormatWithWeekday(format) : dateFormatFunctions[format];
  }

  format(date) {
    if (customFormatters && customFormatters.dateFormatter) {
      return customFormatters.dateFormatter.format(date);
    } else {
      return this._dateFormatFunc(date, false);
    }
  }

  formatLocal(date) {
    if (customFormatters && customFormatters.dateFormatter) {
      if (customFormatters.dateFormatter.formatLocal) {
        return customFormatters.dateFormatter.formatLocal(date);
      } else {
        return customFormatters.dateFormatter.format(date);
      }
    } else {
      return this._dateFormatFunc(date, true);
    }
  }
}

export default DateFormatter;
