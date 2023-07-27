import { ensureNotNull } from 'utils';
import { LineDataSource } from 'lineDataSource';
import { DefaultProperty } from 'property';
import { BezierCubicPaneView } from 'bezierCubicPaneView';
import { GeneralBezierDefinitionsViewModel } from 'viewModel';

class LineToolBezierCubic extends LineDataSource {
  constructor(source, priceScale, timeScale, seriesApi) {
    const properties = priceScale || LineToolBezierCubic.createProperties();
    super(source, properties, timeScale, seriesApi);
    this._controlPoints = null;
    import(/* webpackChunkName: "bezierCubicPaneView" */ 56853).then(({ BezierCubicPaneView }) => {
      this._setPaneViews([new BezierCubicPaneView(this, source)]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Double Curve";
  }

  setLastPoint(x, y) {
    const result = super.setLastPoint(x, y);
    this._controlPoints = this._calculateControlPoints();
    return result;
  }

  addPoint(x, y, index) {
    const result = super.addPoint(x, y, index);
    if (result) {
      const controlPoints = this._calculateControlPoints();
      this._controlPoints = null;
      this._points.push(controlPoints[0]);
      this._points.push(controlPoints[1]);
      if (!index) {
        this.normalizePoints();
        this.createServerPoints();
      }
      this._createPointProperty(2);
      this._createPointProperty(3);
    }
    return result;
  }

  restorePoints(data, priceData, timeData) {
    super.restorePoints(data, priceData, timeData);
    this._createPointProperty(2);
    this._createPointProperty(3);
  }

  controlPoints() {
    return this._controlPoints;
  }

  static createProperties(options) {
    const properties = new DefaultProperty("linetoolbeziercubic", options);
    this._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(/* webpackChunkName: "viewModel" */ 7201),
      import(/* webpackChunkName: "viewModel" */ 3753),
      import(/* webpackChunkName: "viewModel" */ 5871),
      import(/* webpackChunkName: "viewModel" */ 8167),
      import(/* webpackChunkName: "viewModel" */ 8537)
    ]).then(({ GeneralBezierDefinitionsViewModel }) => {
      return GeneralBezierDefinitionsViewModel;
    });
  }

  _calculateControlPoints() {
    const p1 = ensureNotNull(this.pointToScreenPoint(this.points()[0]));
    const p2 = ensureNotNull(this.pointToScreenPoint(this.points()[1]));
    const diff = p2.subtract(p1).scaled(0.5).transposed().scaled(0.3);
    const r = p1.add(p2).scaled(0.33);
    const n = p1.add(p2).scaled(0.67);
    const cp1 = r.add(diff);
    const cp2 = n.subtract(diff);
    return [ensureNotNull(this.screenPointToPoint(cp1)), ensureNotNull(this.screenPointToPoint(cp2))];
  }
}

export { LineToolBezierCubic };