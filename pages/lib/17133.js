const TIMEFRAMETYPE = {
  PeriodBack: "period-back",
  TimeRange: "time-range",
};

export function areEqualTimeFrames(frame1, frame2) {
  if (
    frame1.type === TIMEFRAMETYPE.PeriodBack &&
    frame2.type === TIMEFRAMETYPE.PeriodBack
  ) {
    return frame1.value === frame2.value;
  } else if (
    frame1.type === TIMEFRAMETYPE.TimeRange &&
    frame2.type === TIMEFRAMETYPE.TimeRange
  ) {
    return frame1.from === frame2.from && frame1.to === frame2.to;
  }
  return false;
}
