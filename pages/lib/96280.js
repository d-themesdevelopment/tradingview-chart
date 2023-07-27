"use strict";

class SeriesTimeRangeVolumeCalculator {
  constructor(series) {
    this._value = null;
    this._series = series;
    this._series.dataEvents().dataUpdated().subscribe(this, this._onSeriesUpdated);
  }

  destroy() {
    this._series.dataEvents().dataUpdated().unsubscribeAll(this);
  }

  volume(from, to) {
    if (
      this._value !== null &&
      this._value.from === from &&
      this._value.to === to
    ) {
      return this._value.value;
    }

    let volumeValue = 0;
    const bars = this._series.data().bars();
    const firstIndex = bars.firstIndex();
    const lastIndex = bars.lastIndex();

    if (
      (firstIndex !== null && from < firstIndex && to < firstIndex) ||
      (lastIndex !== null && from > lastIndex && to > lastIndex)
    ) {
      volumeValue = NaN;
    } else {
      const iterator = bars.rangeIterator(
        Math.min(from, to),
        Math.max(from, to)
      );

      while (iterator.hasNext()) {
        const bar = iterator.next().value;
        const volume = bar[5];

        if (volume === undefined) {
          volumeValue = NaN;
          break;
        }

        volumeValue += volume;
      }
    }

    this._value = {
      from: from,
      to: to,
      value: volumeValue,
    };

    return volumeValue;
  }

  _onSeriesUpdated(e, isReset) {
    if (this._value === null) {
      return;
    }

    if (isReset) {
      this._value = null;
      return;
    }

    const lastIndex = this._series.data().bars().lastIndex();

    if (lastIndex === null || lastIndex <= this._value.to) {
      this._value = null;
    }
  }
}

