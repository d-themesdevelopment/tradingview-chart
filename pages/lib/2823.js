"use strict";

import { LineDataSource } from "./13087";
import { TranslatedString, t } from "./TranslatedString";
import { ensure, ensureDefined, ensureNotNull } from "./assertions";

import { Action } from "./39347";
import { clone, isString } from "./StrickTypeChecks";

import { DefaultProperty } from "./46100";
import { LineToolBarsPatternMode } from "line-tool-bars-pattern-mode-module"; // ! not correct
import { PlotRowSearchMode } from "plot-row-search-mode-module"; // ! not correct
// import { LineToolWidthsProperty, LineToolColorsProperty } from 'property-module';
// import { BarsPatternPaneView } from 'bars-pattern-pane-view-module';
import { sourceChangeEvent } from "source-change-event-module"; // ! not correct

const mirrorBarsPatternLabel = new TranslatedString(
  "mirror bars pattern",
  t(null, void 0, 81870)
);

const flipBarsPatternLabel = new TranslatedString(
  "flip bars pattern",
  t(null, void 0, 59942)
);

const mirroredLabel = t(null, void 0, 63158);
const flippedLabel = t(null, void 0, 92754);

const patternMap = {
  0: 2,
  1: 4,
  2: 1,
  3: 1,
  4: 2,
  5: 3,
  6: -1,
};

const coordinateMap = {
  0: 3,
  1: 4,
  2: 4,
  3: 1,
  4: 2,
  5: 3,
  6: -1,
};

class LineToolBarsPattern extends LineDataSource {
  constructor(e, t = LineToolBarsPattern.createProperties(), s, r) {
    super(e, t, s, r);
    this._pattern = [];
    this._scale = 1;
    this._pointsCoordinatePricesDiff = null;

    const mode = t.childs().mode.value();
    if (isString(mode)) {
      t.childs().mode.setValue(parseInt(mode));
    }

    t.childs().mirrored.listeners().subscribe(this, this._mirror);
    t.childs().flipped.listeners().subscribe(this, this._flip);
    t.childs().mode.subscribe(this, this._updateLastPoint);

    this.version = 2;

    import(1583).then((i) => {
      const { BarsPatternPaneView } = i;
      this._setPaneViews([new BarsPatternPaneView(this, e)]);
    });
  }

  pattern() {
    return this._pattern;
  }

  isSynchronizable() {
    return false;
  }

  additionalActions(e) {
    return [
      new Action({
        actionId: "Chart.LineTool.BarsPattern.ToggleMirrored",
        checked: this.properties().childs().mirrored.value(),
        checkable: true,
        label: mirroredLabel,
        onExecute: () => {
          e.setProperty(
            this.properties().childs().mirrored,
            !this.properties().childs().mirrored.value(),
            mirrorBarsPatternLabel
          );
          this.updateAllViews(sourceChangeEvent(this.id()));
          this._model.updateSource(this);
        },
      }),
      new Action({
        actionId: "Chart.LineTool.BarsPattern.ToggleFlipped",
        checked: this.properties().childs().flipped.value(),
        checkable: true,
        label: flippedLabel,
        onExecute: () => {
          e.setProperty(
            this.properties().childs().flipped,
            !this.properties().childs().flipped.value(),
            flipBarsPatternLabel
          );
          this.updateAllViews(sourceChangeEvent(this.id()));
          this._model.updateSource(this);
        },
      }),
    ];
  }

  pointsCount() {
    return 2;
  }

  state(e) {
    return {
      ...super.state(e),
      pattern: this._pattern,
      scale: this._scale,
      diff: this._pointsCoordinatePricesDiff,
    };
  }

  restoreData(e) {
    const {
      pattern = this._pattern,
      scale = this._scale,
      diff = this._pointsCoordinatePricesDiff,
    } = e;
    this._pattern = pattern;
    this._scale = scale;
    this._pointsCoordinatePricesDiff = diff;
  }

  name() {
    return "Bars Pattern";
  }

  hasEditableCoordinates() {
    return false;
  }

  cloneData(e) {
    this._pattern = clone(e._pattern);
    this._scale = e._scale;
    this._pointsCoordinatePricesDiff = e._pointsCoordinatePricesDiff;
  }

  firstPatternPrice() {
    const { mode, flipped } = this.properties().childs();
    const pattern = this._pattern[0];

    if (mode.value() === LineToolBarsPatternMode.LineHL2) {
      return (pattern[2] + pattern[3]) / 2;
    }

    return flipped.value()
      ? pattern[coordinateMap[mode.value()]]
      : pattern[patternMap[mode.value()]];
  }

  lastPatternPrice() {
    const { mode, flipped } = this.properties().childs();
    const pattern = this._pattern[this._pattern.length - 1];

    if (mode.value() === LineToolBarsPatternMode.LineHL2) {
      return (pattern[2] + pattern[3]) / 2;
    }

    return flipped.value()
      ? pattern[patternMap[mode.value()]]
      : pattern[coordinateMap[mode.value()]];
  }

  addPoint(e, t, i) {
    const added = super.addPoint(e, t, true);

    if (added) {
      const mainSeries = this._model.mainSeries();
      const [{ index: startIndex }, { index: endIndex }] = this.points();
      const startBarIndex = ensureDefined(
        mainSeries.nearestIndex(
          Math.min(startIndex, endIndex),
          PlotRowSearchMode.NearestRight
        )
      );
      const endBarIndex = ensureDefined(
        mainSeries.nearestIndex(
          Math.max(startIndex, endIndex),
          PlotRowSearchMode.NearestLeft
        )
      );

      this._pattern = this._createPattern(startBarIndex, endBarIndex);

      if (this._pattern.length > 0) {
        if (startIndex > endIndex) {
          this._points.reverse();
        }

        this._points[1].price =
          this._points[0].price + this._patternPriceDiff();
        this._points[1].index =
          this._points[0].index + (endBarIndex - startBarIndex);
        this.normalizePoints();
        this.createServerPoints();
      }

      this._updatePointsCoordinatePricesDiff();
    }

    return added;
  }

  setPoint(e, t, i, s) {
    if (e === 1 && t.index <= this._points[0].index) {
      t.index = this._points[0].index + 1;
    }

    if (e === 0 && t.index >= this._points[1].index) {
      t.index = this._points[1].index - 1;
    }

    super.setPoint(e, t, i);
    this._updatePointsCoordinatePricesDiff();
  }

  move(e, t, i, s) {
    super.move(e, t, i, s);
    this._updatePointsCoordinatePricesDiff();
  }

  migrateVersion(e, t, i) {
    if (e === 1 && this._pattern.length > 0) {
      const priceDiff = this._patternPriceDiff();

      if (this._timePoint.length === 2) {
        this._timePoint[1].price = this._timePoint[0].price + priceDiff;
      }

      if (this._points.length === 2) {
        this._points[1].price = this._points[0].price + priceDiff;
      }
    }
  }

  getScale() {
    return (this._scale = this._calculateScale());
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolbarspattern", e);
    this._configureProperties(properties);
    return properties;
  }

  _preparePoint(e, t) {
    const point = this._alignPointToRangeOfActualData(e);
    const mainSeries = this._model.mainSeries();
    const bar = ensureNotNull(mainSeries.bars().valueAt(point.index));

    if (
      this.properties().childs().mode.value() === LineToolBarsPatternMode.Bars
    ) {
      point.price = ensure(bar[2]);
    } else {
      point.price = ensure(bar[4]);
    }

    const priceScale = ensure(this.priceScale());
    const firstValue = ensure(
      null === this.ownerSource() ? void 0 : this.ownerSource().firstValue()
    );
    const y =
      priceScale.priceToCoordinate(point.price, firstValue) -
      0.05 * priceScale.height();
    point.price = priceScale.coordinateToPrice(y, firstValue);

    return super._preparePoint(point, t);
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]).then((i) => i[0].BarsPatternDefinitionsViewModel);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addExclusion("mirrored");
    properties.addExclusion("flipped");
  }

  _calculatePatternCoordinatePricesDiff() {
    if (this._pattern.length > 0) {
      const firstPatternPrice = this.firstPatternPrice();
      const lastPatternPrice = this.lastPatternPrice();
      const diff = this._priceCoordinateDiff([
        firstPatternPrice,
        lastPatternPrice,
      ]);
      return diff !== null && diff !== undefined ? diff : null;
    }

    return null;
  }

  _updatePointsCoordinatePricesDiff() {
    this._pointsCoordinatePricesDiff =
      this._calculatePointsCoordinatePricesDiff();
  }

  _calculatePointsCoordinatePricesDiff() {
    if (this._points.length === 2) {
      const [startPoint, endPoint] = this.points();
      const diff = this._priceCoordinateDiff([
        startPoint.price,
        endPoint.price,
      ]);
      return diff !== null && diff !== undefined ? diff : null;
    }

    return null;
  }

  _createPattern(startIndex, endIndex) {
    const mainSeriesData = this._model.mainSeries().data();
    const pattern = [];

    for (let i = startIndex; i <= endIndex; i++) {
      pattern.push(clone(ensureNotNull(mainSeriesData.valueAt(i))));
    }

    return pattern;
  }

  _switchPointsPrice() {
    const firstPrice = this._points[0].price;
    this._timePoint[0].price = this._points[0].price = this._points[1].price;
    this._timePoint[1].price = this._points[1].price = firstPrice;
  }

  _mirror = () => {
    const pattern = this._pattern;
    let min = Math.min(pattern[0][3], pattern[0][2]);
    let max = Math.max(pattern[0][3], pattern[0][2]);

    for (let i = 1; i < pattern.length; i++) {
      min = Math.min(min, pattern[i][3]);
      max = Math.max(max, pattern[i][2]);
    }

    if (min < max) {
      const middle = (min + max) / 2;
      const flip = (value) => middle - (value - middle);

      for (let i = 0; i < pattern.length; i++) {
        pattern[i][2] = flip(pattern[i][2]);
        pattern[i][3] = flip(pattern[i][3]);
        pattern[i][1] = flip(pattern[i][1]);
        pattern[i][4] = flip(pattern[i][4]);
      }
    }

    this._switchPointsPrice();
    this.updateAllViews(sourceChangeEvent(this.id()));
  };

  _flip = () => {
    const pattern = this._pattern;
    const patternLength = pattern.length;

    for (let i = 0; i < patternLength / 2; i++) {
      const temp = pattern[i];
      pattern[i] = pattern[patternLength - i - 1];
      pattern[patternLength - i - 1] = temp;
    }

    this._switchPointsPrice();
    this.updateAllViews(sourceChangeEvent(this.id()));
  };

  _patternPriceDiff() {
    return this.lastPatternPrice() - this.firstPatternPrice();
  }

  _pricesToCoordinates(prices) {
    const priceScale = this.priceScale();
    const firstValue = this.ownerSource()?.firstValue();

    if (firstValue !== null && priceScale !== null && !priceScale.isEmpty()) {
      return prices.map((price) =>
        priceScale.priceToCoordinate(price, firstValue)
      );
    }
  }

  _priceCoordinateDiff(prices) {
    const coordinates = this._pricesToCoordinates(prices);
    if (coordinates) {
      return coordinates[1] - coordinates[0];
    }
  }

  _calculateScale() {
    let scale = 1;

    if (this._points.length === 2) {
      const patternDiff = this._calculatePatternCoordinatePricesDiff();

      if (patternDiff) {
        const pointsDiff = this._calculatePointsCoordinatePricesDiff();

        if (patternDiff && pointsDiff !== null) {
          scale = +(pointsDiff / patternDiff).toFixed(8);

          if (this._pointsCoordinatePricesDiff !== pointsDiff) {
            if (this._scale !== scale) {
              this._updateLastPoint();
              return this._scale;
            }

            this._updatePointsCoordinatePricesDiff();
          }
        }
      }
    }

    return scale;
  }

  _updateLastPoint() {
    if (this._points.length < 2) {
      return;
    }

    const priceScale = this.priceScale();
    const firstValue = this.ownerSource()?.firstValue();

    if (firstValue === null || priceScale === null || priceScale.isEmpty()) {
      return;
    }

    const patternDiff = this._calculatePatternCoordinatePricesDiff();
    const startPriceCoordinates = this._pricesToCoordinates([
      this.points()[0].price,
    ]);

    if (patternDiff && startPriceCoordinates) {
      const newPrice = this._scale * patternDiff + startPriceCoordinates[0];

      this._timePoint[1].price = this._points[1].price =
        priceScale.coordinateToPrice(newPrice, firstValue);
      this._updatePointsCoordinatePricesDiff();
    }
  }
}

export { LineToolBarsPattern };
