import { Point, distanceToLine } from "some-import-path"; // ! not correct
import { LineDataSource } from "./13087";
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";

class LineToolRotatedRectangle extends LineDataSource {
  constructor(name, properties, model, options) {
    super(
      name,
      properties || LineToolRotatedRectangle.createProperties(),
      model,
      options
    );
    import(55832 /* path-to-RotatedRectanglePaneView */).then(
      ({ RotatedRectanglePaneView }) => {
        this._setPaneViews([new RotatedRectanglePaneView(this, this._model)]);
      }
    );
  }

  startChanging(pointIndex, logicalPoint) {
    if (
      (super.startChanging(pointIndex, logicalPoint),
      pointIndex === 0 || pointIndex === 1)
    ) {
      const paneView = this._getPaneViews()[0];
      const p1 = paneView._points[0];
      const p2 = paneView._points[1];
      const p3 = paneView._points[2];
      this._distance = distanceToLine(p1, p2, p3).distance;
    }
  }

  setPoint(pointIndex, price, logicalPoint) {
    if (
      (super.setPoint(pointIndex, price, logicalPoint),
      pointIndex === 0 || pointIndex === 1)
    ) {
      const paneView = this._getPaneViews()[0];
      paneView.update();
      const p1 = paneView._points[0];
      const p2 = paneView._points[1].subtract(p1);
      const offset = new Point(p2.y, -p2.x).normalized().scaled(this._distance);
      const p3 = p1.add(offset);
      this._points[2] = this.screenPointToPoint(p3);
    }
  }

  endChanging(pointIndex, logicalPoint) {
    delete this._distance;
    super.endChanging(pointIndex, logicalPoint);
  }

  pointsCount() {
    return 3;
  }

  name() {
    return "Rotated Rectangle";
  }

  hasEditableCoordinates() {
    return false;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const { GeneralFiguresDefinitionsViewModel } = await Promise.all([
      import(7201 /* path-to-module-1 */),
      import(3753 /* path-to-module-2 */),
      import(5871 /* path-to-module-3 */),
      import(8167 /* path-to-module-4 */),
      import(8537 /* path-to-module-5 */),
    ]).then((module) => module[0]);
    return GeneralFiguresDefinitionsViewModel;
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  static createProperties(name) {
    const properties = new DefaultProperty("linetoolrotatedrectangle", name);
    this._configureProperties(properties);
    return properties;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.color])
    );
  }
}

export { LineToolRotatedRectangle };
