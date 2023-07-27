export const sortSourcesPreOrdered = {
  LatestUpdates: 10000001,
  BarMarks: 10000002,
  TimeScaleMarks: 10000003,
  ChartEventsSource: 10000004,
  Dividends: 10000005,
  Splits: 10000006,
  Earnings: 10000007,
  RollDates: 10000008,
  FutureContractExpiration: 10000009,
  LineToolOrder: 10000010,
  LineToolPosition: 10000011,
  LineToolExecution: 10000012,
  AlertLabel: 10000013,
};

export function sortSources(e) {
  return [...e].sort((a, b) => a.zorder() - b.zorder());
}
