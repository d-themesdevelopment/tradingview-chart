import { ensureNotNull } from "./assertions";

import { CompositeRenderer } from "./CompositeRenderer";
import { PaneRendererColumns } from "./PaneRendererColumns";
import {
  // BarSpacing,
  SelectionRenderer,
} from "./80101";

import { enabled } from "./helpers";
import { HitTarget } from "./18807";

import { Point } from "path/to/models"; // ! not correct
import { PlotRowSearchMode } from "./86094";
import SelectionIndexes from "./SelectionIndexes";
// import { backgroundColorAtYPercentFromTop } from 'path/to/someModule';

class SeriesColumnsPaneView {
  constructor(source, model) {
    this._items = [];
    this._invalidated = true;
    this._isMarkersEnabled = enabled("source_selection_markers");
    this._selectionData = null;
    this._histogramBase = 0;
    this._source = source;
    this._model = model;
    this._selectionIndexer = new SelectionIndexes(model.timeScale());
  }

  update() {
    this._invalidated = true;
  }

  renderer() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    const barSpacing = this._model.timeScale().barSpacing();
    const items = this._items;
    const lineColor = "";
    const histogramBase = this._histogramBase;

    const renderer = new CompositeRenderer();
    renderer.append(
      new PaneRendererColumns({ barSpacing, items, lineColor, histogramBase })
    );

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      renderer.append(new SelectionRenderer(this._selectionData));
    }

    return renderer;
  }

  _updateImpl() {
    this._items = [];
    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();

    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) {
      return;
    }

    const visibleBars = timeScale.visibleBarsStrictRange();
    if (visibleBars === null) {
      return;
    }

    if (this._source.bars().size() === 0) {
      return;
    }

    const firstIndex = this._source.nearestIndex(
      visibleBars.firstBar(),
      PlotRowSearchMode.NearestRight
    );
    const lastIndex = this._source.nearestIndex(
      visibleBars.lastBar(),
      PlotRowSearchMode.NearestLeft
    );

    if (firstIndex === undefined || lastIndex === undefined) {
      return;
    }

    const bars = this._source.bars().range(firstIndex, lastIndex);
    const barColorer = this._source.barColorer();
    const precomputedBarStyles = {};

    const barFunction = this._source.barFunction();

    const baseValue = bars.reduce((prev, currentBar, index) => {
      const value = barFunction(index);
      if (!isNaN(value)) {
        precomputedBarStyles.value = index;
        let barStyle = this._source.precomputedBarStyle(index);
        if (barStyle === undefined) {
          barStyle = barColorer.barStyle(
            currentBar,
            false,
            precomputedBarStyles
          );
          this._source.setPrecomputedBarStyle(index, barStyle);
        }
        const point = new Point(currentBar, value);
        point.style = barStyle;
        point.timePointIndex = currentBar;
        this._items.push(point);
        precomputedBarStyles.previousValue = index;
        if (visibleBars.contains(currentBar) && prev !== null) {
          return prev;
        }
        return value;
      }
      return prev;
    }, null);

    if (baseValue !== null) {
      priceScale.pointsArrayToCoordinates(this._items, baseValue);
      timeScale.timedValuesToCoordinates(this._items);
      this._histogramBase = priceScale.isInverted() ? 0 : priceScale.height();

      if (this._model.selection().isSelected(this._source)) {
        const indexes = this._selectionIndexer.indexes();
        const pane = ensureNotNull(this._model.paneForSource(this._source));
        const paneHeight = pane.height();

        this._selectionData = {
          points: [],
          bgColors: [],
          visible: true,
          barSpacing: timeScale.barSpacing(),
          hittestResult: HitTarget.Regular,
        };

        this._selectionData.hittestResult = HitTarget.Regular;

        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i];
          const bar = this._source.bars().valueAt(index);
          if (bar === null) {
            continue;
          }
          const value = barFunction(bar);
          if (!isNaN(value)) {
            const y = priceScale.priceToCoordinate(value, baseValue);
            const x = timeScale.indexToCoordinate(index);
            this._selectionData.points.push(new Point(x, y));
            this._selectionData.bgColors.push(
              this._model.backgroundColorAtYPercentFromTop(y / paneHeight)
            );
          }
        }
      } else {
        this._selectionIndexer.clear();
      }
    }
  }
}

export { SeriesColumnsPaneView };
