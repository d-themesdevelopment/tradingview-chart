import { ensureNotNull } from 'lib/utils';
import { LineDataSource } from 'lib/line-data-source';
import { Point } from 'lib/point';
import { firstValue } from 'lib/timescale/time-series-data';

class LineToolFibWedgeBase extends LineDataSource {
  pointsCount() {
    return 3;
  }

  hasEditableCoordinates() {
    return false;
  }

  setPoint(index, point) {
    if (super.setPoint(index, point)) {
      if (!this._recursiveGuard) {
        try {
          this._recursiveGuard = true;

          if (index === 2) {
            const startPoint = ensureNotNull(this.pointToScreenPoint(this._points[0]));
            let middlePoint = ensureNotNull(this.pointToScreenPoint(this._points[1]));
            const endPoint = ensureNotNull(this.pointToScreenPoint(this._points[2]));
            const length = endPoint.subtract(startPoint).length();
            let vector = middlePoint.subtract(startPoint);
            if (vector.length() <= 0) {
              vector = new Point(1, 0);
            }
            middlePoint = startPoint.add(vector.normalized().scaled(length));
            const screenPoint = ensureNotNull(this.screenPointToPoint(middlePoint));
            const priceProperty = this._pointsProperty.childs().points[1].childs().price;
            const barProperty = this._pointsProperty.childs().points[1].childs().bar;
            priceProperty.setValue(screenPoint.price);
            barProperty.setValue(screenPoint.index);
          } else {
            const startPoint = ensureNotNull(this.pointToScreenPoint(this._points[0]));
            const middlePoint = ensureNotNull(this.pointToScreenPoint(this._points[1]));
            let endPoint = ensureNotNull(this.pointToScreenPoint(this._points[2]));
            const length = middlePoint.subtract(startPoint).length();
            let vector = endPoint.subtract(startPoint);
            if (vector.length() <= 0) {
              vector = new Point(1, 0);
            }
            endPoint = startPoint.add(vector.normalized().scaled(length));
            const screenPoint = ensureNotNull(this.screenPointToPoint(endPoint));
            const priceProperty = this._pointsProperty.childs().points[2].childs().price;
            const barProperty = this._pointsProperty.childs().points[2].childs().bar;
            priceProperty.setValue(screenPoint.price);
            barProperty.setValue(screenPoint.index);
          }
        } finally {
          this._recursiveGuard = false;
        }
      }
    }
  }

  addPoint(point) {
    if (this._points.length === 2) {
      const startPoint = ensureNotNull(this.pointToScreenPoint(this._points[0]));
      const middlePoint = ensureNotNull(this.pointToScreenPoint(this._points[1]));
      let endPoint = ensureNotNull(this.pointToScreenPoint(point));
      const length = middlePoint.subtract(startPoint).length();
      const normalizedVector = endPoint.subtract(startPoint).normalized();
      endPoint = startPoint.add(normalizedVector.scaled(length));
      const ownerSource = ensureNotNull(this.ownerSource());
      const firstValueData = ensureNotNull(firstValue(ownerSource));
      const price = ensureNotNull(this.priceScale()).coordinateToPrice(endPoint.y, firstValueData);
      point = {
        index: Math.round(this._model.timeScale().coordinateToIndex(endPoint.x)),
        price: price,
      };
    }
    return super.addPoint(point);
  }
}
