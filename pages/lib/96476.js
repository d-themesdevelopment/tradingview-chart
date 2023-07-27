"use strict";

class SeriesSingleLinePaneView {
  constructor(source, model) {
    this._items = [];
    this._invalidated = true;
    this._isMarkersEnabled = isEnabledSourceSelectionMarkers();
    this._selectionData = null;
    this._source = source;
    this._model = model;
    this._selectionIndexer = new SelectionIndexes(model.timeScale());
  }

  update() {
    this._invalidated = true;
  }

  _updateImpl() {
    this._items = [];
    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();

    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) {
      return;
    }

    const visibleBarsRange = timeScale.visibleBarsStrictRange();
    if (visibleBarsRange === null) {
      return;
    }

    if (this._source.bars().size() === 0) {
      return;
    }

    const firstBarIndex = this._source.nearestIndex(visibleBarsRange.firstBar() - 1, PlotRowSearchMode.NearestLeft) ?? visibleBarsRange.firstBar() - 1;
    const lastBarIndex = this._source.nearestIndex(visibleBarsRange.lastBar() + 1, PlotRowSearchMode.NearestRight) ?? visibleBarsRange.lastBar() + 1;
    const barFunction = this._source.barFunction();

    let prevValue = null;
    const barSpacing = timeScale.barSpacing();

    if (barSpacing < 0.1 && this._source.supportsPressedChunks()) {
      prevValue = this._source.firstValue();
      const pressedChunks = this._source.pressedChunks(barSpacing, ensureNotNull(this._source.priceSource()));
      const startIndex = lowerbound(pressedChunks, firstBarIndex, (chunk, index) => chunk.startTime < index);
      const endIndex = Math.min(pressedChunks.length - 1, lowerbound(pressedChunks, lastBarIndex, (chunk, index) => chunk.endTime < index));

      for (let i = startIndex; i <= endIndex; i++) {
        const chunk = pressedChunks[i];
        [chunk.open, chunk.high, chunk.low, chunk.close].forEach(value => {
          const point = new Point(chunk.startTime, value);
          this._items.push(point);
        });
      }
    } else {
      prevValue = this._source.bars().range(firstBarIndex, lastBarIndex).reduce((prev, cur, index) => {
        const value = barFunction(index);
        if (!isDefault(value)) {
          const point = new Point(cur, value);
          this._items.push(point);
          if (visibleBarsRange.contains(cur)) {
            return prev !== null ? prev : value;
          }
        }
        return prev;
      }, null);
    }

    if (prevValue !== null) {
      priceScale.pointsArrayToCoordinates(this._items, prevValue);
      timeScale.timedValuesToCoordinates(this._items);

      if (this._model.selection().isSelected(this._source)) {
        const indexes = this._selectionIndexer.indexes();
        this._selectionData = {
          points: [],
          bgColors: [],
          visible: true,
          barSpacing: timeScale.barSpacing(),
          hittestResult: HitTarget.Regular
        };

        const pane = ensureNotNull(this._model.paneForSource(this._source));
        const paneHeight = pane.height();
        this._selectionData.hittestResult = HitTarget.Regular;

        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i];
          const bar = this._source.bars().valueAt(index);

          if (bar === null) {
            continue;
          }

          const value = barFunction(bar);
          const coordinate = timeScale.indexToCoordinate(index);
          const y = priceScale.priceToCoordinate(value, prevValue);
          this._selectionData.points.push(new Point(coordinate, y));
          this._selectionData.bgColors.push(this._model.backgroundColorAtYPercentFromTop(y / paneHeight));
        }
      } else {
        this._selectionIndexer.clear();
      }
    } else {
      this._items = [];
    }
  }
}

module.exports = {
  SeriesSingleLinePaneView
};
