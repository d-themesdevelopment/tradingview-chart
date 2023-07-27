import { AbstractFilledAreaPaneView } from '50151';
import { generateColor } from '87095';
import { clamp, ensureNotNull } from '37160';
import { AreaBackgroundRenderer, AreaBackgroundItemsGroup, AreaBackgroundItem, CachedMap } from '82386';
import { PriceDataSource } from '86094';
import { LevelsProperty } from '45197';
import { ObjectValuesCache, CachedContainer } from '77173';

function getColorKey(color) {
  return color.type === 0 ? `${color.color}` : `${color.color1}:${color.color2}:${color.value1}:${color.value2}`;
}

class StudyValuesCache extends ObjectValuesCache {
  _newObject() {
    return {
      plot1Value: undefined,
      plot2Value: undefined,
      colorValue: undefined,
    };
  }

  _clearObject(obj) {
    obj.plot1Value = undefined;
    obj.plot2Value = undefined;
    obj.colorValue = undefined;
  }
}

class ColorValuesCache extends ObjectValuesCache {
  _newObject() {
    return {
      type: undefined,
      colorIndexOrRgba: undefined,
      colorIndexOrRgba1: undefined,
      colorIndexOrRgba2: undefined,
      value1: undefined,
      value2: undefined,
    };
  }

  _clearObject(obj) {
    const value = obj;
    value.type = undefined;
    value.colorIndexOrRgba = undefined;
    value.colorIndexOrRgba1 = undefined;
    value.colorIndexOrRgba2 = undefined;
    value.value1 = undefined;
    value.value2 = undefined;
  }
}

class AbstractFilledAreaPaneView {
  constructor(source, model, fillGaps = false) {
    this._isHlineFill = false;
    this._bandAKey = null;
    this._bandBKey = null;
    this._colorPlotIndex = null;
    this._colors = new CachedContainer();
    this._areaRenderer = new AreaBackgroundRenderer();
    this._invalidated = true;
    this._plIndex1 = null;
    this._plIndex2 = null;
    this._level1 = 0;
    this._level2 = 0;
    this._studyValuesCache = new StudyValuesCache();
    this._colorValuesCache = new ColorValuesCache();
    this._points1 = new CachedContainer();
    this._points2 = new CachedContainer();
    this._timePoints = new CachedContainer();
    this._colorAreas = new CachedMap();
    this._source = source;
    this._model = model;
    this._fillGaps = fillGaps;
  }

  update() {
    this._invalidated = true;
  }

  renderer(data, priceScale) {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    return this._areaRenderer;
  }

  _correctVisibleRange(range, plotOffset) {
    const plottableRange = this._source.data().plottableRange();
    const firstBar = range.firstBar() + Math.min(0, plotOffset) - 1;
    const lastBar = range.lastBar() - plotOffset + 1;
    const plottableLeft = plottableRange.search(firstBar, PriceDataSource.PlotRowSearchMode.NearestLeft, this._plotIndex1());
    const plottableRight = plottableRange.search(lastBar, PriceDataSource.PlotRowSearchMode.NearestRight, this._plotIndex1());

    const validLeft = ensureNotNull(plottableLeft).index;
    const validRight = ensureNotNull(plottableRight).index;
    const gapLeft = range.firstBar() - 1;
    const gapRight = range.lastBar() + 1;

    let startGap = Infinity;
    if (this._colorPlotIndex !== null && (plottableLeft !== null || plottableRight !== null)) {
      const gapBar = plottableRange.search(Math.min(gapLeft, gapRight) - 1, PriceDataSource.PlotRowSearchMode.NearestLeft);
      if (gapBar !== null) {
        startGap = gapBar.index;
      }
    }

    return [Math.min(gapLeft, gapRight, startGap), Math.max(validLeft, validRight)];
  }

  _plotNames() {
    return this._source.metaInfo().plots.map(plot => plot.id);
  }

  _plotIndex1() {
    if (this._plIndex1 === null) {
      this._plIndex1 = this._plotNames().indexOf(this._plotAId()) + 1;
    }
    return this._plIndex1;
  }

  _plotIndex2() {
    if (this._plIndex2 === null) {
      this._plIndex2 = this._plotNames().indexOf(this._plotBId()) + 1;
    }
    return this._plIndex2;
  }

  _updateImpl() {
    if (this._areaRenderer.setData(null), !this._visible()) {
      return;
    }

    const priceScale = this._source.priceScale();
    const timeScale = this._model.timeScale();
    if (!priceScale || priceScale.isEmpty() || timeScale.isEmpty()) {
      return;
    }

    if (this._model.mainSeries().bars().isEmpty()) {
      return;
    }

    const firstValue = this._source.firstValue();
    if (firstValue === null) {
      return;
    }

    if (this._isHlineFill) {
      const bandA = this._source.properties().bands[ensureNotNull(this._bandAKey)];
      const bandB = this._source.properties().bands[ensureNotNull(this._

bandBKey)];
      this._level1 = priceScale.priceToCoordinate(bandA.value.value(), firstValue);
      this._level2 = priceScale.priceToCoordinate(bandB.value.value(), firstValue);
    }

    const visibleRange = timeScale.visibleBarsStrictRange();
    if (visibleRange === null) {
      return;
    }

    const plottableRange = this._source.data().plottableRange();
    if (plottableRange.isEmpty()) {
      return;
    }

    const startIndex = plottableRange.firstIndex();
    const endIndex = plottableRange.lastIndex();
    const correctedRange = this._correctVisibleRange(visibleRange, endIndex);

    const [start, end] = correctedRange;
    const studyValuesCache = this._studyValuesCache;
    const colorValuesCache = this._colorValuesCache;
    const points1 = this._points1;
    const points2 = this._points2;
    const timePoints = this._timePoints;
    const colorAreas = this._colorAreas;
    const colors = this._colorPlotIndex !== null ? this._colors : null;
    const plotIndex1 = this._plotIndex1();
    const plotIndex2 = this._plotIndex2();

    studyValuesCache.invalidateCache();
    colorValuesCache.invalidateCache();
    points1.invalidateCache();
    points2.invalidateCache();
    timePoints.invalidateCache();
    colorAreas.invalidateCache();

    const plottableLength = endIndex - plotIndex2;
    const plotLength = plottableLength + Math.max(start, plotOffset);
    const plotMin = Math.min(start, plotOffset);

    const plotIterator = plottableRange.rangeIterator(plotMin, plotLength);
    let previousIndex = null;

    for (let i = 0; i < plotLength; i++) {
      const plot = plotIterator.next();
      const index = plot.index;
      const values = plot.value;

      const value1 = values[plotIndex1];
      const value2 = values[plotIndex2];

      const sourceIndex1 = index + plotOffset;
      const sourceIndex2 = index + plotOffset;

      if (sourceIndex1 === sourceIndex2 && studyValuesCache.isValidIndex(sourceIndex1)) {
        const cacheObject = studyValuesCache.at(sourceIndex1);
        cacheObject.plot1Value = value1;
        cacheObject.plot2Value = value2;
      } else {
        if (studyValuesCache.isValidIndex(sourceIndex1)) {
          studyValuesCache.at(sourceIndex1).plot1Value = value1;
        }
        if (studyValuesCache.isValidIndex(sourceIndex2)) {
          studyValuesCache.at(sourceIndex2).plot2Value = value2;
        }
      }

      if (colors !== null && previousIndex !== null) {
        const sourceIndex = previousIndex + plotOffset;
        if (studyValuesCache.isValidIndex(sourceIndex)) {
          const cacheObject = studyValuesCache.at(sourceIndex);
          const colorPlotIndex = ensureNotNull(this._colorPlotIndex);
          if (colorPlotIndex.type === 0) {
            const colorObject = colorValuesCache.at(sourceIndex);
            cacheObject.colorValue = colorObject;
            colorObject.type = 0;
            colorObject.colorIndexOrRgba = values[colorPlotIndex.colorIndexOrRgba + 1];
          } else {
            const colorObject = colorValuesCache.at(sourceIndex);
            cacheObject.colorValue = colorObject;
            colorObject.colorIndexOrRgba1 = colorPlotIndex.colorIndexOrRgba1 !== undefined ? values[colorPlotIndex.colorIndexOrRgba1 + 1] : undefined;
            colorObject.colorIndexOrRgba2 = colorPlotIndex.colorIndexOrRgba2 !== undefined ? values[colorPlotIndex.colorIndexOrRgba2 + 1] : undefined;
            colorObject.value1 = colorPlotIndex.valueIndex1 !== undefined ? values[colorPlotIndex.valueIndex1 + 1] : undefined;
            colorObject.value2 = colorPlotIndex.valueIndex2 !== undefined ? values[colorPlotIndex.valueIndex2 + 1] : undefined;
          }
        }
      }

      previousIndex = index;
    }

    const timeScaleBarSpacing = this._model.timeScale().barSpacing();

    let previousColor = null;
    let currentColor = null;
    let previousArea = null;
    const commonColor = this._commonColor();
    if (commonColor.type === 1) {
      commonColor.value1 = getColorKey(commonColor.value1);
      commonColor.value2 = getColorKey(commonColor.value2);
      commonColor.color1 = commonColor.color1 && generateColor(commonColor.color1);
      commonColor.color2 = commonColor.color2 && generateColor(commonColor.color2);
    } else {
      commonColor.color = generateColor(commonColor.color);
    }

    const timePointsLength = timePoints.length();
    for (let i = 0; i < timePointsLength; i++) {
      if (!this._fillGaps && (previousColor === null || currentColor === null)) {
        const previousIndex = i - 1;
        timePoints.push(previousIndex);
        points1.push(NaN);
        points2.push(NaN);
        if (colors !== null) {
          colors.push(null);
        }
      }

      const level1 = this._isHlineFill ? this._level1 : points1.at(i);
      const level2 = this._isHlineFill ? this._level2 : points2.at(i);
      const timePoint = timePoints.at(i);

      const hasLevel1 = (0, ensureNotNull)((0, clamp)(level1));
      const hasLevel2 = (0, ensureNotNull)((0, clamp)(level2));

      if (this._fillGaps ? hasLevel1 || hasLevel2 : hasLevel1 && hasLevel2) {
        const colorObject = colors ? colors.at(i) || commonColor : commonColor;

        if (!(previousColor === null || previousColor === colorObject) || previousArea === null) {
          if (previousArea !== null) {
            if (hasLevel1) {
              previousArea.addPoints1Point(timePoint, level1);
            }
            if (hasLevel2) {
              previousArea.addPoints2Point(timePoint, level2);
            }
          }
          if (i === timePointsLength - 1) {
            continue;
          }

          previousColor = colorObject;
          const key = getColorKey(colorObject);
          const colorAreas = this._colorAreas;
          let areaGroup =

 null;
          if (colorAreas.has(key)) {
            areaGroup = colorAreas.get(key);
          } else {
            areaGroup = new AreaBackgroundItemsGroup(colorObject);
            colorAreas.set(key, areaGroup);
          }
          previousArea = areaGroup.newItem() || new AreaBackgroundItem();
          areaGroup.push(previousArea);
        }

        if (hasLevel1) {
          previousArea.addPoints1Point(timePoint, level1);
        }
        if (hasLevel2) {
          previousArea.addPoints2Point(timePoint, level2);
        }
      } else if (!this._fillGaps) {
        previousColor = null;
        previousArea = null;
      }
    }

    colorAreas.delete(getColorKey(commonColor));

    const data = {
      barSpacing: this._model.timeScale().barSpacing(),
      colorAreas: this._getFilledAreas(timePoints, points1, points2, colors, priceScale.priceToCoordinate, generateColor),
    };

    this._areaRenderer.setData(data);
  }

  _getFilledAreas(timePoints, points1, points2, colors, priceToCoordinate, generateColor) {
    const isHlineFill = this._isHlineFill;
    if (!isHlineFill && (points1.length() === 0 || points2.length() === 0)) {
      return new CachedMap();
    }

    const colorAreas = this._colorAreas;
    let previousColor = null;
    let currentColor = null;
    let previousArea = null;
    const commonColor = this._commonColor();

    if (commonColor.type === 1) {
      commonColor.value1 = priceToCoordinate(commonColor.value1);
      commonColor.value2 = priceToCoordinate(commonColor.value2);
      commonColor.color1 = commonColor.color1 && generateColor(commonColor.color1);
      commonColor.color2 = commonColor.color2 && generateColor(commonColor.color2);
    } else {
      commonColor.color = generateColor(commonColor.color);
    }

    const timePointsLength = timePoints.length();
    for (let i = 0; i < timePointsLength; i++) {
      const level1 = isHlineFill ? this._level1 : points1.at(i);
      const level2 = isHlineFill ? this._level2 : points2.at(i);
      const timePoint = timePoints.at(i);

      const hasLevel1 = (0, ensureNotNull)((0, clamp)(level1));
      const hasLevel2 = (0, ensureNotNull)((0, clamp)(level2));

      if (this._fillGaps ? hasLevel1 || hasLevel2 : hasLevel1 && hasLevel2) {
        const colorObject = colors ? colors.at(i) || commonColor : commonColor;

        if (!(previousColor === null || previousColor === colorObject) || previousArea === null) {
          if (previousArea !== null) {
            if (hasLevel1) {
              previousArea.addPoints1Point(timePoint, level1);
            }
            if (hasLevel2) {
              previousArea.addPoints2Point(timePoint, level2);
            }
          }
          if (i === timePointsLength - 1) {
            continue;
          }

          previousColor = colorObject;
          const key = getColorKey(colorObject);
          const areaGroup = colorAreas.has(key) ? colorAreas.get(key) : new AreaBackgroundItemsGroup(colorObject);
          previousArea = areaGroup.newItem() || new AreaBackgroundItem();
          areaGroup.push(previousArea);
        }

        if (hasLevel1) {
          previousArea.addPoints1Point(timePoint, level1);
        }
        if (hasLevel2) {
          previousArea.addPoints2Point(timePoint, level2);
        }
      } else if (!this._fillGaps) {
        previousColor = null;
        previousArea = null;
      }
    }

    return colorAreas;
  }
}

export { AbstractFilledAreaPaneView };