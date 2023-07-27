import { ensureNotNull } from 'path/to/ensureNotNull';
import { PlotRowSearchMode } from 'path/to/PlotRowSearchMode';

function getSeriesPrice(series, dataPoint, position) {
  const barFunction = series.barFunction();
  switch (series.style()) {
    case 3:
    case 10:
    case 2:
    case 14:
    case 15:
      return barFunction(dataPoint.value);
    default:
      return dataPoint.value[-1 === position ? 3 : 2];
  }
}

function getVisualDirection(position, isInverted) {
  return -1 === getPositionSign(position) !== isInverted ? -1 : 1;
}

function getPositionSign(position) {
  return position >= 0 ? 1 : -1;
}

function positionToCoordinate(series, priceScale, height, position) {
  const clampedPosition = Math.min(height, Math.max(0, 1 === position ? height : height - position));
  return position - getPositionSign(position) * Math.abs(clampedPosition * series / 100);
}

function getNoDataPosition(series, priceScale, position) {
  const dataPoint = series.index();
  if (dataPoint === null) {
    return null;
  }
  const price = priceScale.coordinateToPrice(priceScale.height() / 2, position);
  return {
    index: dataPoint,
    price: price
  };
}

function getSeriesPosition(series, priceScale, timeOrIndex, isInverted = true) {
  const data = series.data().bars();
  const firstBar = data.first();
  const lastBar = data.last();
  if (firstBar === null || lastBar === null) {
    return null;
  }
  let dataPoint;
  const index = timeOrIndex.index();
  if (index === null) {
    if (timeOrIndex.time === undefined) {
      return null;
    }
    const time = timeOrIndex.time();
    const firstTime = firstBar.value[0];
    const lastTime = lastBar.value[0];
    if (time < firstTime - 86400 || time > lastTime) {
      return null;
    }
    dataPoint = data.searchByTime(time, PlotRowSearchMode.NearestRight, 4);
  } else {
    dataPoint = data.search(index);
  }
  if (dataPoint === null) {
    return null;
  }
  const price = getSeriesPrice(series, dataPoint, getVisualDirection(position, priceScale.isInverted()));
  return {
    index: dataPoint.index,
    price: price
  };
}

export {
  getNoDataPosition,
  getSeriesPosition,
  noDataBasePosition: getNoDataPosition,
  positionToCoordinate,
  positionVisualDirection: getVisualDirection,
  seriesBasePosition: getSeriesPosition,
  seriesPrice: getSeriesPrice
};
