import { customFormatters, numberToStringWithLeadingZero } from 'some-library';

const defaultFormat = "%h:%m:%s";

class TimeFormatter {
  constructor(format) {
    this.isTwelveHoursFormat = false;
    this.valuesAndDelimiters = [];

    const regex = new RegExp("%h|%m|%s\\+|%ss|%ampm|%s", "g");
    let match = regex.exec(format);
    let index = 0;

    while (match !== null) {
      const value = match[0];
      if (value === "%ampm") {
        this.isTwelveHoursFormat = true;
      }

      const delimiter = format.substring(index, match.index);
      if (delimiter !== "") {
        this.valuesAndDelimiters.push(delimiter);
      }

      this.valuesAndDelimiters.push(value);
      index = match.index + value.length;
      match = regex.exec(format);
    }
  }

  format(time) {
    return customFormatters.timeFormatter ? customFormatters.timeFormatter.format(time) : this.formatTime(time, false);
  }

  formatLocal(time) {
    return customFormatters.timeFormatter ? (customFormatters.timeFormatter.formatLocal ? customFormatters.timeFormatter.formatLocal(time) : customFormatters.timeFormatter.format(time)) : this.formatTime(time, true);
  }

  formatTime(time, isLocal) {
    let hours = isLocal ? time.getHours() : time.getUTCHours();
    const minutes = isLocal ? time.getMinutes() : time.getUTCMinutes();
    const seconds = isLocal ? time.getSeconds() : time.getUTCSeconds();
    const milliseconds = isLocal ? time.getMilliseconds() : time.getUTCMilliseconds();

    let ampm = "";
    if (this.isTwelveHoursFormat) {
      ampm = hours >= 12 ? "PM" : "AM";
      hours %= 12;
      hours = hours || 12;
    }

    let result = "";
    let skipNext = false;

    for (let i = this.valuesAndDelimiters.length - 1; i >= 0; i--) {
      const value = this.valuesAndDelimiters[i];
      let formattedValue;

      switch (value) {
        case "%h":
          formattedValue = numberToStringWithLeadingZero(hours, 2);
          break;
        case "%m":
          formattedValue = numberToStringWithLeadingZero(minutes, 2);
          break;
        case "%s+":
          formattedValue = (seconds !== 0) ? numberToStringWithLeadingZero(seconds, 2) : "";
          skipNext = true;
          break;
        case "%s":
          formattedValue = numberToStringWithLeadingZero(seconds, 2);
          break;
        case "%ss":
          formattedValue = numberToStringWithLeadingZero(milliseconds, 3);
          break;
        case "%ampm":
          formattedValue = ampm;
          break;
        default:
          if (skipNext) {
            skipNext = false;
            continue;
          }
          formattedValue = value;
          break;
      }

      result = formattedValue + result;
    }

    return result;
  }
}

const hourMinuteSecondFormat = "%h:%m:%s";
const hourMinuteNonZeroSecondFormat = "%h:%m:%s+";
const hourMinuteFormat = "%h:%m";
const twelveHourMinuteSecondFormat = "%h:%m:%s %ampm";
const twelveHourMinuteNonZeroSecondFormat = "%h:%m:%s+ %ampm";
const twelveHourMinuteFormat = "%h:%m %ampm";

export {
  TimeFormatter,
  hourMinuteSecondFormat,
  hourMinuteNonZeroSecondFormat,
  hourMinuteFormat,
  twelveHourMinuteSecondFormat,
  twelveHourMinuteNonZeroSecondFormat,
  twelveHourMinuteFormat
};
