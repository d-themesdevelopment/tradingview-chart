


import { WatchedValue } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { n as createPrivateStore } from 'some-other-library'; // Replace 'some-other-library' with the actual library you're using

import { ensureNotNull } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { LineDataSource } from 'some-other-library'; // Replace 'some-other-library' with the actual library you're using

class LineToolBrushBase extends LineDataSource {
  constructor() {
    super(...arguments);
    this._finished = false;
  }

  pointsCount() {
    return -1;
  }

  finished() {
    return this._finished;
  }

  finish() {
    this._finished = true;
    this._lastPoint = null;
    this.normalizePoints();
    this.createServerPoints();
  }

  hasEditableCoordinates() {
    return false;
  }

  addPoint(e, t, i) {
    if (this._finished) {
      return true;
    }
    
    if (this._points.length > 0) {
      const lastPoint = this._points[this._points.length - 1];
      const lastPointScreenPoint = ensureNotNull(this.pointToScreenPoint(lastPoint));
      const currentPointScreenPoint = ensureNotNull(this.pointToScreenPoint(e));
      
      if (currentPointScreenPoint.subtract(lastPointScreenPoint).length() < 2) {
        return this._finished;
      }
    }

    super.addPoint(e);
    this._finished = true;
  }

  restorePoints(e, t, i) {
    super.restorePoints(e, t, i);
    this._finished = true;
  }
}

export default LineToolBrushBase;
