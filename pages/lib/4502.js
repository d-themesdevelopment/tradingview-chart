import { Point } from "geometry"; // ! not correct
import { enabled } from "./helpers";
import SelectionIndexes from "./SelectionIndexes";
import { PlotRowSearchMode } from "./86094";
import { HitTarget } from "./18807";

function isNotNull(value) {
  return value !== null;
}

function baseBarCandlesUpdater(data, target) {
  const open = data[1];
  const high = data[2];
  const low = data[3];
  const close = data[4];
  if (
    isNotNull(open) &&
    isNotNull(high) &&
    isNotNull(low) &&
    isNotNull(close)
  ) {
    target.open = open;
    target.high = high;
    target.low = low;
    target.close = close;
    return true;
  }
  return false;
}

class SeriesBarCandlesPaneView {
  constructor(source, model) {
    this._bars = [];
    this._invalidated = true;
    this._isMarkersEnabled = enabled("source_selection_markers");
    this._selectionData = null;
    this._source = source;
    this._model = model;
    this._selectionIndexer = new SelectionIndexes(model.timeScale());
  }

  items() {
    return this._bars;
  }

  update() {
    this._invalidated = true;
  }

  _updateImpl(index) {
    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();
    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) {
      return;
    }

    const visibleRange = timeScale.visibleBarsStrictRange();
    if (visibleRange === null) {
      return;
    }

    if (this._source.bars().size() === 0) {
      return;
    }

    let startIndex = this._source.nearestIndex(
      visibleRange.firstBar(),
      PlotRowSearchMode.NearestRight
    );
    const endIndex = this._source.nearestIndex(
      visibleRange.lastBar(),
      PlotRowSearchMode.NearestLeft
    );
    if (startIndex === undefined || endIndex === undefined) {
      return;
    }

    while (startIndex <= endIndex) {
      if (this._source.bars().valueAt(startIndex) !== null) {
        break;
      }
      startIndex++;
    }

    if (startIndex > endIndex) {
      return;
    }

    const data = this._source.bars().range(startIndex, endIndex);
    const barColorer = this._source.barColorer();
    const tempData = {};

    data.each((index, bar) => {
      tempData.value = bar;
      let style = this._source.precomputedBarStyle(bar);
      if (style === undefined) {
        style = barColorer.barStyle(bar, false, tempData);
        this._source.setPrecomputedBarStyle(bar, style);
      }
      const item = this._createItem(Math.round(bar), index, style, index);
      if (item) {
        tempData.previousValue = index;
        this._bars.push(item);
        return false;
      }
    });

    if (this._bars.length === 0) {
      return;
    }

    const firstValue = this._source.firstValue();
    if (firstValue !== null) {
      priceScale.barPricesToCoordinates(this._bars, firstValue);
      timeScale.barIndexesToCoordinates(this._bars);

      if (this._model.selection().isSelected(this._source)) {
        const indexes = this._selectionIndexer.indexes();
        this._selectionData = {
          points: [],
          bgColors: [],
          visible: true,
          hittestResult: HitTarget.Regular,
          barSpacing: timeScale.barSpacing(),
        };

        const pane = this._model.paneForSource(this._source);
        if (!pane) {
          return;
        }
        const paneHeight = pane.height();

        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i];
          const bar = this._source.bars().valueAt(index);
          if (bar === null) {
            continue;
          }

          const high = bar[1];
          const close = bar[4];

          if (high === null || close === null) {
            continue;
          }

          const y = 0.5 * (high + close);
          const x = timeScale.indexToCoordinate(index);
          const yCoord = priceScale.priceToCoordinate(y, firstValue);

          this._selectionData.points.push(new Point(x, yCoord));
          this._selectionData.bgColors.push(
            this._model.backgroundColorAtYPercentFromTop(yCoord / paneHeight)
          );
        }
      } else {
        this._selectionIndexer.clear();
      }
    }
  }
}

export { SeriesBarCandlesPaneView, baseBarCandlesUpdater };
