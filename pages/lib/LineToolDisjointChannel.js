
import { LineDataSource } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { DefaultProperty } from 'some-library'; // Replace 'some-library' with the actual library you're using

class LineToolDisjointChannel extends LineDataSource {
  constructor(name, properties, model, options) {
    super(name, properties || LineToolDisjointChannel.createProperties(), model, options);
    this.version = LineToolDisjointChannel.version;

    import(/* webpackChunkName: "DisjointChannelPaneView" */ './DisjointChannelPaneView').then(({ DisjointChannelPaneView }) => {
      this._setPaneViews([new DisjointChannelPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Disjoint Channel';
  }

  hasEditableCoordinates() {
    return false;
  }

  addPoint(point, modifiers) {
    if (modifiers && modifiers.shift() && this.points().length === 2) {
      this._snapPoint45Degree(point, this.points()[this.points().length - 2]);
    }
    return super.addPoint(point);
  }

  setLastPoint(point, modifiers) {
    if (modifiers && modifiers.shift() && this.points().length === 2) {
      this._snapPoint45Degree(point, this.points()[this.points().length - 2]);
    }
    return super.setLastPoint(point);
  }

  setPoint(index, point, modifiers) {
    const avgPrice = 0.5 * (this._points[1].price + this._points[2].price);

    if (modifiers && modifiers.shift() && index === 1) {
      this._snapPoint45Degree(point, this.points()[0]);
    }

    if (index < 3) {
      super.setPoint(index, point);
    }

    if (index !== 0 && index !== 2) {
      if (index === 1) {
        const diff = this._points[1].price - avgPrice;
        this._points[2].price = this._points[1].price - 2 * diff;
      } else if (index === 3) {
        const diff = point.price - this._points[2].price;
        this._points[0].price = this._points[1].price - diff;
        this._points[0].index = point.index;
      }

      this.normalizePoints();
    }
  }

  getPoint(index) {
    if (index < 3) {
      return super.getPoint(index);
    }

    const diff = this._points[0].price - this._points[2].price;

    return {
      index: this._points[0].index,
      price: this._points[1].price - diff,
    };
  }

  canHasAlert() {
    return true;
  }

  _getAlertPlots() {
    const point1 = this._points[0];
    const point2 = this._points[1];
    const points = [];

    if (point1.index <= point2.index) {
      points.push(point1);
      points.push(point2);
    } else {
      points.push(point2);
      points.push(point1);
    }

    const point3 = this._points[2];
    point3.time = point2.time;
    point3.index = point2.index;

    const price = point3.price + (point2.price - point1.price);
    const time = point1.time;
    const index = point1.index;
    const point4 = {
      price,
      time,
      index,
    };

    const alertPlots = [];

    if (point3.index <= point4.index) {
      alertPlots.push(point3);
      alertPlots.push(point4);
    } else {
      alertPlots.push(point4);
      alertPlots.push(point3);
    }

    const extendLeft = this.properties().extendLeft.value();
    const extendRight = this.properties().extendRight.value();

    const upperAlertPlot = this._linePointsToAlertPlot(alertPlots, 'Upper', extendLeft, extendRight);
    const lowerAlertPlot = this._linePointsToAlertPlot(alertPlots, 'Lower', extendLeft, extendRight);

    return [upperAlertPlot, lowerAlertPlot];
  }

  async _getPropertyDefinitionsViewModelClass() {
    const modules = await Promise.all([
      import(/* webpackChunkName: "module1" */ './module1'),
      import(/* webpackChunkName: "module2" */ './module2'),
      import(/* webpackChunkName: "module3" */ './module3'),
      import(/* webpackChunkName: "module4" */ './module4'),
      import(/* webpackChunkName: "module5" */ './module5'),
    ]);
    const GeneralTrendFiguresDefinitionsViewModel = modules[0].GeneralTrendFiguresDefinitionsViewModel;

    return GeneralTrendFiguresDefinitionsViewModel;
  }

  static createProperties(instance) {
    const property = new DefaultProperty('linetooldisjointangle', instance);
    this._configureProperties(property);
    return property;
  }
}

LineToolDisjointChannel.version = 1;

export default LineToolDisjointChannel;