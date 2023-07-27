import { ensureNotNull } from "./assertions";
import { rotationMatrix } from "./helpers";
import { Point, transformPoint } from "./helpers"; // !

import { LineDataSource } from "./13087";
import { Observable } from "mobx";

class LineToolSvgIconBase extends LineDataSource {
  constructor(source, points, properties, model) {
    super(source, points, properties, model);
    this.onIconChanged = new Observable();
    this.svgContent = null;
    this.changePointData = null;
    this.loadViews();
  }

  pointsCount() {
    return 1;
  }

  hasEditableCoordinates() {
    return false;
  }

  getAnchorLimit() {
    return 80;
  }

  getChangePointForSync() {
    return null;
  }

  startChanging(index, point) {
    const centerPoint = ensureNotNull(this.pointToScreenPoint(this.points[0]));
    const size = this.properties.childs().size.value();
    let endPoint;

    if (point) {
      endPoint = ensureNotNull(this.pointToScreenPoint(point));
    } else {
      let offset = new Point(0, Math.max(80, size) / 2);
      const rotation = rotationMatrix(this.properties.childs().angle.value());
      offset = transformPoint(rotation, offset);
      endPoint = centerPoint.add(offset);
    }

    const initialLength = centerPoint.subtract(endPoint).length();
    const initialSize = size;

    this.changePointData = {
      centerPoint,
      initialLength,
      initialSize,
    };

    super.startChanging(index, point);
  }

  setPoint(index, point, source) {
    const { centerPoint, initialLength, initialSize } = ensureNotNull(
      this.changePointData
    );
    const currentPoint = ensureNotNull(this.pointToScreenPoint(point));
    const properties = this.properties.childs();

    if (index === 0 || index === 1) {
      const direction = currentPoint.subtract(centerPoint).normalized();
      let angle = Math.acos(-direction.x);
      if (Math.asin(direction.y) > 0) {
        angle = 2 * Math.PI - angle;
      }
      if (index === 0) {
        angle += Math.PI;
      }
      properties.angle.setValue(angle);
    } else {
      const size =
        initialSize *
        (centerPoint.subtract(currentPoint).length() / initialLength);
      properties.size.setValue(size);
    }
  }

  getSourceIcon() {
    const content = this.svgContent();
    return content === null ? null : { type: "svgContent", content };
  }

  onSourceIconChanged() {
    return this.onIconChanged;
  }

  svgContent() {
    return this.svgContent;
  }

  static configureProperties(properties) {
    super.configureProperties(properties);
    properties.addExclusion("angle");
  }
}

export { LineToolSvgIconBase };
