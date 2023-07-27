import { t } from 'translation-library';
import { ResolutionKind, SpecialResolutionKind, Interval, parse as parseInterval } from 'some-library';
import { linking, setValue as setLinkingValue, getValue as getLinkingValue } from 'some-library';
import { uniq } from 'some-library';
import { enabled } from 'some-library';

const resolutionToMinutesMap = {
  [ResolutionKind.Ticks]: 1,
  [ResolutionKind.Seconds]: 60,
  [ResolutionKind.Minutes]: 1440,
  [SpecialResolutionKind.Hours]: 24,
  [ResolutionKind.Days]: 365,
  [ResolutionKind.Weeks]: 52,
  [ResolutionKind.Months]: 12,
  [ResolutionKind.Range]: 1e6,
  [ResolutionKind.Invalid]: NaN,
};

const resolutionKindOrderMap = {
  [ResolutionKind.Ticks]: 0,
  [ResolutionKind.Seconds]: 1,
  [ResolutionKind.Minutes]: 2,
  [SpecialResolutionKind.Hours]: 3,
  [ResolutionKind.Days]: 4,
  [ResolutionKind.Weeks]: 5,
  [ResolutionKind.Months]: 6,
  [ResolutionKind.Range]: 7,
  [ResolutionKind.Invalid]: 8,
};

const resolutionTranslationMap = {
  [ResolutionKind.Invalid]: "",
  [ResolutionKind.Ticks]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Seconds]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Minutes]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [SpecialResolutionKind.Hours]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Days]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Weeks]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Months]: t(null, { context: "interval_short" }, 'some-translation-key'),
  [ResolutionKind.Range]: t(null, { context: "interval_short" }, 'some-translation-key'),
};

function normalizeIntervalString(intervalString) {
  return Interval.normalize(intervalString);
}

function isAvailable(intervalString) {
  const interval = parseInterval(intervalString);

  if (!isSecondsEnabled() && interval.isSeconds()) {
    return false;
  }

  if (!isTicksEnabled() && interval.isTicks()) {
    return false;
  }

  const value = interval.value();
  const dataFrequencyResolution = linking.dataFrequencyResolution.value();

  if (dataFrequencyResolution !== undefined && compareResolutions(value, dataFrequencyResolution) < 0) {
    return false;
  }

  const supportedResolutions = linking.supportedResolutions.value();

  if (supportedResolutions !== undefined) {
    return supportedResolutions.find((resolution) => parseInterval(resolution) === interval.value()) !== undefined;
  }

  if (interval.isSeconds()) {
    return !!linking.seconds.value();
  }

  if (interval.isTicks()) {
    return !!linking.ticks.value();
  }

  if (interval.isIntraday()) {
    return !!linking.intraday.value();
  }

  return interval.isDWM();
}

function setLastUsedResolution(intervalString) {
  const interval = parseInterval(intervalString);

  if (interval.isValid()) {
    if (interval.isRange()) {
      setLinkingValue('chart.lastUsedRangeResolution', intervalString);
    } else {
      setLinkingValue('chart.lastUsedTimeBasedResolution', intervalString);
    }
  }
}

function getRangeResolution(resolutions) {
  const lastUsedRangeResolution = getLinkingValue('chart.lastUsedRangeResolution');

  if (lastUsedRangeResolution !== undefined && Interval.isRange(lastUsedRangeResolution)) {
    return lastUsedRangeResolution;
  }

  let defaultResolution = "100R";

  for (const resolution of resolutions) {
    const interval = parseInterval(resolution);

    if (interval.isRange()) {
      const value = interval.value();

      if (value === "100R") {
        return value;
      }

      defaultResolution = value;
    }
  }

  return defaultResolution;
}

function getTimeBasedResolution(resolutions) {
  const lastUsedTimeBasedResolution = getLinkingValue('chart.lastUsedTimeBasedResolution');

  if (lastUsedTimeBasedResolution !== undefined && Interval.isTimeBased(lastUsedTimeBasedResolution)) {
    return lastUsedTimeBasedResolution;
  }

  let defaultResolution = "1D";

  for (const resolution of resolutions) {
    const interval = parseInterval(resolution);

    if (interval.isTimeBased()) {
      const value = interval.value();

      if (value === "1D") {
        return value;
      }

      defaultResolution = value;
    }
  }

  return defaultResolution;
}

function getDefaultResolution(isRange) {
  return isRange ? "100R" : "1D";
}

function getResolutionByChartStyle(chartStyle, resolution, resolutions) {
  const isRangeStyle = isRangeStyle(chartStyle);
  const isRangeResolution = Interval.isRange(resolution);

  if (isRangeStyle && !isRangeResolution) {
    return getTimeBasedResolution(resolutions);
  }

  if (!isRangeStyle && isRangeResolution) {
    return getRangeResolution(resolutions);
  }

  return resolution;
}

function compareResolutions(resolutionA, resolutionB) {
  if (resolutionA === resolutionB) {
    return 0;
  }

  const [kindA, minutesA] = getResolutionKindAndMinutes(resolutionA);
  const [kindB, minutesB] = getResolutionKindAndMinutes(resolutionB);

  if (kindA !== kindB) {
    return resolutionKindOrderMap[kindA] - resolutionKindOrderMap[kindB];
  }

  return minutesA - minutesB;
}

function getResolutionKindAndMinutes(resolution) {
  const parsedResolution = parseInterval(resolution);
  let multiplier = parsedResolution.multiplier();
  let kind = parsedResolution.kind();

  if (parsedResolution.isMinuteHours()) {
    multiplier = Math.floor(multiplier / 60);
    kind = SpecialResolutionKind.Hours;
  }

  return [kind, multiplier];
}

function getTranslatedResolution(resolution) {
  const { multiplier, shortKind } = getTranslatedResolutionModel(resolution);
  return `${multiplier}${shortKind}`;
}

function getTranslatedResolutionModel(resolution, throwError = true) {
  const parsedResolution = parseInterval(resolution);
  let multiplier = parsedResolution.multiplier();
  let shortKind = getResolutionShortKind(parsedResolution.kind());

  if (!parsedResolution.isValid()) {
    if (throwError) {
      throw new TypeError("Can't translate invalid interval");
    }

    return null;
  }

  if (parsedResolution.isMinuteHours()) {
    multiplier = Math.floor(multiplier / 60);
    shortKind = getResolutionShortKind(SpecialResolutionKind.Hours);
  }

  return {
    multiplier: multiplier.toString(),
    shortKind,
    hint: `${multiplier} ${getResolutionShortKind(parsedResolution.kind(), multiplier)}`,
    mayOmitMultiplier: parsedResolution.isDWM() && multiplier === 1,
    mayOmitShortKind: parsedResolution.isMinutes() && !parsedResolution.isMinuteHours(),
  };
}

function getResolutionShortKind(kind, count) {
  if (!count) {
    return resolutionTranslationMap[kind];
  }

  switch (kind) {
    case ResolutionKind.Ticks:
      return t(null, { plural: "ticks", count }, 'some-translation-key');
    case ResolutionKind.Days:
      return t(null, { plural: "days", count }, 'some-translation-key');
    case ResolutionKind.Weeks:
      return t(null, { plural: "weeks", count }, 'some-translation-key');
    case ResolutionKind.Months:
      return t(null, { plural: "months", count }, 'some-translation-key');
    case ResolutionKind.Seconds:
      return t(null, { plural: "seconds", count }, 'some-translation-key');
    case ResolutionKind.Minutes:
      return t(null, { plural: "minutes", count }, 'some-translation-key');
    case SpecialResolutionKind.Hours:
      return t(null, { plural: "hours", count }, 'some-translation-key');
    case ResolutionKind.Range:
      return t(null, { plural: "ranges", count }, 'some-translation-key');
    default:
      return kind;
  }
}

function isSecondsEnabled() {
  return enabled("seconds_resolution");
}

function isTicksEnabled() {
  return enabled("tick_resolution") || false;
}

function isIntervalEnabled(interval) {
  if (parseInterval(interval).isSeconds() && !isSecondsEnabled()) {
    return false;
  }

  if (parseInterval(interval).isTicks() && !isTicksEnabled()) {
    return false;
  }

  return true;
}

function isResolutionMultiplierValid(interval) {
  const { interval: parsedInterval, guiResolutionKind } = parseInterval(interval);

  if (!parsedInterval.isValid()) {
    return false;
  }

  const multiplier = parsedInterval.multiplier();

  return (guiResolutionKind === SpecialResolutionKind.Hours ? multiplier / 60 : multiplier) <= getMaxResolutionValue(guiResolutionKind);
}

function getMaxResolutionValue(interval) {
  return getMaxResolutionValue(parseInterval(interval).guiResolutionKind);
}

function getMaxResolutionValue(resolutionKind) {
  const value = resolutionToMinutesMap[resolutionKind];
  return Number.isNaN(value) ? 1 : value;
}

function getCustomResolutions() {
  return [];
}

function getResolutionsFromSettings(settingName) {
  const resolutions = I(o.getJSON(settingName, []));
  return uniq(resolutions.filter(isResolutionMultiplierValid).map(normalizeIntervalString));
}

function parseIntervalValue(value) {
  const intervalRegex = enabled("tick_resolution") ?
    /^[,\s]*(^[1-9][0-9]*)?\s*([hdwmst]?)\s*$/i :
    /^[,\s]*(^[1-9][0-9]*)?\s*([hdwms]?)\s*$/i;

  const matches = intervalRegex.exec(value) || [];
  const count = ~~matches[1];
  const unit = matches[2] && matches[2].toUpperCase() || null;
  const interval = {
    qty: !count && unit ? 1 : count,
    unit,
  };
  interval.error = !count && !unit;
  interval.intraday = !(interval.error || (interval.unit && interval.unit !== "H" && interval.unit !== "S" && interval.unit !== "T"));
  interval.range = interval.unit === "R";

  return interval;
}

function intervalIsSupported(interval) {
  if (enabled("allow_supported_resolutions_set_only")) {
    const normalizedInterval = normalizeIntervalString(interval);
    return normalizedInterval !== null && isAvailable(normalizedInterval);
  } else {
    const parsedInterval = parseIntervalValue(interval);

    if (parsedInterval.error) {
      return false;
    }

    if (!enabled("custom_resolutions")) {
      const normalizedInterval = normalizeIntervalString(interval);
      const defaultResolutions = window.ChartApiInstance.defaultResolutions().filter(isIntervalEnabled);

      if (normalizedInterval && !defaultResolutions.includes(normalizedInterval)) {
        return false;
      }
    }

    const dataFrequencyResolution = linking.dataFrequencyResolution.value();

    if (dataFrequencyResolution !== undefined && parsedInterval.unit !== null && getCustomResolution(dataFrequencyResolution, parsedInterval.unit) !== parsedInterval.unit) {
      return false;
    }

    if (parsedInterval.intraday) {
      return linking.intraday.value();
    }

    const supportedResolutions = linking.supportedResolutions.value();

    return !supportedResolutions || (parsedInterval.unit !== null && supportedResolutions.includes(parsedInterval.unit));
  }
}

export {
  compareResolutions as compareResolutions,
  convertResolutionsFromSettings as convertResolutionsFromSettings,
  getApplicableIntervalForFrequency as getApplicableIntervalForFrequency,
  getCustomResolutions as getCustomResolutions,
  getDefaultResolution as getDefaultResolution,
  getMaxResolutionValue as getMaxResolutionValue,
  getRangeResolution as getRangeResolution,
  getResolutionByChartStyle as getResolutionByChartStyle,
  getResolutionsFromSettings as getResolutionsFromSettings,
  getServerInterval as getServerInterval,
  getTimeBasedResolution as getTimeBasedResolution,
  getTranslatedResolution as getTranslatedResolution,
  getTranslatedResolutionModel as getTranslatedResolutionModel,
  intervalIsSupported as intervalIsSupported,
  isAvailable as isAvailable,
  isIntervalEnabled as isIntervalEnabled,
  isResolutionMultiplierValid as isResolutionMultiplierValid,
  isSecondsEnabled as isSecondsEnabled,
  isTicksEnabled as isTicksEnabled,
  mergeResolutions as mergeResolutions,
  normalizeIntervalString as normalizeIntervalString,
  parseIntervalValue as parseIntervalValue,
  setLastUsedResolution as setLastUsedResolution,
  sortResolutions as sortResolutions,
};
