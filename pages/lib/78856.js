import { Point, ensureNotNull } from "some-library";
import {
  customFormatters,
  numberToStringWithLeadingZero,
} from "some-other-library";

class TrendAngleProperty extends Property {
  constructor(lineSource) {
    super();
    this.lineSource = lineSource;
  }

  value() {
    return Math.round((180 * this.lineSource.angle()) / Math.PI);
  }

  setValue(value) {
    const angleRadians = (value * Math.PI) / 180;
    const startPoint = ensureNotNull(
      this.lineSource.pointToScreenPoint(this.lineSource.points()[0])
    );
    const cos = Math.cos(angleRadians);
    const sin = -Math.sin(angleRadians);
    const direction = new Point(cos, sin);
    const endPoint = startPoint.addScaled(
      direction,
      this.lineSource.distance()
    );
    const endPointInData = ensureNotNull(
      this.lineSource.screenPointToPoint(endPoint)
    );

    this.lineSource.setPoint(1, endPointInData);
    const model = this.lineSource.model();
    model.updateSource(this.lineSource);
    this.lineSource.updateAllViews(sourceChangeEvent(this.lineSource.id()));
    model.updateSource(this.lineSource);
  }

  notifyChanged() {
    this.listeners.fire(this);
  }
}

export class LineToolTrendAngle extends LineDataSource {
  constructor(model, options, priceScale, id) {
    const properties = options || LineToolTrendAngle.createProperties();
    super(model, properties, priceScale, id);

    this._angle = 0;
    this._distance = 0;

    properties.addChild("angle", new TrendAngleProperty(this));

    import(
      /* webpackChunkName: "line-tools-trend-angle" */ "./trend-angle-pane-view"
    ).then(({ TrendAnglePaneView }) => {
      const paneViews = [new TrendAnglePaneView(this, model)];
      this._setPaneViews(paneViews);
    });
  }

  isSynchronizable() {
    return false;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Trend Angle";
  }

  angle() {
    return this._angle;
  }

  distance() {
    return this._distance;
  }

  addPoint(index, price, time) {
    const added = super.addPoint(index, price, time);
    if (added) {
      this._calculateAngle();
    }
    return added;
  }

  setLastPoint(price, time) {
    const set = super.setLastPoint(price, time);
    if (this.points().length > 1) {
      this._calculateAngle();
    }
    return set;
  }

  axisPoints() {
    if (this.points().length < 2) {
      return [];
    }

    const axisPoints = [this.points()[0]];
    const startPoint = ensureNotNull(this.pointToScreenPoint(this.points()[0]));
    const x = Math.cos(this._angle) * this._distance;
    const y = -Math.sin(this._angle) * this._distance;
    const endPoint = startPoint.add(new Point(x, y));
    const endPointInData = ensureNotNull(this.screenPointToPoint(endPoint));
    axisPoints.push(endPointInData);

    return axisPoints;
  }

  timeAxisPoints() {
    return this.axisPoints();
  }

  priceAxisPoints() {
    return this.axisPoints();
  }

  setPoint(index, price, time) {
    super.setPoint(index, price, time);
    if (this.points().length > 1 && index === 1) {
      this._calculateAngle();
    }
  }

  restoreData(data) {
    this._angle = data.angle ?? 0;
    this._distance = data.distance ?? 0;
  }

  state() {
    const state = super.state();
    state.angle = this._angle;
    state.distance = this._distance;
    return state;
  }

  cloneData(source) {
    this._angle = source.angle();
    this._distance = source.distance();
  }

  canHasAlert() {
    return true;
  }

  static createProperties(options) {
    if (
      options &&
      options.showPriceRange !== undefined &&
      options.showPercentPriceRange === undefined &&
      options.showPipsPriceRange === undefined
    ) {
      options.showPercentPriceRange = options.showPriceRange;
      options.showPipsPriceRange = options.showPriceRange;
    }

    const properties = new DefaultProperty("line-tool-trend-angle", options);
    this._configureProperties(properties);
    return properties;
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  _getAlertPlots() {
    const plot = this._linePointsToAlertPlot(
      this._points,
      null,
      this._properties.childs().extendLeft.value(),
      this._properties.childs().extendRight.value()
    );
    return plot ? [plot] : [];
  }

  _calculateAngle() {
    const startPoint = ensureNotNull(this.pointToScreenPoint(this.points()[0]));
    let endPointDiff = ensureNotNull(
      this.pointToScreenPoint(this.points()[1])
    ).subtract(startPoint);
    const distance = endPointDiff.length();

    if (distance > 0) {
      endPointDiff = endPointDiff.normalized();
      this._angle = Math.acos(endPointDiff.x);
      if (endPointDiff.y > 0) {
        this._angle = -this._angle;
      }
      this._distance = distance;
    } else {
      this._angle = 0;
    }

    this.properties().childs().angle.notifyChanged();
  }

  _getPropertyDefinitionsViewModelClass() {
    return import(
      /* webpackChunkName: "line-tools-trend-angle" */ "./trend-angle-definitions-view-model"
    ).then(
      ({ TrendAngleDefinitionsViewModel }) => TrendAngleDefinitionsViewModel
    );
  }
}
