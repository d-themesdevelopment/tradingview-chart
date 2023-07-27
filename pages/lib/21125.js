import { assert } from "./assertions";
// import { enabled } from "enabled";
import { lowerbound, upperbound_int } from "./78071";
import { get_timezone, utc_to_cal_ts } from "./helpers";
import { createDwmAligner } from "./77475";
import { barTimeToEndOfPeriod } from "./13041";

function convertHoursToMilliseconds(hours) {
  return 60 * hours * 60 * 1000;
}

function convertMinutesToMilliseconds(minutes) {
  return 60 * minutes * 1000;
}

const timeScaleWeights = [
  { divisor: 1, weight: 18 },
  { divisor: convertMinutesToMilliseconds(1), weight: 19 },
  { divisor: convertMinutesToMilliseconds(5), weight: 20 },
  { divisor: convertMinutesToMilliseconds(30), weight: 21 },
  { divisor: convertHoursToMilliseconds(1), weight: 30 },
  { divisor: convertHoursToMilliseconds(3), weight: 31 },
  { divisor: convertHoursToMilliseconds(6), weight: 32 },
  { divisor: convertHoursToMilliseconds(12), weight: 33 },
];

class SessionTimeScale {
  constructor() {
    this._completed = true;
    this._mainSymbolExtrapolator = null;
    this._pointDataByTimePoint = new Map();
    this._instanceIds = new Set();
    this._displayTimezone = null;
    this._minFutureBarsCount = 0;
    this._sortedTimePoints = [];
  }

  destroy() {
    this.clearTimeScale();
  }

  setCompleted(completed) {
    this._completed = completed;
  }

  isCompleted() {
    return this._completed;
  }

  clearTimeScale() {
    this._pointDataByTimePoint.clear();
    this._instanceIds.clear();
    this._sortedTimePoints = [];
    return {
      baseIndex: null,
      pointsIndex: 0,
      indexChange: [],
      marks: [],
      points: [],
    };
  }

  indexOfTime(time) {
    if (this._sortedTimePoints.length === 0) {
      if (this._mainSymbolExtrapolator === null) {
        return null;
      } else {
        const extrapolatorIndex =
          this._mainSymbolExtrapolator.indexOfTime(time);
        const sortedIndex = this._mainSymbolExtrapolator.indexOfTime(
          this._sortedTimePoints[0].timeMs
        );
        if (extrapolatorIndex === null || sortedIndex === null) {
          return null;
        }
        let index = extrapolatorIndex.index - sortedIndex.index;
        if (sortedIndex.timeMs !== this._sortedTimePoints[0].timeMs) {
          index -= 1;
        }
        return {
          index: index,
          timeMs: extrapolatorIndex.timeMs,
        };
      }
    }

    if (time < this._sortedTimePoints[0].timeMs) {
      if (this._mainSymbolExtrapolator === null) {
        return null;
      } else {
        const extrapolatorIndex =
          this._mainSymbolExtrapolator.indexOfTime(time);
        const sortedIndex = this._mainSymbolExtrapolator.indexOfTime(
          this._sortedTimePoints[0].timeMs
        );
        if (extrapolatorIndex === null || sortedIndex === null) {
          return null;
        }
        let index = extrapolatorIndex.index - sortedIndex.index;
        return sortedIndex.timeMs !== this._sortedTimePoints[0].timeMs
          ? { index: index, timeMs: extrapolatorIndex.timeMs }
          : { index: index + 1, timeMs: extrapolatorIndex.timeMs };
      }
    }

    if (
      time > this._sortedTimePoints[this._sortedTimePoints.length - 1].timeMs
    ) {
      if (this._mainSymbolExtrapolator === null) {
        return null;
      } else {
        const extrapolatorIndex =
          this._mainSymbolExtrapolator.indexOfTime(time);
        const sortedIndex = this._mainSymbolExtrapolator.indexOfTime(
          this._sortedTimePoints[this._sortedTimePoints.length - 1].timeMs
        );
        if (extrapolatorIndex === null || sortedIndex === null) {
          return null;
        }
        const index = extrapolatorIndex.index - sortedIndex.index - 1;
        return {
          index: this._sortedTimePoints.length + index,
          timeMs: extrapolatorIndex.timeMs,
        };
      }
    }

    let index = lowerbound(
      this._sortedTimePoints,
      time,
      (item, value) => item.timeMs < value
    );
    if (this._sortedTimePoints[index].timeMs !== time) {
      index -= 1;
    }
    return { index: index, timeMs: this._sortedTimePoints[index].timeMs };
  }

  setMainSymbolExtrapolator(extrapolator) {
    this._mainSymbolExtrapolator = extrapolator;
    this._updateFutureBars();
    this._fillPointsData(this._sortedTimePoints, 0);
  }

  setMinFutureBarsCount(count) {
    this._minFutureBarsCount = count;
    this._updateFutureBars();
  }

  minFutureBarsCount() {
    return this._minFutureBarsCount;
  }

  firstFutureBarIndex() {
    return this._sortedTimePoints.length;
  }

  firstSessionBarIndex() {
    return this._sortedTimePoints.length === 0 ? null : 0;
  }

  lastSessionBarIndex() {
    return this._sortedTimePoints.length === 0
      ? null
      : this._sortedTimePoints.length - 1;
  }

  tickMarks(filter = 0) {
    const futureBarIndex = this.firstFutureBarIndex();
    assert(
      filter <= futureBarIndex,
      "tickmarks cannot be filtered in the future"
    );

    const futureBars = this._futureBars().map((time) => ({
      timeMs: time,
      markWeight: 0,
      displayTime: NaN,
    }));

    this._fillPointsData(
      futureBars,
      0,
      this._sortedTimePoints.length !== 0
        ? this._sortedTimePoints[this._sortedTimePoints.length - 1].displayTime
        : null
    );

    const sessionBars = [];
    for (let i = filter; i < this._sortedTimePoints.length; ++i) {
      sessionBars.push(getMark(this._sortedTimePoints[i], i));
    }

    const tickMarks = futureBars.map((bar, i) =>
      getMark(bar, i + futureBarIndex)
    );

    return sessionBars.concat(tickMarks);
  }

  setTimezone(timezone) {
    this._displayTimezone =
      timezone === "exchange" ? null : get_timezone(timezone);
    this._fillPointsData(this._sortedTimePoints, 0);
  }

  fillIndexesInRows(data) {
    if (data.length === 0) {
      return;
    }

    let prevIndex = -1;
    let startIndex = lowerbound(
      this._sortedTimePoints,
      Math.round(1000 * data[0].value[0]),
      (item, value) => item.timeMs < value
    );
    for (const row of data) {
      const time = Math.round(1000 * row.value[0]);
      while (
        startIndex < this._sortedTimePoints.length &&
        this._sortedTimePoints[startIndex].timeMs < time
      ) {
        startIndex += 1;
      }
      (startIndex !== this._sortedTimePoints.length &&
        this._sortedTimePoints[startIndex].timeMs === time) ||
        (startIndex -= 1);
      assert(startIndex !== prevIndex, "data must have unique times");
      prevIndex = startIndex;
      row.index = startIndex;
    }

    assert(
      startIndex < this._sortedTimePoints.length,
      "data must be within a data range"
    );
  }

  convertTimesToIndexes(times) {
    if (times.length === 0) {
      return [];
    }

    let prevIndex = -1;
    const startIndex = lowerbound(
      this._sortedTimePoints,
      times[0],
      (item, value) => item.timeMs < value
    );

    return times.map((time) => {
      let index = startIndex;
      while (
        index < this._sortedTimePoints.length &&
        this._sortedTimePoints[index].timeMs < time
      ) {
        index += 1;
      }
      if (index === 0 && time < this._sortedTimePoints[0].timeMs) {
        return INVALID_TIME_POINT_INDEX;
      }
      if (index >= this._sortedTimePoints.length) {
        const target = this.indexOfTime(time);
        if (target === null) {
          return INVALID_TIME_POINT_INDEX;
        }
        index = target.timeMs !== time ? target.index + 1 : target.index;
      }
      assert(index > prevIndex, "data must have unique sorted times");
      prevIndex = index;
      return index;
    });
  }

  firstSeriesBarTime() {
    return this._sortedTimePoints.length === 0
      ? null
      : this._sortedTimePoints[0].timeMs;
  }

  replaceBarsTimesTail(instanceId, bars) {
    if (bars.length === 0) {
      return null;
    }

    if (!this._instanceIds.has(instanceId)) {
      return this.setSeriesBarsTimes(instanceId, bars);
    }

    const removals = [];
    const start = lowerbound(
      this._sortedTimePoints,
      bars[0],
      (item, value) => item.timeMs < value
    );
    for (let i = start; i < this._sortedTimePoints.length; ++i) {
      const point = this._sortedTimePoints[i];
      if (
        point.pointData.instances.delete(instanceId) &&
        point.pointData.instances.size === 0
      ) {
        removals.push(point);
      }
    }

    const added = this._addBarsTimesToInstance(instanceId, bars, true);
    this._cleanupPointsData(removals);

    const newPoints = added.map((bar) => ({
      timeMs: bar.timeMs,
      pointData: bar.pointData,
      markWeight: 0,
      displayTime: NaN,
    }));

    for (let i = start; i < this._sortedTimePoints.length; ++i) {
      const point = this._sortedTimePoints[i];
      if (point.pointData.instances.size !== 0) {
        newPoints.push(point);
      }
    }

    newPoints.sort((a, b) => a.timeMs - b.timeMs);

    const timeScaleChanges = this._updateTimeScalePointsTail(newPoints);

    return this._applyTimeScaleChanges(timeScaleChanges, false);
  }

  setSeriesBarsTimes(instanceId, bars) {
    return this._setBarsTimes(instanceId, bars);
  }

  setStudyBarsTimes(instanceId, bars) {
    return this._setBarsTimes(instanceId, bars);
  }

  _setBarsTimes(instanceId, bars) {
    const hasExistingPoints = this._pointDataByTimePoint.size !== 0;
    if (this._instanceIds.has(instanceId)) {
      for (const point of this._sortedTimePoints) {
        point.pointData.instances.delete(instanceId);
      }
    } else if (bars.length === 0) {
      this._instanceIds.delete(instanceId);
    } else {
      this._instanceIds.add(instanceId);
    }

    this._addBarsTimesToInstance(instanceId, bars, false);

    if (hasExistingPoints) {
      this._cleanupPointsData(this._sortedTimePoints);
    }

    const updatedPoints = [];
    this._pointDataByTimePoint.forEach((pointData, time) => {
      updatedPoints.push({
        markWeight: 0,
        timeMs: time,
        displayTime: NaN,
        pointData: pointData,
      });
    });

    updatedPoints.sort((a, b) => a.timeMs - b.timeMs);

    const timeScaleChanges = this._updateTimeScalePoints(updatedPoints);

    return this._applyTimeScaleChanges(timeScaleChanges, false);
  }

  _addBarsTimesToInstance(instanceId, bars, isTail) {
    const addedPoints = isTail ? [] : null;
    for (const time of bars) {
      const pointData = this._pointDataByTimePoint.get(time);
      if (typeof pointData === "undefined") {
        const instances = new Set();
        instances.add(instanceId);
        const newPointData = {
          index: 0,
          instances: instances,
        };
        this._pointDataByTimePoint.set(time, newPointData);
        if (addedPoints !== null) {
          addedPoints.push({
            timeMs: time,
            pointData: newPointData,
          });
        }
      } else {
        pointData.instances.add(instanceId);
      }
    }
    return addedPoints;
  }

  _futureBarsFirstPointIndex() {
    if (
      this._mainSymbolExtrapolator === null ||
      this._sortedTimePoints.length === 0
    ) {
      return 0;
    }
    const futureBars = this._mainSymbolExtrapolator.futureBars();
    return upperbound_int(
      futureBars,
      this._sortedTimePoints[this._sortedTimePoints.length - 1].timeMs
    );
  }

  _futureBars() {
    if (this._mainSymbolExtrapolator === null) {
      return [];
    }
    const futureBars = this._mainSymbolExtrapolator.futureBars();
    const startIndex = this._futureBarsFirstPointIndex();
    return futureBars.slice(startIndex, startIndex + 1000);
  }

  _cleanupPoints;

  Data(points) {
    for (const point of points) {
      if (point.pointData.instances.size === 0) {
        this._pointDataByTimePoint.delete(point.timeMs);
      }
    }
  }

  _updateTimeScalePoints(points) {
    let startIndex = -1;
    for (
      let i = 0;
      i < this._sortedTimePoints.length && i < points.length;
      ++i
    ) {
      const existingPoint = this._sortedTimePoints[i];
      const newPoint = points[i];
      if (existingPoint.timeMs !== newPoint.timeMs) {
        startIndex = i;
        break;
      }
      newPoint.markWeight = existingPoint.markWeight;
      newPoint.displayTime = existingPoint.displayTime;
    }

    startIndex = S(startIndex, this._sortedTimePoints.length, points.length);
    if (startIndex === -1) {
      return null;
    }

    for (let i = startIndex; i < points.length; ++i) {
      points[i].pointData.index = i;
    }

    this._fillPointsData(points, startIndex);

    const indexChange = m(this._sortedTimePoints, points, startIndex);

    this._sortedTimePoints = points;
    this._updateFutureBars();

    return {
      pointsIndex: startIndex,
      indexChange: indexChange,
    };
  }

  _updateTimeScalePointsTail(points) {
    if (points.length === 0) {
      return null;
    }

    const startIndex = lowerbound(
      this._sortedTimePoints,
      points[0].timeMs,
      (item, value) => item.timeMs < value
    );
    let lastIndex = -1;
    for (let i = 0; i < points.length; ++i) {
      const existingPoint = points[i];
      const targetIndex = startIndex + i;
      if (existingPoint.pointData.index !== targetIndex) {
        existingPoint.pointData.index = targetIndex;
      }
      if (targetIndex >= this._sortedTimePoints.length) {
        continue;
      }
      if (
        this._sortedTimePoints[targetIndex].timeMs !== existingPoint.timeMs &&
        lastIndex === -1
      ) {
        lastIndex = targetIndex;
      }
    }

    const newPoints =
      startIndex === -1
        ? []
        : this._sortedTimePoints.slice(
            startIndex,
            this._sortedTimePoints.length
          );
    const indexChange = m(newPoints, points).map((change) => ({
      old: change.old + startIndex,
      new:
        change.new === INVALID_TIME_POINT_INDEX
          ? change.new
          : change.new + startIndex,
    }));

    {
      const currentPoints = this._sortedTimePoints;
      let targetIndex = 0;
      for (
        ;
        startIndex + targetIndex < currentPoints.length &&
        targetIndex < points.length;

      ) {
        currentPoints[startIndex + targetIndex] = points[targetIndex];
        targetIndex += 1;
      }
      for (; targetIndex < points.length; ++targetIndex) {
        currentPoints.push(points[targetIndex]);
      }
      currentPoints.length = startIndex + points.length;
    }

    this._updateFutureBars();

    return {
      pointsIndex: lastIndex,
      indexChange: indexChange,
    };
  }

  _getBaseIndex() {
    return this._sortedTimePoints.length === 0
      ? null
      : this._sortedTimePoints.length - 1;
  }

  _fillPointsData(points, startIndex, prevDisplayTime = null) {
    this._fillDisplayTimeForPoints(points, startIndex);

    function fillMarkWeightForPoints(points, startIndex, prevDisplayTime) {
      let startDisplayTime =
        startIndex === 0 || startIndex === points.length
          ? prevDisplayTime
          : points[startIndex - 1].displayTime;
      let prevTime = null;
      let totalTime = 0;
      for (let i = startIndex; i < points.length; ++i) {
        const point = points[i];
        const currentTime = point.displayTime;
        point.markWeight = getMarkWeight(
          new Date(1000 * currentTime),
          new Date(1000 * prevDisplayTime)
        );
        totalTime += currentTime - (prevTime || currentTime);
        prevTime = currentTime;
        prevDisplayTime = currentTime;
      }

      if (startIndex === 0 && points.length > 1 && prevDisplayTime === null) {
        const averageTime = Math.ceil(totalTime / (points.length - 1));
        const initialTime = new Date(
          1000 * (points[0].displayTime - averageTime)
        );
        points[0].markWeight = getMarkWeight(
          new Date(1000 * points[0].displayTime),
          initialTime
        );
      }
    }

    fillMarkWeightForPoints(points, startIndex, prevDisplayTime);
  }

  _applyTimeScaleChanges(timeScaleChanges, isFirstCall) {
    if (timeScaleChanges === null) {
      return isFirstCall
        ? {
            points: [],
            pointsIndex: 0,
            baseIndex: this._getBaseIndex(),
            indexChange: [],
            marks: this.tickMarks(0),
          }
        : null;
    }

    let pointsIndex = timeScaleChanges.pointsIndex;
    if (pointsIndex !== 0 && isFirstCall) {
      this._fillPointsData(this._sortedTimePoints, 0);
      pointsIndex = 0;
    }

    if (this._sortedTimePoints.length === 0) {
      return {
        baseIndex: null,
        pointsIndex: 0,
        indexChange: [],
        marks: [],
        points: [],
      };
    }

    const points = [];
    for (
      let i = timeScaleChanges.pointsIndex;
      i < this._sortedTimePoints.length;
      ++i
    ) {
      points.push(this._sortedTimePoints[i].timeMs / 1000);
    }

    return {
      ...timeScaleChanges,
      points: points,
      baseIndex: this._getBaseIndex(),
      marks: this.tickMarks(pointsIndex),
    };
  }

  _fillDisplayTimeForPoints(points, startIndex) {
    if (this._mainSymbolExtrapolator === null) {
      return;
    }

    const interval = this._mainSymbolExtrapolator.interval();
    const barBuilder = this._mainSymbolExtrapolator.barBuilder();
    const symbolInfo = this._mainSymbolExtrapolator.symbolInfo();
    const displayTimezone =
      this._displayTimezone === null
        ? get_timezone(symbolInfo.timezone)
        : this._displayTimezone;
    const isSingleInstance = this._instanceIds.size === 1;
    const isDailyOrGreater = interval.isDWM();
    const dwmAligner = isDailyOrGreater
      ? createDwmAligner(interval.value(), {
          timezone: symbolInfo.timezone,
          corrections: isSingleInstance ? symbolInfo.corrections : undefined,
          session_holidays: isSingleInstance
            ? symbolInfo.session_holidays
            : undefined,
          session: isSingleInstance ? symbolInfo.session : "24x7",
        })
      : null;
    const useTimezone = !isDailyOrGreater;
    for (let i = startIndex; i < points.length; ++i) {
      let time = points[i].timeMs / 1000;
      if (END_OF_PERIOD_TIMESCALE_MARKS_ENABLED) {
        time = barTimeToEndOfPeriod(barBuilder, time, interval);
      }
      if (dwmAligner !== null) {
        time = Math.floor(
          dwmAligner.timeToExchangeTradingDay(1000 * time) / 1000
        );
      }
      points[i].displayTime = utc_to_cal_ts(
        displayTimezone,
        new Date(1000 * time),
        useTimezone
      );
    }
  }

  _updateFutureBars() {
    if (this._mainSymbolExtrapolator !== null) {
      const futureBars = this._futureBars();
      this._sortedTimePoints.length === 0
        ? this._fillPointsData(futureBars, 0)
        : this._fillPointsData(futureBars, this._sortedTimePoints.length - 1);
    }
  }
}

function getMark(point, index) {
  return {
    time: point.timeMs / 1000,
    weight: point.markWeight,
    id: index,
    index: point.pointData.index,
    color: "rgba(0, 0, 0, 0)",
  };
}

function getMarkWeight(currentTime, prevTime) {
  for (const weight of timeScaleWeights) {
    if (currentTime - prevTime >= weight.divisor) {
      return weight.weight;
    }
  }
  return timeScaleWeights[0].weight;
}

const INVALID_TIME_POINT_INDEX = -1;
const S = (x, a, b) => Math.min(Math.max(x, a), b);
const m = (a, b, c) => {
  if (b === c) {
    return [];
  }
  const d = new Array(c - b);
  let e = 0;
  for (let f = b; f < c; f++) {
    d[e++] = { old: a[f].pointData.index, new: f };
  }
  return d;
};
