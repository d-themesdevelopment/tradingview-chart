import { default as merge } from "lodash/merge";
import { intervalsVisibilitiesDefaults } from "./intervalsVisibilitiesDefaults";
import { assert } from "./assertions";

function makeIntervalsVisibilitiesVisibleAtInterval(visibilities, interval) {
  let multiplier = interval.multiplier();

  if (interval.isTicks()) {
    visibilities.ticks = true;
  }

  if (interval.isSeconds()) {
    if (multiplier < 60) {
      visibilities.seconds = true;
      visibilities.secondsFrom = Math.min(visibilities.secondsFrom, multiplier);
      visibilities.secondsTo = Math.max(visibilities.secondsTo, multiplier);
    } else {
      multiplier = Math.floor(multiplier / 60);
      interval = new Interval(ResolutionKind.Minutes, multiplier);
    }
  }

  if (interval.isMinutes()) {
    if (multiplier < 60) {
      visibilities.minutes = true;
      visibilities.minutesFrom = Math.min(visibilities.minutesFrom, multiplier);
      visibilities.minutesTo = Math.max(visibilities.minutesTo, multiplier);
    } else {
      const hours = Math.floor(multiplier / 60);
      visibilities.hours = true;
      visibilities.hoursFrom = Math.min(visibilities.hoursFrom, hours);
      visibilities.hoursTo = Math.max(visibilities.hoursTo, hours);
    }
  }

  if (interval.isDays()) {
    visibilities.days = true;
    visibilities.daysFrom = Math.min(visibilities.daysFrom, multiplier);
    visibilities.daysTo = Math.max(visibilities.daysTo, multiplier);
  }

  if (interval.isWeeks()) {
    visibilities.weeks = true;
    visibilities.weeksFrom = Math.min(visibilities.weeksFrom, multiplier);
    visibilities.weeksTo = Math.max(visibilities.weeksTo, multiplier);
  }

  if (interval.isMonths()) {
    visibilities.months = true;
    visibilities.monthsFrom = Math.min(visibilities.monthsFrom, multiplier);
    visibilities.monthsTo = Math.max(visibilities.monthsTo, multiplier);
  }

  if (interval.isRange()) {
    visibilities.ranges = true;
  }
}

function isActualInterval(interval, visibilities) {
  const childVisibilities = visibilities.childs();
  switch (interval.kind()) {
    case ResolutionKind.Ticks:
      return childVisibilities.ticks.value();
    case ResolutionKind.Seconds:
      if (interval.multiplier() < 60) {
        return c(
          childVisibilities.seconds.value(),
          childVisibilities.secondsFrom.value(),
          childVisibilities.secondsTo.value(),
          interval.multiplier()
        );
      } else {
        const minutes = Math.floor(interval.multiplier() / 60);
        return c(
          childVisibilities.minutes.value(),
          childVisibilities.minutesFrom.value(),
          childVisibilities.minutesTo.value(),
          minutes
        );
      }
    case ResolutionKind.Minutes:
      if (interval.multiplier() < 60) {
        return c(
          childVisibilities.minutes.value(),
          childVisibilities.minutesFrom.value(),
          childVisibilities.minutesTo.value(),
          interval.multiplier()
        );
      } else {
        const hours = Math.floor(interval.multiplier() / 60);
        return c(
          childVisibilities.hours.value(),
          childVisibilities.hoursFrom.value(),
          childVisibilities.hoursTo.value(),
          hours
        );
      }
    case ResolutionKind.Days:
      return c(
        childVisibilities.days.value(),
        childVisibilities.daysFrom.value(),
        childVisibilities.daysTo.value(),
        interval.multiplier()
      );
    case ResolutionKind.Weeks:
      return c(
        childVisibilities.weeks.value(),
        childVisibilities.weeksFrom.value(),
        childVisibilities.weeksTo.value(),
        interval.multiplier()
      );
    case ResolutionKind.Months:
      return c(
        childVisibilities.months.value(),
        childVisibilities.monthsFrom.value(),
        childVisibilities.monthsTo.value(),
        interval.multiplier()
      );
    case ResolutionKind.Range:
      return childVisibilities.ranges.value();
  }
  assert(false, `Unsupported resolution: ${interval.value()}`);
  return false;
}

function mergeIntervalVisibilitiesDefaults(customDefaults) {
  return merge(
    intervalsVisibilitiesDefaults,
    customDefaults != null ? customDefaults : {}
  );
}

function getIntervalsVisibilitiesForMode(interval, mode) {
  if (
    mode === 0 ||
    (interval.isTicks() && mode === 3) ||
    (interval.isRange() && mode === 2)
  ) {
    return mergeIntervalVisibilitiesDefaults();
  }

  let hasVisibleInterval = false;
  const visibilities = {
    ticks: false,
    seconds: false,
    minutes: false,
    hours: false,
    days: false,
    weeks: false,
    months: false,
    ranges: false,
  };
  const getIntervalMultiplier = (interval) => interval.multiplier();
  const markIntervalAsVisible = (intervalFrom, intervalTo) => {
    visibilities.ticks = true;
  };

  [
    {
      checker: (interval) => interval.isTicks(),
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.ticks = true;
      },
    },
    {
      checker: (interval) => interval.isSeconds() && interval.multiplier() < 60,
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.seconds = true;
        visibilities.secondsFrom = intervalFrom;
        visibilities.secondsTo = intervalTo;
      },
    },
    {
      checker: (interval) =>
        interval.isSeconds() && interval.multiplier() >= 60,
      getIntervalMultiplier: (interval) =>
        Math.floor(interval.multiplier() / 60),
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.minutes = true;
        visibilities.minutesFrom = intervalFrom;
        visibilities.minutesTo = intervalTo;
      },
    },
    {
      checker: (interval) => interval.isMinutes() && interval.multiplier() < 60,
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.minutes = true;
        visibilities.minutesFrom = intervalFrom;
        visibilities.minutesTo = intervalTo;
      },
    },
    {
      checker: (interval) =>
        interval.isMinutes() && interval.multiplier() >= 60,
      getIntervalMultiplier: (interval) =>
        Math.floor(interval.multiplier() / 60),
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.hours = true;
        visibilities.hoursFrom = intervalFrom;
        visibilities.hoursTo = intervalTo;
      },
    },
    {
      checker: (interval) => interval.isDays(),
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.days = true;
        visibilities.daysFrom = intervalFrom;
        visibilities.daysTo = intervalTo;
      },
    },
    {
      checker: (interval) => interval.isWeeks(),
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.weeks = true;
        visibilities.weeksFrom = intervalFrom;
        visibilities.weeksTo = intervalTo;
      },
    },
    {
      checker: (interval) => interval.isMonths(),
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.months = true;
        visibilities.monthsFrom = intervalFrom;
        visibilities.monthsTo = intervalTo;
      },
    },
    {
      checker: (interval) => interval.isRange(),
      getIntervalMultiplier: getIntervalMultiplier,
      markIntervalAsVisible: (intervalFrom, intervalTo) => {
        visibilities.ranges = true;
      },
    },
  ].forEach((intervalChecker) => {
    if (intervalChecker.checker(interval)) {
      hasVisibleInterval = true;
      const intervalMultiplier =
        intervalChecker.getIntervalMultiplier(interval);
      if (mode === 1) {
        intervalChecker.markIntervalAsVisible(
          intervalMultiplier,
          intervalMultiplier
        );
      } else if (mode === 3) {
        intervalChecker.markIntervalAsVisible(intervalMultiplier, undefined);
      } else {
        intervalChecker.markIntervalAsVisible(undefined, intervalMultiplier);
      }
    } else {
      if (
        (!hasVisibleInterval && mode === 2) ||
        (hasVisibleInterval && mode === 3)
      ) {
        intervalChecker.markIntervalAsVisible(undefined, undefined);
      }
    }
  });

  return mergeIntervalVisibilitiesDefaults(visibilities);
}

export {
  getIntervalsVisibilitiesForMode,
  isActualInterval,
  makeIntervalsVisibilitiesVisibleAtInterval,
  mergeIntervalVisibilitiesDefaults,
};
