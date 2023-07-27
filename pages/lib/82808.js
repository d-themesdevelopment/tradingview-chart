import { Std, add_days_considering_dst, open, high, low, close, time } from 'some-library';
import { Interval, ResolutionKind } from 'another-library';
import { findSuitableResolutionToBuildFrom } from 'yet-another-library';

class PivotPointsStandardStudyItem {
  constructor() {
    this.pivots = [];
  }

  calculatePivotPoints() {
    const openVar = newVar(open);
    const highVar = newVar(high);
    const lowVar = newVar(low);
    const closeVar = newVar(close);
    const timeVar = newVar(time);
    const data = this.pivots;
    const kindPP = getKindPP();
    const showHistoricalPivots = getShowHistoricalPivots();
    const historicalPivotsToKeep = getHistoricalPivotsToKeep();
    const pivTimeFrame = getPivTimeFrame();
    const isValidResolution = checkValidResolution();

    if (!isValidResolution) {
      return null;
    }

    if (isMainSymbol()) {
      if (isNaN(firstMainSeriesBarTime)) {
        firstMainSeriesBarTime = symbol.time;
        removeUnusedPivots();
      }

      if (symbol.isLastBar && symbol.isNewBar) {
        return createResponse();
      }

      return null;
    }

    selectSymbol(1);

    const currentOpen = openVar.get(0);
    const currentTime = timeVar.get(0);
    const prevOpen = openVar.get(1);
    const prevHigh = highVar.get(1);
    const prevLow = lowVar.get(1);
    const prevClose = closeVar.get(1);

    if (data.pivots.length !== 0 && symbol.isNewBar) {
      const pivot = data.pivots[data.pivots.length - 1];
      if (pivot.endIndex__t !== currentTime) {
        pivot.endIndex__t = currentTime;
      }
    }

    if (symbol.index === 0 || !symbol.isNewBar) {
      selectSymbol(0);
      return null;
    }

    const pivotPoints = calculatePivotPoints(kindPP, currentOpen, currentTime, prevOpen, prevHigh, prevLow, prevClose, currentTime, calculateSecondaryResolution(currentTime));

    selectSymbol(0);

    if (!showHistoricalPivots) {
      data.pivots = [];
    }

    data.pivots.push(pivotPoints);

    if (data.pivots.length > historicalPivotsToKeep) {
      data.pivots.shift();
    }

    if (symbol.isLastBar) {
      return createResponse();
    }

    return null;
  }

  createResponse() {
    if (this.data.pivots.length === 0) {
      return null;
    }

    return {
      nonseries: true,
      type: 'non_series_data',
      data: {
        data: this.data,
      },
    };
  }

  removeUnusedPivots() {
    const index = Math.max(
      this.data.pivots.findIndex((pivot) => pivot.startIndex__t > this.firstMainSeriesBarTime) - 1,
      0
    );

    if (index > 0) {
      this.data.pivots.splice(0, index);
    }
  }

  getKindPP() {
    switch (kind) {
      case 'Traditional':
        return 0;
      case 'Fibonacci':
        return 1;
      case 'Woodie':
        return 2;
      case 'Classic':
        return 3;
      case 'DeMark':
        return 4;
      case 'Camarilla':
        return 5;
      default:
        throw new Error('Unknown kind ' + kind);
    }
  }

  getShowHistoricalPivots() {
    return showHistoricalPivots;
  }

  getHistoricalPivotsToKeep() {
    return lookBack;
  }

  getPivTimeFrame() {
    switch (pivTimeFrame) {
      case 'Auto':
        return calculateAutoPivTimeFrame();
      case 'Daily':
        return '1D';
      case 'Weekly':
        return '1W';
      case 'Monthly':
        return '1M';
      case 'Yearly':
        return '12M';
      default:
        throw new Error('No such pivTimeFrame: ' + pivTimeFrame);
    }
  }

  calculateAutoPivTimeFrame() {
    const interval = Interval.parse(symbol.interval + symbol.resolution);
    switch (interval.kind()) {
      case ResolutionKind.Weeks:
      case ResolutionKind.Months:
        return '12M';
      case ResolutionKind.Days:
        return '1M';
      case ResolutionKind.Minutes:
        return interval.multiplier() >= 1 && interval.multiplier() <= 15 ? '1D' : '1W';
      case ResolutionKind.Seconds:
      case ResolutionKind.Ticks:
        return '1D';
      default:
        throw new Error('Unexpected resolution type: ' + symbol.resolution);
    }
  }

  calculateSecondaryResolution(currentTime) {
    if (Std.ismonthly(symbol)) {
      let date = new Date(currentTime);
      if (date.getUTCDay() < getMonthDays(date.getUTCMonth(), date.getUTCFullYear())) {
        date = add_days_considering_dst('Etc/UTC', date, 1 - date.getUTCDay());
      } else {
        date = add_days_considering_dst('Etc/UTC', date, 1);
      }
      return date.valueOf();
    }
    return currentTime + Interval.parse(symbol.resolution).inMilliseconds(currentTime);
  }

  checkValidResolution() {
    return !(
      (Std.isdaily(symbol) && pivTimeFrame === 'Daily') ||
      (Std.isweekly(symbol) && (pivTimeFrame === 'Daily' || pivTimeFrame === 'Weekly')) ||
      (Std.ismonthly(symbol) &&
        (pivTimeFrame === 'Daily' || pivTimeFrame === 'Weekly' || pivTimeFrame === 'Monthly'))
    );
  }
}

export { PivotPointsStandardStudyItem };
