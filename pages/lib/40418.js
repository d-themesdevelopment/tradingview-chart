import {
  LineDataSource,
  ensureNotNull,
  ensure,
  interactionTolerance,
} from "./assertions";
import { Point } from "./point_utils";
import {
  DefaultProperty,
  LineToolWidthsProperty,
  LineToolColorsProperty,
} from "./46100";
// import { PathPaneView } from "./path_pane_view_utils";
import { e as import_1583, bind as import_62801 } from "./module_1583";
import {
  e as import_7201,
  e as import_3753,
  e as import_5871,
  e as import_8167,
  e as import_8537,
  bind as import_74481,
} from "./module_74481";

class LineToolPath extends LineDataSource {
  constructor(model, priceScale, options, properties) {
    const normalizedOptions = options || LineToolPath.createProperties();
    super(model, normalizedOptions, priceScale, properties);
    this._finished = false;
    import_1583()
      .then(import_62801)
      .then((PathPaneViewClass) => {
        this._setPaneViews([new PathPaneViewClass(this, model)]);
      });
  }

  pointsCount() {
    return -1;
  }

  name() {
    return "Path";
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

  addPoint(point, clickEvent, hoverEvent) {
    if (this._finished) return true;

    const priceScale = ensureNotNull(this.priceScale());
    const x = this._model.timeScale().indexToCoordinate(point.index);
    const y = point.price;
    const baseValue = ensure(
      null === this.ownerSource() || typeof this.ownerSource() === "undefined"
        ? undefined
        : this.ownerSource().firstValue()
    );
    const yCoord = priceScale.priceToCoordinate(y, baseValue);

    if (this._points.length > 0) {
      const lastPoint = this._points[this._points.length - 1];
      const lastX = this._model.timeScale().indexToCoordinate(lastPoint.index);
      const lastY = lastPoint.price;
      const lastYCoord = priceScale.priceToCoordinate(lastY, baseValue);
      const distance = new Point(x, yCoord)
        .subtract(new Point(lastX, lastYCoord))
        .length();

      if (
        !(clickEvent && clickEvent.isApiEvent()) &&
        distance < interactionTolerance().minDistanceBetweenPoints
      ) {
        this._lastPoint = null;
        this.normalizePoints();
        this.createServerPoints();
        return true;
      }
    }

    return super.addPoint(point, clickEvent, hoverEvent);
  }

  static createProperties(options) {
    const lineToolPathProperty = new DefaultProperty("linetoolpath", options);
    this._configureProperties(lineToolPathProperty);
    return lineToolPathProperty;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import_7201(),
      import_3753(),
      import_5871(),
      import_8167(),
      import_8537(),
    ])
      .then(import_74481)
      .then((PathDefinitionsViewModelClass) => {
        return PathDefinitionsViewModelClass;
      });
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "linesWidths",
      new LineToolWidthsProperty([ensure(properties.child("lineWidth"))])
    );
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().lineColor])
    );
  }
}
