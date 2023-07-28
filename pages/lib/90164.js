export class HHistDirection {
  static LeftToRight = "left_to_right";
  static RightToLeft = "right_to_left";
}

export class HHistLocation {
  static Relative = "relative";
  static Absolute = "absolute";
}

export class HHistVolumeMode {
  static UpDown = "Up/Down";
  static Total = "Total";
  static Delta = "Delta";
}

export function materializeHHist(hhist, timePoints) {
  if (
    hhist.firstBarTime >= timePoints.length ||
    hhist.lastBarTime >= timePoints.length
  ) {
    return null;
  }
  const firstBarTime = timePoints[hhist.firstBarTime];
  const lastBarTime = timePoints[hhist.lastBarTime];
  if (
    firstBarTime === INVALID_TIME_POINT_INDEX ||
    lastBarTime === INVALID_TIME_POINT_INDEX
  ) {
    return null;
  }
  assert(
    firstBarTime <= lastBarTime,
    "firstBarTime should not exceed lastBarTime"
  );
  assert(
    hhist.priceLow <= hhist.priceHigh,
    "priceLow should not exceed priceHigh"
  );

  return {
    firstBarTime,
    lastBarTime,
    rate: hhist.rate,
    priceHigh: hhist.priceHigh,
    priceLow: hhist.priceLow,
  };
}

export function dematerializeHHist(materializedHHist, id) {
  const firstBarTime = ensureTimePointIndex(
    materializedHHist.indexOf(materializedHHist.firstBarTime)
  );
  const lastBarTime = ensureTimePointIndex(
    materializedHHist.indexOf(materializedHHist.lastBarTime)
  );

  return {
    id,
    ...materializedHHist,
    firstBarTime,
    lastBarTime,
  };
}

export function isHHistInBarsRange(hhist, barsRange) {
  const firstBarTime = Math.min(hhist.firstBarTime, hhist.lastBarTime);
  const lastBarTime = Math.max(hhist.firstBarTime, hhist.lastBarTime);

  return (
    barsRange.contains(firstBarTime) ||
    barsRange.contains(lastBarTime) ||
    (firstBarTime < barsRange.firstBar() && lastBarTime > barsRange.lastBar())
  );
}
