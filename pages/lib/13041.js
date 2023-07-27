const { SessionStage } = require("./60062");

function barTimeToEndOfPeriod(time, session, resolution) {
  if (resolution.isDays()) {
    return time;
  }
  const datetime = new session.datetimeClass();
  datetime.moveTo(1000 * time);
  if (resolution.isIntraday()) {
    const barIndex = datetime.indexOfBar(1000 * time);
    if (barIndex < 0) {
      throw new Error(`${time} is out of the instrument session`);
    }
    return datetime.endOfBar(barIndex) / 1000;
  }
  return datetime.startOfBar(SessionStage.LASTBAR_SESSION) / 1000;
}

function endOfPeriodToBarTime(time, session, resolution) {
  if (resolution.isDays()) {
    return time;
  }
  const startTime = 1000 * time - 1;
  const datetime = new session.datetimeClass();
  datetime.moveTo(startTime);
  if (resolution.isIntraday()) {
    const barIndex = datetime.indexOfBar(startTime);
    if (barIndex < 0) {
      throw new Error(`${time} is out of the instrument session`);
    }
    return datetime.startOfBar(barIndex) / 1000;
  }
  return datetime.startOfBar(0) / 1000;
}

export { barTimeToEndOfPeriod, endOfPeriodToBarTime };
