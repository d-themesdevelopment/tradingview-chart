import { LineDataSource } from "./13087";
import { ensureNotNull } from "./assertions";
import { Point } from "./assertions"; // ! not correct
import { distanceToLine } from "yet-another-module"; // ! not correct
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";

class LineToolEllipse extends LineDataSource {
  constructor(source, model, properties, options) {
    super(
      source,
      properties || LineToolEllipse.createProperties(),
      model,
      options
    );
    this.version = 2;
    this._dist = null;
    this._fakePointAdded = false;
    import(/* webpackChunkName: "ellipse-pane-view" */ 1583).then((module) => {
      const { EllipsePaneView } = module;
      this._setPaneViews([new EllipsePaneView(this, this._model)]);
    });
  }

  startChanging(pointIndex, priceYCoord) {
    super.startChanging(pointIndex, priceYCoord);
    if (pointIndex === 0 || pointIndex === 1) {
      const p1 = ensureNotNull(this.pointToScreenPoint(this._points[0]));
      const p2 = ensureNotNull(this.pointToScreenPoint(this._points[1]));
      const p3 = ensureNotNull(this.pointToScreenPoint(this._points[2]));
      this._dist = distanceToLine(p1, p2, p3).distance || 0;
    }
  }

  addPoint(time, price, index) {
    const added = super.addPoint(time, price, index);
    if (added) {
      this._fakePointAdded = false;
    }
    return added;
  }

  setPoint(pointIndex, price, timePoint, options) {
    const newPoint = { ...price };
    let p1 = ensureNotNull(this.pointToScreenPoint(this._points[0]));
    let p2 = ensureNotNull(this.pointToScreenPoint(this._points[1]));
    let p3 = ensureNotNull(this.pointToScreenPoint(this._points[2]));

    switch (pointIndex) {
      case 0: {
        if (timePoint && timePoint.shift()) {
          this._snapPoint45Degree(newPoint, this._points[1]);
          this._points[0] = newPoint;
          this._points[2] = this._preparePointInternal(
            this._points[2],
            timePoint,
            true
          );
          if (this._points[0].index === this._points[1].index) {
            this._fixVerticalDiameterPoints(
              this._points[0],
              this._points[1],
              this._points[2]
            );
          }
          break;
        }
        p1 = ensureNotNull(this.pointToScreenPoint(newPoint));
        const p12 = p2.subtract(p1);
        const center = p1.add(p2).scaled(0.5);
        const normal = new Point(-p12.y, p12.x).normalized();
        p3 = center.add(normal.scaled(ensureNotNull(this._dist)));
        this._points[0] = newPoint;
        this._points[2] = ensureNotNull(this.screenPointToPoint(p3));
        break;
      }
      case 1: {
        if (timePoint && timePoint.shift()) {
          this._snapPoint45Degree(newPoint, this._points[0]);
          this._points[1] = newPoint;
          this._points[2] = this._preparePointInternal(
            this._points[2],
            timePoint,
            true
          );
          if (this._points[0].index === this._points[1].index) {
            this._fixVerticalDiameterPoints(
              this._points[1],
              this._points[0],
              this._points[2]
            );
          }
          break;
        }
        p2 = ensureNotNull(this.pointToScreenPoint(newPoint));
        const p21 = p2.subtract(p1);
        const center = p1.add(p2).scaled(0.5);
        const normal = new Point(-p21.y, p21.x).normalized();
        p3 = center.add(normal.scaled(ensureNotNull(this._dist)));
        this._points[1] = newPoint;
        this._points[2] = ensureNotNull(this.screenPointToPoint(p3));
        break;
      }
      case 2: {
        const screenPoint = ensureNotNull(this.pointToScreenPoint(newPoint));
        const distance = distanceToLine(p1, p2, screenPoint).distance;
        const p12 = p2.subtract(p1);
        const center = p1.add(p2).scaled(0.5);
        const normal = new Point(-p12.y, p12.x).normalized();
        p3 = center.add(normal.scaled(distance));
        this._points[2] = ensureNotNull(this.screenPointToPoint(p3));
        break;
      }
      case 3: {
        const screenPoint = ensureNotNull(this.pointToScreenPoint(newPoint));
        const distance = distanceToLine(p1, p2, screenPoint).distance;
        const p12 = p2.subtract(p1);
        const center = p1.add(p2).scaled(0.5);
        const normal = new Point(-p12.y, p12.x).normalized();
        p3 = center.add(normal.scaled(distance));
        this._points[2] = ensureNotNull(this.screenPointToPoint(p3));
        break;
      }
    }

    this.normalizePoints();
  }

  pointsCount() {
    return 3;
  }

  name() {
    return "Ellipse";
  }

  hasEditableCoordinates() {
    return false;
  }

  migrateVersion(from, to, prop) {
    if (from === 1 && this._points.length === 2) {
      const point1Price = this._points[0].price;
      const avgPrice = 0.5 * (this._points[0].price + this._points[1].price);
      this._points[0] = {
        price: avgPrice,
        index: this._points[0].index,
      };
      this._points[1] = {
        price: avgPrice,
        index: this._points[1].index,
      };
      this._points.push({
        price: point1Price,
        index: this._points[0].index,
      });
    }

    if (from === 1 && this._timePoint.length === 2) {
      const point1Price = this._timePoint[0].price;
      const avgPrice =
        0.5 * (this._timePoint[0].price + this._timePoint[1].price);
      this._timePoint[0].price = avgPrice;
      this._timePoint[1].price = avgPrice;
      const newPoint = {
        price: point1Price,
        offset: this._timePoint[0].offset,
        time_t: this._timePoint[0].time_t,
      };
      this._timePoint.push(newPoint);
    }
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  static createProperties(prop) {
    const properties = new DefaultProperty("linetoolellipse", prop);
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const module = await Promise.all([
      import(/* webpackChunkName: "module1" */ 7201),

      import(/* webpackChunkName: "module2" */ 3753),
      import(/* webpackChunkName: "module3" */ 5871),
      import(/* webpackChunkName: "module4" */ 8167),
      import(/* webpackChunkName: "module5" */ 8537),
    ]);
    const viewModelModule = module[0];
    return viewModelModule.EllipseCircleDefinitionsViewModel;
  }

  _preparePoint(point, timePoint) {
    const preparedPoint = this._preparePointInternal(point, timePoint, false);
    if (
      timePoint &&
      timePoint.shift() &&
      this._points[0].index === this._points[1].index
    ) {
      this._fixVerticalDiameterPoints(
        this._points[1],
        this._points[0],
        preparedPoint
      );
    }
    return preparedPoint;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new LineToolTextProperty(""));
    }
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty(
        [properties.childs().textColor],
        properties.childs().showLabel
      )
    );
    properties.addExclusion("text");
  }

  _preparePointInternal(point, timePoint, isShift) {
    let newPoint = { ...point };
    if (timePoint && timePoint.shift()) {
      const pointsCount = this.points().length;
      if (!this._fakePointAdded && pointsCount === 3 && !isShift) {
        return newPoint;
      }
      if (this._fakePointAdded || pointsCount === 2 || isShift) {
        this._snapPoint45Degree(point, this._points[0]);
        if (this._fakePointAdded) {
          this._points[1] = point;
        } else if (!isShift) {
          this._fakePointAdded = true;
          super._addPointIntenal(point);
        }
        const p1 = ensureNotNull(this.pointToScreenPoint(this._points[0]));
        const p2 = ensureNotNull(this.pointToScreenPoint(this._points[1]));
        const a = p2.x - p1.x;
        const b = p2.y - p1.y;
        const c = Math.sqrt(a * a + b * b) / 2;
        const p12 = p2.subtract(p1);
        const center = p1.add(p2).scaled(0.5);
        const normal = new Point(-p12.y, p12.x).normalized();
        const p3 = center.add(normal.scaled(ensureNotNull(this._dist)));
        newPoint = ensureNotNull(this.screenPointToPoint(p3));
        if (isNaN(newPoint.price) || isNaN(newPoint.index)) {
          newPoint = ensureNotNull(this.screenPointToPoint(center));
        }
      }
    } else if (this._fakePointAdded) {
      this._points.splice(1, 1);
      this._fakePointAdded = false;
    }
    return newPoint;
  }

  _fixVerticalDiameterPoints(point1, point2, point3) {
    const p1 = ensureNotNull(this.pointToScreenPoint(point1));
    const p2 = ensureNotNull(this.pointToScreenPoint(point2));
    const timeScale = this._model.timeScale();
    const y1 = timeScale.indexToCoordinate(point1.index);
    const y2 = timeScale.indexToCoordinate(point3.index);
    let h = 2 * Math.abs(y1 - y2);
    h *= point2.price > point1.price ? 1 : -1;
    point1.price = ensureNotNull(
      this.screenPointToPoint(new Point(p1.x, p2.y + h))
    ).price;
  }
}

export { LineToolEllipse };
