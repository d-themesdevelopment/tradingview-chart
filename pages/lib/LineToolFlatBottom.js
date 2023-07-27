
import { LineDataSource } from '13087';
import { DefaultProperty } from '46100';

class LineToolFlatBottom extends LineDataSource {
  constructor(model, options, priceScale, timeScale) {
    super(model, options || LineToolFlatBottom.createProperties(), priceScale, timeScale);
    this.version = LineToolFlatBottom.version;
    import(85377 /* webpackChunkName: "flat-bottom-pane-view" */).then(({ FlatBottomPaneView }) => {
      this._setPaneViews([new FlatBottomPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Flat Bottom';
  }

  hasEditableCoordinates() {
    return false;
  }

  addPoint(index, priceScale) {
    if (priceScale && priceScale.shift() && this.points().length === 2) {
      this._snapPoint45Degree(index, this.points()[this.points().length - 2]);
    }
    return super.addPoint(index);
  }

  setLastPoint(index, priceScale) {
    if (priceScale && priceScale.shift() && this.points().length === 2) {
      this._snapPoint45Degree(index, this.points()[this.points().length - 2]);
    }
    return super.setLastPoint(index);
  }

  setPoint(index, point, priceScale) {
    if (priceScale && priceScale.shift() && index === 1) {
      this._snapPoint45Degree(point, this.points()[0]);
    }
    if (index === 2) {
      this._points[1].index = point.index;
    } else if (index === 3) {
      this._points[0].index = point.index;
      this._points[2].price = point.price;
      this.normalizePoints();
    } else {
      super.setPoint(index, point);
    }
  }

  getPoint(index) {
    if (index < 3) {
      return super.getPoint(index);
    } else if (index === 3) {
      return {
        index: this._points[0].index,
        price: this._points[2].price,
      };
    } else {
      return undefined;
    }
  }

  canHasAlert() {
    return true;
  }

  _getAlertPlots() {
    const point1 = this._points[0];
    const point2 = this._points[1];
    const points = point1.index <= point2.index ? [point1, point2] : [point2, point1];
    const point3 = this._points[2];
    point3.time = point2.time;
    point3.index = point2.index;
    const plot1 = points[0].price > points[1].price ? points : [point3, points[0]];
    const plot2 = points[0].price > points[1].price || point3.price > points[1].price ? [point3, points[1]] : points;
    const extendLeft = this.properties().extendLeft.value();
    const extendRight = this.properties().extendRight.value();
    const plots = [
      this._linePointsToAlertPlot(plot1, 'Upper', extendLeft, extendRight),
      this._linePointsToAlertPlot(plot2, 'Lower', extendLeft, extendRight),
    ];
    return plots;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const moduleIds = [7201, 3753, 5871, 8167, 8537];
    const [viewModelClass] = await Promise.all(moduleIds.map((moduleId) => import(/* webpackChunkName: "general-trend-figures-definitions-view-model" */ moduleId)));
    return viewModelClass.GeneralTrendFiguresDefinitionsViewModel;
  }

  static createProperties(options) {
    const properties = new DefaultProperty('linetoolflatbottom', options);
    this._configureProperties(properties);
    return properties;
  }
}

LineToolFlatBottom.version = 1;

export { LineToolFlatBottom };
