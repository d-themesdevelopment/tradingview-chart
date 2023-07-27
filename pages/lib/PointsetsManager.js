
import { getLogger } from '59224';
import { Interval } from '36274';

const logger = getLogger('ChartApi.PointsetsManager');

class PointsetsManager {
  constructor() {
    this._pointsetsDataBySymbol = new Map();
  }

  destroy() {
    this._pointsetsDataBySymbol.clear();
  }

  createPointset(id, symbol, resolution, points, extrapolation) {
    let symbolData = this._pointsetsDataBySymbol.get(symbol);
    if (typeof symbolData === 'undefined') {
      symbolData = new Map();
      this._pointsetsDataBySymbol.set(symbol, symbolData);
    }

    const pointsetData = [];
    for (const point of points) {
      const [time, value] = point;
      if (typeof time !== 'number' || Number.isNaN(time)) {
        logger.logWarn(`Pointset time is invalid: id=${id}, ${time} of type ${typeof time}`);
      } else {
        pointsetData.push({
          point,
          extrapolation: extrapolation.extrapolateTimeWithOffsetToTime(1000 * time, value),
        });
      }
    }

    if (points.length === pointsetData.length) {
      symbolData.set(id, {
        resolution,
        points: pointsetData,
      });
    }
  }

  removePointset(id) {
    const symbolsToRemove = [];
    this._pointsetsDataBySymbol.forEach((symbolData, symbol) => {
      symbolData.delete(id);
      if (symbolData.size === 0) {
        symbolsToRemove.push(symbol);
      }
    });

    for (const symbol of symbolsToRemove) {
      this._pointsetsDataBySymbol.delete(symbol);
    }
  }

  invalidatePointsetsForSymbol(symbol, resolution) {
    const symbolData = this._pointsetsDataBySymbol.get(symbol);
    if (typeof symbolData !== 'undefined') {
      symbolData.forEach((data) => {
        if (Interval.isEqual(data.resolution, resolution)) {
          for (const point of data.points) {
            if (point.extrapolation !== null && point.extrapolation.exact) {
              point.extrapolation.exact = false;
            }
          }
        }
      });
    }
  }

  getUpdatesForSymbol(symbol, resolution, interval, timeConverter) {
    const updates = new Map();
    const symbolData = this._pointsetsDataBySymbol.get(symbol);
    if (typeof symbolData !== 'undefined') {
      symbolData.forEach((data, id) => {
        const refreshedData = this._refreshPointsetData(data, resolution, interval, timeConverter);
        if (refreshedData !== null) {
          updates.set(id, refreshedData);
        }
      });
    }
    return updates;
  }

  _refreshPointsetData(data, resolution, interval, timeConverter) {
    if (Interval.isEqual(data.resolution, resolution)) {
      for (let i = 0; i < data.points.length; ++i) {
        const point = data.points[i];
        if (point.extrapolation !== null && point.extrapolation.exact) {
          continue;
        }
        const [time, value] = point.point;
        point.extrapolation = timeConverter.extrapolateTimeWithOffsetToTime(1000 * time, value);
      }
    }

    const refreshedData = [];
    for (let i = 0; i < data.points.length; ++i) {
      const point = data.points[i];
      if (point.extrapolation === null) {
        return null;
      }
      const index = interval.indexOfTime(point.extrapolation.timeMs);
      if (index === null) {
        logger.logWarn(`Cannot get index of time: time=${point.extrapolation.timeMs}, ${data.resolution} -> ${resolution}`);
        return null;
      }
      refreshedData.push({
        index: i,
        value: [index.index, index.timeMs / 1000],
      });
    }

    return refreshedData;
  }
}

export { PointsetsManager };