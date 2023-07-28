import { ensureDefined, ensureNotNull } from "./assertions";
// import { emit } from "utils/events";
// import { getLogger } from "utils/logging";
import { LimitedPrecisionNumericFormatter } from "./LimitedPrecisionNumericFormatter";
import { createPropertiesObject } from "./CustomLevelsProperty";

import { LineToolColorsProperty, LineToolWidthsProperty } from "./68806";
import { scaleRatio } from "./29541";
import { Point } from "models/point"; // ! not correct
import { LineDataSource } from "./13087";
import { GannComplexPaneView } from "views/gannComplexPaneView"; // ! not correct
import { CHART_FONT_FAMILY } from "./46501";

// import { createProperties, subscribeToEvents } from "utils/lineToolUtils";

class LineToolGannComplex extends LineDataSource {
  constructor(model, options, priceScale, timeScale) {
    super(
      model,
      options || LineToolGannComplex.createProperties(),
      priceScale,
      timeScale
    );
    this.version = 2;
    this._scaleRatioFormatter = new LimitedPrecisionNumericFormatter(7);
    this._setPaneViews([new GannComplexPaneView(this, this.model())]);

    const properties = this.properties();
    this._adjustScaleRatio(properties);
    properties.subscribe(this, this._adjustScaleRatio);
    properties.childs().scaleRatio.subscribe(this, this._correctFirstPoint);
    this._syncStateExclusions = ["scaleRatio"];

    properties
      .onRestoreFactoryDefaults()
      .subscribe(this, this._handleRestoringFactoryDefaults);
    this._onTemplateApplying.subscribe(this, this._handleTemplateApplying);
    this._onTemplateApplied.subscribe(this, this._correctFirstPoint);
  }

  migrateVersion(fromVersion, toVersion, options) {
    if (fromVersion === 1) {
      if (this._points.length >= this.pointsCount()) {
        setTimeout(() => this._migratePoint());
      } else {
        this._timePoint.length >= this.pointsCount() &&
          this._pointAdded.subscribe(this, this._migratePoint);
      }
    }
  }

  destroy() {
    const properties = this.properties();
    properties.unsubscribe(this, this._adjustScaleRatio);
    properties.childs().scaleRatio.unsubscribe(this, this._correctFirstPoint);
    properties
      .onRestoreFactoryDefaults()
      .unsubscribe(this, this._handleRestoringFactoryDefaults);
    this._onTemplateApplying.unsubscribe(this, this._handleTemplateApplying);
    this._onTemplateApplied.unsubscribe(this, this._correctFirstPoint);
    super.destroy();
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Gann Square";
  }

  addPoint(time, price, index) {
    if (this._points.length > 1) {
      this._points.pop();
    }
    const success = super.addPoint(time, price, index);
    const priceScale = this.priceScale();
    if (ensureNotNull(priceScale).isLog() || !success) {
      return success;
    }
    this._correctFirstPoint();
    return success;
  }

  setPoint(index, time, price) {
    super.setPoint(index, time, price);
    if (price !== undefined && price.shift()) {
      this._correctPoint(index);
    } else {
      this._correctScaleRatio();
    }
  }

  setLastPoint(time, price) {
    const priceScale = this.priceScale();
    if (!ensureNotNull(priceScale).isLog()) {
      this._points[1] = time;
      this._correctPoint(1);
    }
    return super.setLastPoint(time, price);
  }

  isReversed() {
    return this.properties().childs().reverse.value();
  }

  levelsCount() {
    return this.properties().childs().levels.childCount();
  }

  levels() {
    const levels = [];
    const properties = this.properties().childs();
    const count = properties.levels.childCount();
    for (let i = 0; i < count; i++) {
      const levelProperties = properties.levels.childs()[i].childs();
      levels.push({
        index: i,
        visible: levelProperties.visible.value(),
        color: levelProperties.color.value(),
        width: levelProperties.width.value(),
      });
    }
    return levels;
  }

  fanLinesCount() {
    return this.properties().childs().fanlines.childCount();
  }

  fanLines() {
    const fanlines = [];
    const properties = this.properties().childs();
    const count = properties.fanlines.childCount();
    for (let i = 0; i < count; i++) {
      const fanlineProperties = properties.fanlines.childs()[i].childs();
      fanlines.push({
        index: i,
        visible: fanlineProperties.visible.value(),
        x: fanlineProperties.x.value(),
        y: fanlineProperties.y.value(),
        color: fanlineProperties.color.value(),
        width: fanlineProperties.width.value(),
      });
    }
    return fanlines;
  }

  arcsCount() {
    return this.properties().childs().arcs.childCount();
  }

  arcs() {
    const arcs = [];
    const properties = this.properties().childs();
    const count = properties.arcs.childCount();
    for (let i = 0; i < count; i++) {
      const arcProperties = properties.arcs.childs()[i].childs();
      arcs.push({
        index: i,
        visible: arcProperties.visible.value(),
        x: arcProperties.x.value(),
        y: arcProperties.y.value(),
        color: arcProperties.color.value(),
        width: arcProperties.width.value(),
      });
    }
    return arcs;
  }

  arcsBackgroundTransparency() {
    return this.properties()
      .childs()
      .arcsBackground.childs()
      .transparency.value();
  }

  isArcsBackgroundFilled() {
    return this.properties()
      .childs()
      .arcsBackground.childs()
      .fillBackground.value();
  }

  isLabelsVisible() {
    return this.properties().childs().showLabels.value();
  }

  getLabelsStyle() {
    const properties = this.properties().childs();
    const { fontSize, bold, italic } = properties.labelsStyle.childs();
    const levelsCount = properties.levels.childCount();
    return {
      textColor: properties.levels
        .childs()
        [levelsCount - 1].childs()
        .color.value(),
      font: CHART_FONT_FAMILY,
      fontSize: fontSize.value(),
      bold: bold.value(),
      italic: italic.value(),
    };
  }

  getScaleRatioStep() {
    return 1e-7;
  }

  getScaleRatioFormatter() {
    return this._scaleRatioFormatter;
  }

  getPriceDiff() {
    const points = this.points();
    if (points.length < 2) {
      return null;
    }
    const [start, end] = points;
    return end.price - start.price;
  }

  getIndexDiff() {
    const points = this.points();
    if (points.length < 2) {
      return null;
    }
    const [start, end] = points;
    return end.index - start.index;
  }

  getScaleRatio() {
    const priceDiff = this.getPriceDiff();
    const indexDiff = this.getIndexDiff();
    if (priceDiff !== null && indexDiff !== null && indexDiff !== 0) {
      return Math.abs(priceDiff / indexDiff);
    }
    return null;
  }

  static create;

  Properties(options) {
    const properties = createPropertiesObject("linetoolganncomplex", options);
    this._configureProperties(properties);
    return properties;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addExclusion("scaleRatio");

    const widths = [];
    const colors = [];
    const childProperties = properties.childs();

    {
      const count = childProperties.levels.childCount();
      for (let i = 0; i < count; i++) {
        const levelProperties = childProperties.levels.childs()[i].childs();
        widths.push(levelProperties.width);
        colors.push(levelProperties.color);
      }
    }

    {
      const count = childProperties.fanlines.childCount();
      for (let i = 0; i < count; i++) {
        const fanlineProperties = childProperties.fanlines.childs()[i].childs();
        widths.push(fanlineProperties.width);
        colors.push(fanlineProperties.color);
      }
    }

    {
      const count = childProperties.arcs.childCount();
      for (let i = 0; i < count; i++) {
        const arcProperties = childProperties.arcs.childs()[i].childs();
        widths.push(arcProperties.width);
        colors.push(arcProperties.color);
      }
    }

    properties.addChild("linesColors", new LineToolColorsProperty(colors));
    properties.addChild("linesWidths", new LineToolWidthsProperty(widths));
  }

  _correctScaleRatio() {
    const properties = this.properties().childs();
    const scaleRatio = this.getScaleRatio();
    properties.scaleRatio.setValue(scaleRatio);
  }

  _getAdjustedScaleRatio() {
    const priceScale = this.model().mainSeries().priceScale();
    const timeScale = this.model().timeScale();
    return scaleRatio(timeScale, priceScale);
  }

  _adjustScaleRatio(properties) {
    const scaleRatio = properties.scaleRatio.value();
    if (scaleRatio === "" || scaleRatio === null) {
      properties.scaleRatio.setValue(this._getAdjustedScaleRatio());
    }
  }

  _correctPoint(index) {
    if (this._points.length < 2) {
      return;
    }
    const indexDiff = this.getIndexDiff();
    if (indexDiff === null) {
      return;
    }

    const scaleRatio = this.properties().childs().scaleRatio.value();
    if (scaleRatio !== null) {
      const point = this._points[index];
      const referencePoint = index === 0 ? this._points[1] : this._points[0];
      const isPriceIncreasing = point.price - referencePoint.price > 0;
      const isIndexIncreasing = point.index - referencePoint.index > 0;
      let sign =
        (isPriceIncreasing && !isIndexIncreasing) ||
        (!isPriceIncreasing && isIndexIncreasing)
          ? -1
          : 1;
      if (index === 0) {
        sign = -sign;
      }
      point.price = referencePoint.price + sign * indexDiff * scaleRatio;
      this._pointChanged.fire(index);
    }

    this.normalizePoints();
  }

  _correctFirstPoint() {
    this._correctPoint(this.isReversed() ? 0 : 1);
  }

  _handleRestoringFactoryDefaults() {
    this.properties()
      .childs()
      .scaleRatio.setValue(this._getAdjustedScaleRatio());
  }

  _handleTemplateApplying(template) {
    if (template.scaleRatio === "") {
      template.scaleRatio = this._getAdjustedScaleRatio();
    }
  }

  _migratePoint() {
    if (this.points().length < this.pointsCount()) {
      return;
    }
    const screenPoints = this._getScreenPoints();
    if (screenPoints === null) {
      return;
    }
    const targetPoint = ensureNotNull(this.screenPointToPoint(screenPoints[1]));
    this.setPoint(1, targetPoint);
    this._pointAdded.unsubscribe(this, this._migratePoint);
  }

  _getScreenPoints() {
    const angle = this._calcAngle();
    if (angle === null) {
      return null;
    }
    let [startPoint, endPoint] = this.points();
    if (this.isReversed()) {
      [startPoint, endPoint] = [endPoint, startPoint];
    }
    const startPointScreen = ensureNotNull(this.pointToScreenPoint(startPoint));
    const endPointScreen = ensureNotNull(this.pointToScreenPoint(endPoint));
    const length = Math.sqrt(
      Math.pow(endPointScreen.x - startPointScreen.x, 2) +
        Math.pow(endPointScreen.y - startPointScreen.y, 2)
    );
    const normalizedDirection = new Point(
      Math.cos(angle),
      -Math.sin(angle)
    ).normalized();
    const isDirectionXNegative = normalizedDirection.x < 0;
    const isDirectionYNegative = normalizedDirection.y < 0;
    const x = isDirectionXNegative ? -1 : 1;
    const y = isDirectionYNegative ? -1 : 1;
    return [
      startPointScreen.addScaled(normalizedDirection, length),
      startPointScreen.add(new Point(5 * length * x, 5 * length * y)),
    ];
  }

  _calcAngle() {
    const [startPoint, endPoint] = this.points();
    const startPointScreen = ensureNotNull(this.pointToScreenPoint(startPoint));
    let direction = ensureNotNull(this.pointToScreenPoint(endPoint)).subtract(
      startPointScreen
    );
    if (direction.length() > 0) {
      direction = direction.normalized();
      let angle = Math.acos(direction.x);
      if (direction.y > 0) {
        angle = -angle;
      }
      return angle;
    }
    return null;
  }
}

export { LineToolGannComplex };
