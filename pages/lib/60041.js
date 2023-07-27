import { DefaultProperty, ensureNotNull } from 'some-module';
import { LineDataSource } from 'some-module';
import { e as lazyImport, bind } from 'some-module';

class LineToolBezierQuadro extends LineDataSource {
  constructor(series, properties, model, options) {
    const defaultProperties = properties || LineToolBezierQuadro.createProperties();
    super(series, defaultProperties, model, options);
    this._controlPoint = null;

    lazyImport(/* webpackChunkName: "BezierQuadroPaneView" */ 1583)
      .then(bind(null, lazyImport, 33730))
      .then(BezierQuadroPaneView => {
        this._setPaneViews([new BezierQuadroPaneView(this, series)]);
      });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Curve";
  }

  setLastPoint(x, y) {
    const result = super.setLastPoint(x, y);
    this._controlPoint = this._calculateControlPoint();
    return result;
  }

  addPoint(x, y, index) {
    const result = super.addPoint(x, y, index);
    if (result) {
      const controlPoint = this._calculateControlPoint();
      this._points.push(controlPoint);
      this._controlPoint = null;
      if (!index) {
        this.normalizePoints();
        this.createServerPoints();
      }
      this._createPointProperty(2);
    }
    return result;
  }

  restorePoints(points, baseIndex, transformFn) {
    super.restorePoints(points, baseIndex, transformFn);
    this._createPointProperty(2);
  }

  controlPoint() {
    return this._controlPoint;
  }

  static createProperties(options) {
    const properties = new DefaultProperty("linetoolbezierquadro", options);
    LineToolBezierQuadro._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      lazyImport(7201),
      lazyImport(3753),
      lazyImport(5871),
      lazyImport(8167),
      lazyImport(8537)
    ]).then(bind(null, lazyImport, 84070))
      .then(GeneralBezierDefinitionsViewModel => GeneralBezierDefinitionsViewModel);
  }

  _calculateControlPoint() {
    const point1 = ensureNotNull(this.pointToScreenPoint(this.points()[0]));
    const point2 = ensureNotNull(this.pointToScreenPoint(this.points()[1]));
    const vector = point2.subtract(point1).scaled(0.5).transposed().scaled(0.3);
    const controlPoint = point1.add(point2).scaled(0.5).add(vector);
    return ensureNotNull(this.screenPointToPoint(controlPoint));
  }
}

export {
  LineToolBezierQuadro
};