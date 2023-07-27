import { ensureNotNull, assert } from 'utility-module';
import { Point } from 'point-module';
import { CachedContainer } from 'cached-container-module';
import { CachedMap, AreaBackgroundItemsGroup, AreaBackgroundItem } from 'cached-map-module';
import { ObjectValuesCache } from 'object-values-cache-module';
import { CompositeRenderer } from 'composite-renderer-module';
import { SelectionIndexes } from 'selection-indexes-module';
import { enabled } from 'enabled-module';
import { AreaBackgroundRenderer, PaneRendererLine, SelectionRenderer } from 'renderer-module';

class HLCObjectCache extends ObjectValuesCache {
  _newObject() {
    return {
      high: undefined,
      close: undefined,
      low: undefined
    };
  }

  _clearObject(obj) {
    obj.high = undefined;
    obj.close = undefined;
    obj.low = undefined;
  }
}

class SeriesHLCAreaPaneView {
  constructor(source, model) {
    this._isMarkersEnabled = enabled("source_selection_markers");
    this._hlcAreaCache = new HLCObjectCache();
    this._highPoints = new CachedContainer();
    this._closePoints = new CachedContainer();
    this._lowPoints = new CachedContainer();
    this._timePoints = new CachedContainer();
    this._filledAreas = new CachedMap();
    this._renderer = new CompositeRenderer();
    this._invalidated = true;
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
    return this._renderer;
  }

  _updateImpl() {
    this._renderer.clear();
    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();

    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) return;

    const visibleBarsRange = timeScale.visibleBarsStrictRange();
    if (visibleBarsRange === null) return;

    if (this._source.bars().size() === 0) return;

    const firstValue = this._source.firstValue();
    if (firstValue === null) return;

    const startBar = visibleBarsRange.firstBar() - 1;
    const endBar = visibleBarsRange.lastBar() + 1;

    this._hlcAreaCache.invalidateCache();
    this._hlcAreaCache.setStartIndex(startBar);
    this._timePoints.invalidateCache();
    this._highPoints.invalidateCache();
    this._lowPoints.invalidateCache();
    this._closePoints.invalidateCache();
    this._filledAreas.invalidateCache();

    let prevClose, prevHigh, prevLow;

    this._source.bars().range(startBar, endBar).each((index, bar) => {
      if (this._hlcAreaCache.isValidIndex(index)) {
        const cacheObj = this._hlcAreaCache.at(index);
        cacheObj.close = bar[4];
        cacheObj.high = bar[2];
        cacheObj.low = bar[3];
      }
      return false;
    });

    const cachedIndexToScreen = new Map();

    for (let i = startBar; i < startBar + this._hlcAreaCache.length(); i++) {
      const cacheObj = this._hlcAreaCache.at(i);
      const close = cacheObj.close !== undefined ? cacheObj.close : null;
      const high = cacheObj.high !== undefined ? cacheObj.high : null;
      const low = cacheObj.low !== undefined ? cacheObj.low : null;

      if ((close !== null || high !== null || low !== null || Number.isFinite(prevClose) || Number.isFinite(prevHigh) || Number.isFinite(prevLow))) {
        prevClose = close;
        prevHigh = high;
        prevLow = low;

        this._highPoints.push(high);
        this._closePoints.push(close);
        this._lowPoints.push(low);
        this._timePoints.push(i);

        cachedIndexToScreen.set(i, this._timePoints.length() - 1);
      }
    }

    priceScale.pricesArrayToCoordinates(this._highPoints.data(), firstValue, this._highPoints.length());
    priceScale.pricesArrayToCoordinates(this._closePoints.data(), firstValue, this._closePoints.length());
    priceScale.pricesArrayToCoordinates(this._lowPoints.data(), firstValue, this._lowPoints.length());
    timeScale.indexesToCoordinates(this._timePoints.data(), this._timePoints.length());

    const barSpacing = timeScale.barSpacing();

    const areaStyle = this._source.properties().childs().hlcAreaStyle.childs();
    const highCloseFillColor = areaStyle.highCloseFillColor.value();
    const closeLowFillColor = areaStyle.closeLowFillColor.value();

    const highCloseAreaGroup = this._filledAreas.get(highCloseFillColor) ?? new AreaBackgroundItemsGroup({ type: 0, color: highCloseFillColor });
    const highCloseAreaItem = highCloseAreaGroup.newItem() ?? new AreaBackgroundItem();
    highCloseAreaGroup.push(highCloseAreaItem);
    this._filledAreas.set(highCloseFillColor, highCloseAreaGroup);

    const closeLowAreaGroup = this._filledAreas.get(closeLowFillColor) ?? new AreaBackgroundItemsGroup({ type: 0, color: closeLowFillColor });
    const closeLowAreaItem = closeLowAreaGroup.newItem() ?? new AreaBackgroundItem();
    closeLowAreaGroup.push(closeLowAreaItem);
    this._filledAreas.set(closeLowFillColor, closeLowAreaGroup);

    const highPoints = [];
    const closePoints = [];
    const lowPoints = [];
    const timePointsCount = this._timePoints.length();

    for (let i = 0; i < timePointsCount; i++) {
      const closePrice = this._closePoints.at(i);
      const highPrice = this._highPoints.at(i);
      const lowPrice = this._lowPoints.at(i);
      const timePoint = this._timePoints.at(i);

      const closePointIsValid = Point.isValid(closePrice);
      const highPointIsValid = Point.isValid(highPrice);
      const lowPointIsValid = Point.isValid(lowPrice);

      if (closePointIsValid && highPointIsValid && lowPointIsValid) {
        highCloseAreaItem.addPoints1Point(timePoint, highPrice);
        highCloseAreaItem.addPoints2Point(timePoint, closePrice);

        closeLowAreaItem.addPoints1Point(timePoint, closePrice);
        closeLowAreaItem.addPoints2Point(timePoint, lowPrice);

        highPoints.push(new Point(timePoint, highPrice));
        closePoints.push(new Point(timePoint, closePrice));
        lowPoints.push(new Point(timePoint, lowPrice));
      }
    }

    this._renderer.append(new AreaBackgroundRenderer({
      barSpacing: barSpacing,
      colorAreas: this._filledAreas
    }));

    this._renderer.append(new PaneRendererLine({
      barSpacing: barSpacing,
      items: lowPoints,
      simpleMode: true,
      withMarkers: false,
      lineColor: areaStyle.lowLineColor.value(),
      lineStyle: areaStyle.lowLineStyle.value(),
      lineWidth: areaStyle.lowLineWidth.value()
    }));

    this._renderer.append(new PaneRendererLine({
      barSpacing: barSpacing

,
      items: highPoints,
      simpleMode: true,
      withMarkers: false,
      lineColor: areaStyle.highLineColor.value(),
      lineStyle: areaStyle.highLineStyle.value(),
      lineWidth: areaStyle.highLineWidth.value()
    }));

    this._renderer.append(new PaneRendererLine({
      barSpacing: barSpacing,
      items: closePoints,
      simpleMode: true,
      withMarkers: false,
      lineColor: areaStyle.closeLineColor.value(),
      lineStyle: areaStyle.closeLineStyle.value(),
      lineWidth: areaStyle.closeLineWidth.value()
    }));

    if (this._model.selection().isSelected(this._source) && this._isMarkersEnabled) {
      const selectionIndexes = this._selectionIndexer.indexes();
      const points = [];
      const bgColors = [];
      const paneHeight = ensureNotNull(this._model.paneForSource(this._source)).height();

      for (let i = 0; i < selectionIndexes.length; i++) {
        const barIndex = selectionIndexes[i];
        const timePointIndex = cachedIndexToScreen.get(barIndex);
        if (timePointIndex === undefined) continue;

        const closePrice = this._closePoints.at(timePointIndex);
        const timePoint = this._timePoints.at(timePointIndex);

        points.push(new Point(timePoint, closePrice));
        bgColors.push(this._model.backgroundColorAtYPercentFromTop(closePrice / paneHeight));
      }

      this._renderer.append(new SelectionRenderer({
        bgColors: bgColors,
        points: points,
        visible: true,
        barSpacing: timeScale.barSpacing(),
        hittestResult: HitTarget.Regular
      }));
    } else {
      this._selectionIndexer.clear();
    }
  }
}

export { SeriesHLCAreaPaneView as SeriesHLCAreaPaneView };