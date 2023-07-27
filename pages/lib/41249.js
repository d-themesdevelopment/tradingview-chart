import { tzData as tzDataRaw } from 'path/to/tzData';

let tzDataInstance;

class Timezone {
  constructor(name) {
    this._name = name;
    const tzData = tzDataRaw[name];
    if (!tzData && tzDataInstance) {
      tzData = tzDataInstance.instance().getTimezoneData(name);
    }
    if (!tzData || tzData.time.length !== tzData.offset.length) {
      tzData = { time: [], offset: [] };
      this._invalid = true;
    }
    if (!tzData.time_utc) {
      const { time, offset } = tzData;
      const length = time.length;
      const timeUtc = new Array(length);
      for (let i = 0; i < length; i++) {
        time[i] *= 1000;
        offset[i] *= 1000;
        timeUtc[i] = time[i] - offset[i];
      }
      tzData.time_utc = timeUtc;
    }
    this.tz = tzData;
  }

  offsetUtc(time) {
    return Timezone._offset(this.tz.time_utc, this.tz.offset, time);
  }

  offsetLoc(time) {
    return Timezone._offset(this.tz.time, this.tz.offset, time);
  }

  name() {
    return this._name;
  }

  correctionLoc(time) {
    const tzTime = this.tz.time;
    const tzOffset = this.tz.offset;
    const index = binarySearch(tzTime, time);
    if (index < 1) {
      return 0;
    }
    const correction = tzOffset[index] - tzOffset[index - 1];
    if (correction > 0 && time - tzTime[index - 1] <= correction) {
      return correction;
    }
    return 0;
  }

  isValid() {
    return !this._invalid;
  }

  static _offset(times, offsets, time) {
    const index = binarySearch(times, time);
    return index === -1 ? 0 : offsets[index];
  }
}

function binarySearch(array, key) {
  const length = array.length;
  if (length === 0) {
    return -1;
  }
  if (isNaN(key)) {
    throw new Error("Key is NaN");
  }
  let start = 0;
  let end = length - 1;
  let middle = Math.floor((start + end) / 2);
  while (true) {
    if (array[middle] > key) {
      if ((end = middle - 1) < start) {
        return middle;
      }
    } else {
      if ((start = middle + 1) > end) {
        return middle < length - 1 ? middle + 1 : -1;
      }
    }
    middle = Math.floor((start + end) / 2);
  }
}

const floor = (value) => {
  return 0 | value;
};

const minutesToMilliseconds = (minutes) => {
  return 60 * minutes * 1000;
};

const compareDates = (date1, date2) => {
  return floor(date1.getTime() - date2.getTime());
};

const floorSeconds = (value) => {
  return value < 0 ? floor(value / 1000) - (value % 1000 !== 0 ? 1 : 0) : floor(value / 1000);
};

const daysInMonth = {
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31
};

const MONTHS = {
  ...s.WeekDays,
  ...s.Months,
  YEAR: 1,
  MONTH: 2,
  WEEK_OF_YEAR: 3,
  DAY_OF_MONTH: 5,
  DAY_OF_YEAR: 6,
  DAY_OF_WEEK: 7,
  HOUR_OF_DAY: 11,
  MINUTE: 12,
  SECOND: 13,
  minutesPerDay: 1440,
  millisecondsPerDay: minutesToMilliseconds(1440),
  getMinutesFromHHMM: (time) => {
    if (time.indexOf(":") !== -1) {
      time = time.split(":").join("");
    }
    return time % 100 + 60 * floor(time / 100);
  },
  getYear: (date) => {
    return date.getUTCFullYear();
  },
  getMonth: (date) => {
    return date.getUTCMonth();
  },
  getHours: (date) => {
    return date.getUTCHours();
  },
  getMinutes: (date) => {
    return date.getUTCMinutes();
  },
  getSeconds: (date) => {
    return date.getUTCSeconds();
  },
  getDayOfMonth: (date) => {
    return date.getUTCDate();
  },
  getDayOfWeek: (date) => {
    return date.getUTCDay() + 1;
  },
  getDayOfYear: (date) => {
    const month = date.getUTCMonth();
    let dayOfYear = daysInMonth[month];
    if (month > s.JANUARY + 1 && isLeapYear(date.getUTCFullYear())) {
      dayOfYear++;
    }
    return dayOfYear + date.getUTCDate();
  },
  getWeekOfYear: (date) => {
    const firstDay = new Date(Date.UTC(date.getUTCFullYear(), 0, 1)).getUTCDay();
    const firstWeek = firstDay === 0 ? 1 : 8 - firstDay;
    const dayOfYear = MONTHS.getDayOfYear(date);
    return Math.ceil((dayOfYear - firstWeek) / 7) + 1;
  },
  getMinutesFromMidnight: (date) => {
    return 60 * MONTHS.getHours(date) + MONTHS.getMinutes(date);
  },
  setHoursMinutesSeconds: (date, hours, minutes, seconds, milliseconds, timezone) => {
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);
    date.setUTCMilliseconds(milliseconds);
    if (timezone !== undefined) {
      MONTHS.correctTime(date, timezone);
    }
  },
  correctTime: (date, timezone) => {
    const timestamp = date.getTime();
    const correction = timezone.correctionLoc(timestamp);
    date.setTime(timestamp + correction);
  },
  addDaysConsideringDST: (timezone, date, days) => {
    const utcOffsetStart = timezone.offsetUtc(date);
    const clonedDate = MONTHS.clone(date);
    MONTHS.addDate(clonedDate, days);
    const utcOffsetEnd = timezone.offsetUtc(clonedDate);
    clonedDate.setTime(clonedDate.getTime() + utcOffsetStart - utcOffsetEnd);
    return clonedDate;
  },
  addDate: (date, days) => {
    date.setTime(date.getTime() + days * MONTHS.millisecondsPerDay);
  },
  addMinutes: (date, minutes) => {
    date.setTime(date

.getTime() + minutesToMilliseconds(minutes));
  },
  clone: (date) => {
    return new Date(date.getTime());
  },
  getDaysPerYear: (date) => {
    const year = MONTHS.getYear(date);
    return MONTHS.daysPerYear(year);
  },
  daysPerYear: (year) => {
    return isLeapYear(year) ? 366 : 365;
  },
  getDaysInMonth: (month, year) => {
    let days;
    switch (month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        days = 31;
        break;
      case 1:
        days = 28;
        if (isLeapYear(year)) {
          days++;
        }
        break;
      default:
        days = 30;
    }
    return days;
  },
  getPart: (date, part) => {
    switch (part) {
      case MONTHS.YEAR:
        return MONTHS.getYear(date);
      case MONTHS.MONTH:
        return MONTHS.getMonth(date);
      case MONTHS.DAY_OF_MONTH:
        return MONTHS.getDayOfMonth(date);
      case MONTHS.WEEK_OF_YEAR:
        return MONTHS.getWeekOfYear(date);
      case MONTHS.DAY_OF_WEEK:
        return MONTHS.getDayOfWeek(date);
      case MONTHS.HOUR_OF_DAY:
        return MONTHS.getHours(date);
      case MONTHS.MINUTE:
        return MONTHS.getMinutes(date);
      case MONTHS.DAY_OF_YEAR:
        return MONTHS.getDayOfYear(date);
      case MONTHS.SECOND:
        return MONTHS.getSeconds(date);
      default:
        return date.getTime();
    }
  },
  timeMinutes: minutesToMilliseconds,
  timeSeconds: (seconds) => {
    return 1000 * seconds;
  },
  timeMinutesDiff: (date1, date2) => {
    return floor((compareDates(date1, date2)) / 60);
  },
  timeSecondsDiff: compareDates,
  utcToCal: (timezone, timestamp) => {
    return new Date(MONTHS.utcToCalTimestamp(timezone, timestamp));
  },
  utcToCalTimestamp: (timezone, timestamp) => {
    return timestamp + timezone.offsetUtc(timestamp);
  },
  getCal: (timezone, year, month, day, hours, minutes, seconds) => {
    const date = new Date(Date.UTC(year, month, day, hours || 0, minutes || 0, seconds || 0));
    const utcOffset = timezone.offsetUtc(+date);
    return new Date(date.valueOf() - utcOffset);
  },
  getCalFromUnixTimestampMs: (timezone, timestamp) => {
    return new Date(timestamp + timezone.offsetUtc(timestamp));
  },
  getCalUtc: (year, month, day) => {
    return new Date(Date.UTC(year, month, day));
  },
  calToUtc: (timezone, date) => {
    const timestamp = date.getTime();
    return timestamp - timezone.offsetLoc(timestamp);
  },
  getTimezone: (name) => {
    return new Timezone(name);
  },
  shiftDay: (day, shift) => {
    let index = day - 1;
    index += shift;
    if (index > 6) {
      index %= 7;
    } else if (index < 0) {
      index = (7 + (index % 7)) % 7;
    }
    return index + 1;
  },
  setCustomTimezones: (timezones) => {
    tzDataInstance = timezones;
  }
};

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export default MONTHS;