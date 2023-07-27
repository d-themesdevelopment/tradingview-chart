


import { ensureNotNull } from 'some-library'; // Replace 'some-library' with the actual library you're using

class SelectionIndexes {
  constructor(timescale) {
    this._baseIndex = null;
    this._offsetInBar = null;
    this._offsetInTime = null;
    this._barsBetweenPoints = null;
    this._timescale = timescale;
  }

  indexes() {
    const visibleRange = this._timescale.visibleBarsStrictRange();
    if (visibleRange === null) {
      return [];
    }

    const firstBarIndex = visibleRange.firstBar();
    const lastBarIndex = visibleRange.lastBar();

    if (this._offsetInTime === null || this._barsBetweenPoints === null) {
      const barSpacing = this._timescale.barSpacing();
      this._barsBetweenPoints = Math.floor(120 / barSpacing);
      this._offsetInBar = lastBarIndex % this._barsBetweenPoints;
      this._offsetInTime = this._timescale.indexToTimePoint(this._offsetInBar);
      this._baseIndex = this._timescale.baseIndex();
    }

    const currentBaseIndex = this._timescale.baseIndex();
    if (this._baseIndex !== currentBaseIndex) {
      this._baseIndex = currentBaseIndex;
      this._offsetInBar = ensureNotNull(this._timescale.timePointToIndex(this._offsetInTime));
    }

    const offsetInBar = ensureNotNull(this._offsetInBar);
    const result = [];
    let currentIndex = Math.floor((firstBarIndex - offsetInBar) / this._barsBetweenPoints);
    const lastIndex = Math.floor((lastBarIndex - offsetInBar) / this._barsBetweenPoints);

    for (; currentIndex <= lastIndex; currentIndex++) {
      result.push(offsetInBar + currentIndex * this._barsBetweenPoints);
    }

    return result;
  }

  clear() {
    this._offsetInBar = null;
    this._offsetInTime = null;
    this._baseIndex = null;
    this._barsBetweenPoints = null;
  }
}

export default SelectionIndexes;