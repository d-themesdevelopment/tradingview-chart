"use strict";
import { Interval } from "path/to/Interval";

function findSuitableResolutionToBuildFrom(data, config) {
  const interval = Interval.parse(data);
  
  if ((interval.isWeeks() || interval.isMonths()) && config.has_weekly_and_monthly) {
    let multipliers = ["1"];
    if (interval.isWeeks() && config.weekly_multipliers !== undefined) {
      multipliers = config.weekly_multipliers;
    } else if (interval.isMonths() && config.monthly_multipliers !== undefined) {
      multipliers = config.monthly_multipliers;
    }
    
    const result = findSuitableResolution(multipliers, interval);
    if (!result.error) {
      return result;
    }
  }
  
  if (interval.isDWM()) {
    if (config.has_daily === undefined || config.has_daily) {
      if (interval.isDays() && config.daily_multipliers !== undefined) {
        return findSuitableResolution(config.daily_multipliers, interval);
      } else if (config.daily_multipliers === undefined || config.daily_multipliers.includes("1")) {
        return {
          error: false,
          resolution: "1D"
        };
      } else {
        return {
          error: true,
          errorMessage: "Misconfiguration error: it is trying to request a resolution but symbol does not support it"
        };
      }
    } else {
      return {
        error: true,
        errorMessage: n(interval.value())
      };
    }
  }
  
  if (interval.isMinutes() && !config.has_intraday) {
    return {
      error: true,
      errorMessage: "Misconfiguration error: it is trying to request intraday resolution but symbol does not support it"
    };
  }
  
  if (interval.isSeconds() && !config.has_seconds) {
    return {
      error: true,
      errorMessage: "Misconfiguration error: it is trying to request seconds resolution but symbol does not support it"
    };
  }
  
  if (interval.isTicks()) {
    if (!config.has_ticks || interval.multiplier() > 1) {
      return {
        error: true,
        errorMessage: `Misconfiguration error: it is trying to request ${interval.multiplier()} ticks resolution but symbol does not support it`
      };
    } else {
      return {
        error: false,
        resolution: "1T"
      };
    }
  }
  
  const multipliers = interval.isSeconds() ? config.seconds_multipliers : config.intraday_multipliers;
  if (multipliers === undefined) {
    return {
      error: false,
      resolution: interval.value()
    };
  } else {
    return findSuitableResolution(multipliers, interval);
  }
}

function findSuitableResolution(multipliers, interval) {
  const intervalMultiplier = interval.multiplier();
  
  for (let i = multipliers.length - 1; i >= 0; i--) {
    const resolutionMultiplier = Number(multipliers[i]);
    if (intervalMultiplier % resolutionMultiplier === 0) {
      return {
        error: false,
        resolution: `${resolutionMultiplier}${interval.letter()}`
      };
    }
  }
  
  return {
    error: true,
    errorMessage: `Misconfiguration error: it is trying to request ${interval.value()} but we cannot build it from lower resolution`
  };
}
