class SeriesTimeRangeVolumeCalculator {
  constructor(series) {
    this._value = null;
    this._series = series;
    this._series
      .dataEvents()
      .dataUpdated()
      .subscribe(this, this._onSeriesUpdated);
  }

  destroy() {
    this._series.dataEvents().dataUpdated().unsubscribeAll(this);
  }

  volume(e, t) {
    if (
      null !== this._value &&
      this._value.from === e &&
      this._value.to === t
    ) {
      return this._value.value;
    }

    let i = 0;
    const s = this._series.data().bars();
    const r = s.firstIndex();
    const n = s.lastIndex();

    if ((null !== r && e < r && t < r) || (null !== n && e > n && t > n)) {
      i = NaN;
    } else {
      const iterator = this._series
        .data()
        .bars()
        .rangeIterator(Math.min(e, t), Math.max(e, t));
      while (iterator.hasNext()) {
        const value = iterator.next().value[5];
        if (void 0 === value) {
          i = NaN;
          break;
        }
        i += value;
      }
    }

    this._value = {
      from: e,
      to: t,
      value: i,
    };
    return i;
  }

  _onSeriesUpdated(e, t) {
    if (null === this._value) {
      return;
    }
    if (t) {
      this._value = null;
    } else {
      const lastIndex = this._series.data().bars().lastIndex();
      if (null === lastIndex || lastIndex <= this._value.to) {
        this._value = null;
      }
    }
  }
}
