import LineDataSource from "./13087";
import { Point } from "./Point"; // ! not correct
// import { RectanglePaneView } from "./RectanglePaneView";
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";
import {
  ensureNotNull,
  // ensureNotNullArray
} from "./assertions";

class LineToolRectangle extends LineDataSource {
  constructor(model, properties, options, inputs) {
    const defaultProperties =
      properties || LineToolRectangle.createProperties();
    super(model, defaultProperties, options, inputs);

    import(31320).then(({ RectanglePaneView }) => {
      const paneViews = [new RectanglePaneView(this, model)];
      this._setPaneViews(paneViews);
    });
  }

  pointsCount() {
    return 2;
  }

  textColorsProperty() {
    return this.properties().childs().showLabel.value()
      ? super.textColorsProperty()
      : null;
  }

  name() {
    return "Rectangle";
  }

  setPoint(index, point, override) {
    if (index < 2) {
      super.setPoint(index, point, override);
    }

    if (override && override.shift()) {
      const anchorPoint = this._getAnchorPointForIndex(index);
      if (index >= 4) {
        this._correctMiddlePoints(index, point, anchorPoint);
        this.normalizePoints();
        return;
      }

      this._snapPointTo45Degree(point, anchorPoint);
    }

    switch (index) {
      case 2:
        this._points[1].price = point.price;
        this._points[0].index = point.index;
        break;
      case 3:
        this._points[0].price = point.price;
        this._points[1].index = point.index;
        break;
      case 4:
        this._points[0].index = point.index;
        break;
      case 5:
        this._points[1].index = point.index;
        break;
      case 6:
        this._points[0].price = point.price;
        break;
      case 7:
        this._points[1].price = point.price;
        break;
    }

    this.normalizePoints();
  }

  getPoint(index) {
    return index < 2
      ? super.getPoint(index)
      : this._getAnchorPointForIndex(index);
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  static createProperties(options) {
    const properties = new DefaultProperty("linetoolrectangle", options);
    this._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]).then(
      ([module1, module2, module3, module4, module5]) =>
        module5.RectangleDefinitionsViewModel
    );
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text);
  }

  _snapPointTo45Degree(point, anchorPoint) {
    const priceScale = this.m_priceScale;
    const ownerSource = this.ownerSource();
    if (!priceScale || !ownerSource) return;

    const firstValue = ownerSource.firstValue();
    if (!firstValue) return;

    const timeScale = this._model.timeScale();
    const screenPoint = ensureNotNull(this.pointToScreenPoint(point));
    const anchorScreenPoint = ensureNotNull(
      this.pointToScreenPoint(anchorPoint)
    );
    const deltaX = screenPoint.x - anchorScreenPoint.x;
    const deltaY = screenPoint.y - anchorScreenPoint.y;
    const deltaXSign = deltaX < 0 ? -1 : 1;
    const deltaYSign = deltaY < 0 ? -1 : 1;
    const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
    const snappedX = Math.round(
      timeScale.coordinateToIndex(anchorScreenPoint.x + maxDelta * deltaXSign)
    );
    const snappedDeltaX = Math.abs(
      timeScale.indexToCoordinate(snappedX) - anchorScreenPoint.x
    );
    const snappedY = priceScale.coordinateToPrice(
      anchorScreenPoint.y + snappedDeltaX * deltaYSign,
      firstValue
    );
    point.index = snappedX;
    point.price = snappedY;
  }

  _correctMiddlePoints(index, point, anchorPoint) {
    if (index < 6) {
      this._correctRightLeftMiddlePoint(index, point, anchorPoint);
    } else {
      this._correctTopBottomMiddlePoint(index, point, anchorPoint);
    }
  }

  _correctRightLeftMiddlePoint(index, point, anchorPoint) {
    const newPointScreenPoint = ensureNotNull(this.pointToScreenPoint(point));
    const anchorScreenPoint = ensureNotNull(
      this.pointToScreenPoint(anchorPoint)
    );
    const startPointScreenPoint = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const endPointScreenPoint = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );
    let deltaX = newPointScreenPoint.x - anchorScreenPoint.x;
    if (deltaX === 0) return;

    const leftToRight = startPointScreenPoint.x < endPointScreenPoint.x;
    const topToBottom = startPointScreenPoint.y < endPointScreenPoint.y;
    const deltaXSign = leftToRight ? 1 : -1;
    const deltaYSign = topToBottom ? 1 : -1;

    deltaX *= deltaXSign;
    switch (index) {
      case 4: {
        const newY = endPointScreenPoint.y - (deltaYSign * deltaX) / 2;
        const newPoint = ensureNotNull(
          this.screenPointToPoint(new Point(endPointScreenPoint.x, newY))
        );
        this._points[1].price = newPoint.price;
        const yDelta = ensureNotNull(
          this.screenPointToPoint(
            new Point(
              startPointScreenPoint.x + deltaXSign * deltaX,
              startPointScreenPoint.y + (deltaYSign * deltaX) / 2
            )
          )
        );
        this._points[0].price = yDelta.price;
        this._points[0].index = yDelta.index;
        break;
      }
      case 5: {
        const newY = startPointScreenPoint.y - (deltaYSign * deltaX) / 2;
        const newPoint = ensureNotNull(
          this.screenPointToPoint(new Point(startPointScreenPoint.x, newY))
        );
        this._points[0].price = newPoint.price;
        const yDelta = ensureNotNull(
          this.screenPointToPoint(
            new Point(
              endPointScreenPoint.x + deltaXSign * deltaX,
              endPointScreenPoint.y + (deltaYSign * deltaX) / 2
            )
          )
        );
        this._points[1].price = yDelta.price;
        this._points[1].index = yDelta.index;
        break;
      }
    }
  }

  _correctTopBottomMiddlePoint(index, point, anchorPoint) {
    const priceScale = this.m_priceScale;
    const ownerSource = this.ownerSource();
    if (!priceScale || !ownerSource) return;

    const timeScale = this._model.timeScale();
    const firstValue = ownerSource.firstValue();
    if (!firstValue) return;

    const newPointScreenPoint = ensureNotNull(this.pointToScreenPoint(point));
    const anchorScreenPoint = ensureNotNull(
      this.pointToScreenPoint(anchorPoint)
    );
    const startPointScreenPoint = ensureNotNull(
      this.pointToScreenPoint(this._points[0])
    );
    const endPointScreenPoint = ensureNotNull(
      this.pointToScreenPoint(this._points[1])
    );

    const deltaY = newPointScreenPoint.y - anchorScreenPoint.y;
    const deltaYSign = deltaY < 0 ? -1 : 1;

    const leftToRight = startPointScreenPoint.x < endPointScreenPoint.x;
    const topToBottom = startPointScreenPoint.y < endPointScreenPoint.y;
    const deltaXSign = leftToRight ? 1 : -1;
    const deltaYSignMiddle = topToBottom ? 1 : -1;

    switch (index) {
      case 6: {
        const deltaX = Math.floor(
          endPointScreenPoint.x - (deltaXSign * deltaY) / 2
        );
        const newPoint = ensureNotNull(
          this.screenPointToPoint(new Point(deltaX, endPointScreenPoint.y))
        );
        this._points[1].index =
          this._points[1].index -
          deltaXSign *
            deltaYSignMiddle *
            Math.ceil(Math.abs(this._points[1].index - newPoint.index) / 2);
        const yDelta =
          deltaYSignMiddle *
          Math.abs(
            timeScale.indexToCoordinate(this._points[1].index) -
              endPointScreenPoint.x
          );
        this._points[0].price = priceScale.coordinateToPrice(
          startPointScreenPoint.y + yDelta,
          firstValue
        );
        this._points[0].index =
          this._points[0].index +
          deltaXSign *
            deltaYSignMiddle *
            Math.ceil(Math.abs(this._points[0].index - newPoint.index) / 2);
        break;
      }
      case 7: {
        const deltaX = Math.floor(
          startPointScreenPoint.x - (deltaXSign * deltaY) / 2
        );
        const newPoint = ensureNotNull(
          this.screenPointToPoint(new Point(deltaX, startPointScreenPoint.y))
        );
        this._points[0].index =
          this._points[0].index -
          deltaXSign *
            deltaYSignMiddle *
            Math.ceil(Math.abs(this._points[0].index - newPoint.index) / 2);
        const yDelta =
          deltaYSignMiddle *
          Math.abs(
            timeScale.indexToCoordinate(this._points[0].index) -
              startPointScreenPoint.x
          );
        this._points[1].price = priceScale.coordinateToPrice(
          endPointScreenPoint.y + yDelta,
          firstValue
        );
        this._points[1].index =
          this._points[1].index +
          deltaXSign *
            deltaYSignMiddle *
            Math.ceil(Math.abs(this._points[1].index - newPoint.index) / 2);
        break;
      }
    }
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new (import(""))(""));
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
    properties.addExclusion("linesColors");
    properties.addExclusion("textsColors");
  }

  _getAnchorPointForIndex(index) {
    const points = this.points();
    const startPoint = points[0];
    const endPoint = points[1];
    let price = 0;
    let indexValue = 0;

    switch (index) {
      case 0:
        price = startPoint.price;
        indexValue = startPoint.index;
        break;
      case 1:
        price = endPoint.price;
        indexValue = endPoint.index;
        break;
      case 2:
        price = endPoint.price;
        indexValue = startPoint.index;
        break;
      case 3:
        price = startPoint.price;
        indexValue = endPoint.index;
        break;
      case 4:
        price = (endPoint.price + startPoint.price) / 2;
        indexValue = startPoint.index;
        break;
      case 5:
        price = (endPoint.price + startPoint.price) / 2;
        indexValue = endPoint.index;
        break;
      case 6:
        price = startPoint.price;
        indexValue = (endPoint.index + startPoint.index) / 2;
        break;
      case 7:
        price = endPoint.price;
        indexValue = (endPoint.index + startPoint.index) / 2;
        break;
    }

    return {
      index: indexValue,
      price: price,
    };
  }
}
