


import { twelveHourMinuteFormat, hourMinuteFormat, twelveHourMinuteSecondFormat, hourMinuteSecondFormat } from '<path_to_timeFormat_module>';

export function getHourMinuteFormat(format) {
  return format === "12-hours" ? twelveHourMinuteFormat : hourMinuteFormat;
}

export function getHourMinuteSecondFormat(format) {
  return format === "12-hours" ? twelveHourMinuteSecondFormat : hourMinuteSecondFormat;
}

export function getTimeFormatForInterval(interval, format) {
  if (interval.isRange()) {
    return format === "12-hours" ? twelveHourMinuteNonZeroSecondFormat : hourMinuteNonZeroSecondFormat;
  }
  if (interval.isSeconds() || interval.isTicks()) {
    return getHourMinuteSecondFormat(format);
  }
  return getHourMinuteFormat(format);
}