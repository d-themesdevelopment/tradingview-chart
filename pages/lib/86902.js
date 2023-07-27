import { ensureNotNull } from "path/to/util";
import { distanceToLine } from "path/to/math";
import { Point } from "path/to/point";
import { LineDataSource, LineToolColorsProperty } from "path/to/lineDataSource";
import { DefaultProperty } from "path/to/defaultProperty";
import { GeneralFiguresDefinitionsViewModelBase } from "path/to/generalFiguresDefinitionsViewModelBase";

class LineToolArc extends LineDataSource {
  constructor(chartApi, properties, source, priceScale) {
    const defaultProperties = properties || LineToolArc.createProperties();
    super(chartApi, defaultProperties, source, priceScale);
    this.version = 2;
    this.dist = null;
    import(1583).then(({ ArcPaneView }) => {
      const paneViews = [new ArcPaneView(this, chartApi)];
      this.setPaneViews(paneViews);
    });
  }

  startChanging(pointIndex, priceIndex) {
    if (super.startChanging(pointIndex, priceIndex)) {
      if (pointIndex === 0 || pointIndex === 1) {
        const pointA = ensureNotNull(this.pointToScreenPoint(this.points[0]));
        const pointB = ensureNotNull(this.pointToScreenPoint(this.points[1]));
        const pointC = ensureNotNull(this.pointToScreenPoint(this.points[2]));
        this.dist = distanceToLine(pointA, pointB, pointC).distance;
        const vectorAB = pointB.subtract(pointA);
        const normalVector = new Point(-vectorAB.y, vectorAB.x);
        const centerPoint = pointA.add(pointB).scaled(0.5);
        if (pointC.subtract(centerPoint).dotProduct(normalVector) < 0) {
          this.dist = -this.dist;
        }
      }
      return true;
    }
    return false;
  }

  endChanging(pointIndex, priceIndex) {
    this.dist = null;
    return super.endChanging(pointIndex, priceIndex);
  }

  pointsCount() {
    return 3;
  }

  name() {
    return "Arc";
  }

  hasEditableCoordinates() {
    return false;
  }

  setPoint(index, point) {
    const newPoint = { ...point };
    const pointA = ensureNotNull(this.pointToScreenPoint(this.points[0]));
    const pointB = ensureNotNull(this.pointToScreenPoint(this.points[1]));
    switch (index) {
      case 0: {
        const dist = ensureNotNull(this.dist);
        const screenPoint = ensureNotNull(this.pointToScreenPoint(newPoint));
        const vectorAB = pointB.subtract(screenPoint);
        const centerPoint = screenPoint.add(pointB).scaled(0.5);
        let normalVector = new Point(-vectorAB.y, vectorAB.x);
        normalVector = normalVector.normalized();
        const calculatedPoint = centerPoint.add(normalVector.scaled(dist));
        this.points[0] = newPoint;
        this.points[2] = ensureNotNull(
          this.screenPointToPoint(calculatedPoint)
        );
        break;
      }
      case 1: {
        const dist = ensureNotNull(this.dist);
        const screenPoint = ensureNotNull(this.pointToScreenPoint(newPoint));
        const vectorAB = screenPoint.subtract(pointA);
        const centerPoint = pointA.add(screenPoint).scaled(0.5);
        const normalVector = new Point(-vectorAB.y, vectorAB.x).normalized();
        const calculatedPoint = centerPoint.add(normalVector.scaled(dist));
        this.points[1] = newPoint;
        this.points[2] = ensureNotNull(
          this.screenPointToPoint(calculatedPoint)
        );
        break;
      }
      case 2: {
        let screenPoint = ensureNotNull(this.pointToScreenPoint(newPoint));
        const distanceToLine = distanceToLine(
          pointA,
          pointB,
          screenPoint
        ).distance;
        const vectorAB = pointB.subtract(pointA);
        const centerPoint = pointA.add(pointB).scaled(0.5);
        const normalVector = new Point(-vectorAB.y, vectorAB.x).normalized();
        const pointOnArc = centerPoint.add(normalVector.scaled(distanceToLine));
        const pointOnReverseArc = centerPoint.add(
          normalVector.scaled(-distanceToLine)
        );
        const lengthAB = vectorAB.length();
        const xRatio = vectorAB.x / lengthAB;
        const yRatio = vectorAB.y / lengthAB;
        let angle = Math.acos(xRatio);
        if (yRatio < 0) {
          angle = -angle;
        }
        let transformMatrix = translationMatrix(-centerPoint.x, -centerPoint.y);
        screenPoint = transformPoint(transformMatrix, screenPoint);
        let transformedPointOnArc = transformPoint(transformMatrix, pointOnArc);
        transformMatrix = rotationMatrix(-angle);
        screenPoint = transformPoint(transformMatrix, screenPoint);
        transformedPointOnArc = transformPoint(
          transformMatrix,
          transformedPointOnArc
        );
        transformMatrix = scalingMatrix(1, lengthAB / (2 * distanceToLine));
        screenPoint = transformPoint(transformMatrix, screenPoint);
        transformedPointOnArc = transformPoint(
          transformMatrix,
          transformedPointOnArc
        );
        const finalPoint =
          screenPoint.y * transformedPointOnArc.y >= 0
            ? new Point(pointOnArc.x, pointOnArc.y)
            : new Point(pointOnReverseArc.x, pointOnReverseArc.y);
        this.points[2] = ensureNotNull(this.screenPointToPoint(finalPoint));
        break;
      }
    }
    this.normalizePoints();
  }

  migrateVersion(fromVersion, toVersion, migrationInfo) {
    if (fromVersion === 1 && toVersion === 2) {
      if (this.points.length === 2) {
        const price = (2 * this.points[0].price + 3 * this.points[1].price) / 5;
        this.points.push({ price: price, index: this.points[1].index });
      }
      if (this.timePoint.length === 2) {
        const price =
          (2 * this.timePoint[0].price + 3 * this.timePoint[1].price) / 5;
        this.timePoint.push({
          price: price,
          offset: this.timePoint[1].offset,
          time_t: this.timePoint[1].time_t,
        });
      }
    }
  }

  static createProperties(defaults) {
    const properties = new DefaultProperty("linetoolarc", defaults);
    this.configureProperties(properties);
    return properties;
  }

  async getPropertyDefinitionsViewModelClass() {
    const [
      PropertyDefinitionsViewModelBase,
      DrawingStyleProperty,
      FillBackgroundProperty,
      TransparencyProperty,
      LineStyleProperty,
    ] = await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]);
    return GeneralFiguresDefinitionsViewModelBase;
  }

  static configureProperties(properties) {
    super.configureProperties(properties);
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().color])
    );
  }
}

export { LineToolArc };
