import { ensureNotNull, ensure } from 'util/assertions';
import { LineDataSource } from 'datasource';
import { Point } from 'geometry';
import { interactionTolerance } from 'chart-options';
import { DefaultProperty } from 'properties';
import { e } from 'lazy-imports';

class LineToolPolyline extends LineDataSource {
  constructor(source, properties, model, options) {
    const props = properties || LineToolPolyline.createProperties();
    super(source, props, model, options);
    this._finished = false;
    e(1583).then(e.bind(e, 50253)).then(PolylinePaneView => {
      this._setPaneViews([new PolylinePaneView(this, source)]);
    });
  }

  pointsCount() {
    return -1;
  }

  name() {
    return "Polyline";
  }

  hasEditableCoordinates() {
    return false;
  }

  finish() {
    this._finished = true;
    this._lastPoint = null;
    this.normalizePoints();
    this.createServerPoints();
  }

  addPoint(point, event, hoverEvent) {
    if (this._finished) return true;

    const priceScale = ensureNotNull(this.priceScale());
    const coordinate = this._model.timeScale().indexToCoordinate(point.index);
    const price = point.price;
    const baseValue = ensure(null === this.ownerSource() || undefined === this.ownerSource() ? undefined : this.ownerSource().firstValue());
    const priceCoordinate = priceScale.priceToCoordinate(price, baseValue);
    const minDistance = interactionTolerance().minDistanceBetweenPoints;

    if (this._points.length > 0) {
      const prevPoint = this._points[this._points.length - 1];
      const prevCoordinate = this._model.timeScale().indexToCoordinate(prevPoint.index);
      const prevPrice = prevPoint.price;
      const prevPriceCoordinate = priceScale.priceToCoordinate(prevPrice, baseValue);
      const distance = new Point(coordinate, priceCoordinate).subtract(new Point(prevCoordinate, prevPriceCoordinate)).length();

      if (!(event === undefined || event.isApiEvent()) && distance < minDistance) {
        this._lastPoint = null;
        this.normalizePoints();
        this.createServerPoints();
        return true;
      }

      const firstPoint = this._points[0];
      const firstCoordinate = this._model.timeScale().indexToCoordinate(firstPoint.index);
      const firstPrice = firstPoint.price;
      const firstPriceCoordinate = priceScale.priceToCoordinate(firstPrice, baseValue);
      const distanceToFirst = new Point(coordinate, priceCoordinate).subtract(new Point(firstCoordinate, firstPriceCoordinate)).length();

      if (!(event === undefined || event.isApiEvent()) && distanceToFirst < minDistance) {
        this.properties().childs().filled.setValue(true);
        this._lastPoint = null;
        this.normalizePoints();
        this.createServerPoints();
        return true;
      }
    }

    return super.addPoint(point, event, hoverEvent);
  }

  setPoint(index, point, event) {
    super.setPoint(index, point, event);

    const priceScale = this.priceScale();
    if (
      this._model.timeScale().isEmpty() ||
      priceScale === null ||
      priceScale.isEmpty() ||
      (index !== this._points.length - 1 && index !== 0)
    ) {
      return;
    }

    const baseValue = ensure(null === this.ownerSource() || undefined === this.ownerSource() ? undefined : this.ownerSource().firstValue());
    const coordinate = this._model.timeScale().indexToCoordinate(point.index);
    const priceCoordinate = priceScale.priceToCoordinate(point.price, baseValue);

    if (index === this._points.length - 1) {
      const firstPoint = this._points[0];
      const firstCoordinate = this._model.timeScale().indexToCoordinate(firstPoint.index);
      const firstPrice = firstPoint.price;
      const firstPriceCoordinate = priceScale.priceToCoordinate(firstPrice, baseValue);

      if (new Point(coordinate, priceCoordinate).subtract(new Point(firstCoordinate, firstPriceCoordinate)).length() < interactionTolerance().minDistanceBetweenPoints) {
        this.properties().childs().filled.setValue(true);
      }
    }
  }

  static createProperties(options) {
    const properties = new DefaultProperty("linetoolpolyline", options);
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return await Promise.all([e.e(7201), e.e(3753), e.e(5871), e.e(8167), e.e(8537)]).then(e.bind(e, 62890)).then(PolylinesDefinitionsViewModel => PolylinesDefinitionsViewModel);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addExclusion("filled");
  }
}

export { LineToolPolyline };