import { Interval, utc_to_cal, get_timezone } from 'some-library';
import { enabled } from 'some-other-library';
import { SessionInfo, newBarBuilder, alignTimeIfPossible } from 'another-library';

const sessionInfo = new SessionInfo("Etc/UTC", "0000-0000:1234567");

function createDwmAligner(interval, config) {
  if (!isAlignmentEnabled() || !Interval.isDWM(interval)) {
    return null;
  }

  const sessionInfo = new SessionInfo(config.timezone, config.session, config.session_holidays, config.corrections);
  const barBuilder = newBarBuilder(interval, sessionInfo, sessionInfo, false);

  return {
    timeToSessionStart: (time) => barBuilder.tradingDayToSessionStart(time),
    timeToExchangeTradingDay: (time) => {
      const tradingDay = utc_to_cal(sessionInfo.timezone, time);
      const correctedTradingDay = sessionInfo.spec.correctTradingDay(tradingDay);
      const utcTime = set_hms(correctedTradingDay, 0, 0, 0, 0, get_timezone("Etc/UTC"));

      return utcTime.getTime();
    }
  };
}

function isAlignmentEnabled() {
  return !enabled("disable_resolution_rebuild");
}

function createTimeToBarTimeAligner(interval, config) {
  if (!isAlignmentEnabled()) {
    return (time) => time;
  }

  const sessionInfo = new SessionInfo(config.timezone, config.session, config.session_holidays, config.corrections);
  const barBuilder = newBarBuilder(interval, sessionInfo, sessionInfo, false);

  return (time) => barBuilder.alignTimeIfPossible(time);
}

export { createDwmAligner, createTimeToBarTimeAligner, isAlignmentEnabled };
