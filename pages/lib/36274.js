"use strict";

const regexResolution = /^(\d*)([TSHDWMR])$/;
const regexMultiplier = /^(\d+)$/;

var ResolutionKind;
(function (ResolutionKind) {
  ResolutionKind.Ticks = "ticks";
  ResolutionKind.Seconds = "seconds";
  ResolutionKind.Minutes = "minutes";
  ResolutionKind.Days = "days";
  ResolutionKind.Weeks = "weeks";
  ResolutionKind.Months = "months";
  ResolutionKind.Range = "range";
  ResolutionKind.Invalid = "invalid";
})(ResolutionKind || (ResolutionKind = {}));

var SpecialResolutionKind;
(function (SpecialResolutionKind) {
  SpecialResolutionKind.Hours = "hours";
})(SpecialResolutionKind || (SpecialResolutionKind = {}));

const intervalMultiplier = {};
intervalMultiplier[ResolutionKind.Ticks] = 1e3;
intervalMultiplier[ResolutionKind.Seconds] = 1e3;
intervalMultiplier[ResolutionKind.Minutes] = 60 * intervalMultiplier[ResolutionKind.Seconds];
intervalMultiplier[ResolutionKind.Days] = 1440 * intervalMultiplier[ResolutionKind.Minutes];
intervalMultiplier[ResolutionKind.Weeks] = 7 * intervalMultiplier[ResolutionKind.Days];

const letterMapping = {
  T: ResolutionKind.Ticks,
  S: ResolutionKind.Seconds,
  D: ResolutionKind.Days,
  W: ResolutionKind.Weeks,
  M: ResolutionKind.Months,
  R: ResolutionKind.Range,
};

const timeBasedIntervals = new Set([ResolutionKind.Ticks, ResolutionKind.Seconds, ResolutionKind.Minutes]);

class Interval {
  constructor(kind, multiplier) {
    this._kind = ResolutionKind.Invalid;
    this._multiplier = 0;
    if (kind !== ResolutionKind.Invalid && multiplier > 0) {
      this._kind = kind;
      this._multiplier = multiplier;
    }
  }

  kind() {
    return this._kind;
  }

  multiplier() {
    return this._multiplier;
  }

  isValid() {
    return this.kind() !== ResolutionKind.Invalid && this.multiplier() > 0;
  }

  isDWM() {
    return this.isValid() && !this.isRange() && !this.isIntraday() && !this.isTicks();
  }

  isIntraday() {
    const isTimeBased = timeBasedIntervals.has(this.kind());
    return this.isValid() && isTimeBased;
  }

  isSeconds() {
    return this.kind() === ResolutionKind.Seconds;
  }

  isMinutes() {
    return this.kind() === ResolutionKind.Minutes;
  }

  isMinuteHours() {
    return this.kind() === ResolutionKind.Minutes && isHour(this.multiplier());
  }

  isDays() {
    return this.kind() === ResolutionKind.Days;
  }

  isWeeks() {
    return this.kind() === ResolutionKind.Weeks;
  }

  isMonths() {
    return this.kind() === ResolutionKind.Months;
  }

  isRange() {
    return this.kind() === ResolutionKind.Range;
  }

  isTicks() {
    return this.kind() === ResolutionKind.Ticks;
  }

  isTimeBased() {
    return !this.isRange();
  }

  letter() {
    return this.isValid() && this.kind() !== ResolutionKind.Minutes ? this.kind()[0].toUpperCase() : "";
  }

  value() {
    return this.isValid() ? (this.kind() === ResolutionKind.Minutes ? this.multiplier() + "" : this.multiplier() + this.letter()) : "";
  }

  isEqualTo(other) {
    if (!(other instanceof Interval)) {
      throw new Error("Argument is not an Interval");
    }
    return this.isValid() && other.isValid() && this.kind() === other.kind() && this.multiplier() === other.multiplier();
  }

  inMilliseconds(date = Date.now()) {
    if (!this.isValid() || this.isRange()) {
      return NaN;
    }
    if (this.isMonths()) {
      const targetDate = new Date(date);
      targetDate.setUTCMonth(targetDate.getUTCMonth() + (this.multiplier() || 1));
      return +targetDate - date;
    }
    const multiplier = this.multiplier();
    return intervalMultiplier[this.kind()] * multiplier;
  }

  static isEqual(a, b) {
    return a === b || Interval.parse(a).isEqualTo(Interval.parse(b));
  }

  static parseExt(value) {
    value = (value + "").toUpperCase().split(",")[0];
    let result = regexResolution.exec(value);
    if (result !== null) {
      if (result[2] === "H") {
        return {
          interval: new Interval(ResolutionKind.Minutes, 60 * parseMultiplier(result[1])),
          guiResolutionKind: SpecialResolutionKind.Hours,
        };
      } else {
        return {
          interval: new Interval(letterMapping[result[2]], parseMultiplier(result[1])),
          guiResolutionKind: letterMapping[result[2]],
        };
      }
    } else {
      result = regexMultiplier.exec(value);
      if (result !== null) {
        return {
          interval: new Interval(ResolutionKind.Minutes, parseMultiplier(result[1])),
          guiResolutionKind: ResolutionKind.Minutes,
        };
      } else {
        return {
          interval: new Interval(ResolutionKind.Invalid, 0),
          guiResolutionKind: ResolutionKind.Invalid,
        };
      }
    }
  }

  static parse(value) {
    return Interval.parseExt(value).interval;
  }

  static kind(value) {
    return Interval.parse(value).kind();
  }

  static isValid(value) {
    return Interval.parse(value).isValid();
  }

  static isDWM(value) {
    return Interval.parse(value).isDWM();
  }

  static isIntraday(value) {
    return Interval.parse(value).isIntraday();
  }

  static isSeconds(value) {
    return Interval.parse(value).isSeconds();
  }

  static isMinutes(value) {
    return Interval.parse(value).isMinutes();
  }

  static isMinuteHours(value) {
    return Interval.parse(value).isMinuteHours();
  }

  static isDays(value) {
    return Interval.parse(value).isDays();
  }

  static isWeeks(value) {
    return Interval.parse(value).isWeeks();
  }

  static isMonths(value) {
    return Interval.parse(value).isMonths();
  }

  static isRange(value) {
    return Interval.parse(value).isRange();
  }

  static isTicks(value) {
    return Interval.parse(value).isTicks();
  }

  static isTimeBased(value) {
    return Interval.parse(value).isTimeBased();
  }

  static normalize(value) {
    const interval = Interval.parse(value);
    return interval.isValid() ? interval.value() : null;
  }
}

export {Interval};

function parseMultiplier(value) {
  return value.length === 0 ? 1 : parseInt(value, 10);
}

function isHour(value) {
  return value >= 60 && !(value % 60);
}
