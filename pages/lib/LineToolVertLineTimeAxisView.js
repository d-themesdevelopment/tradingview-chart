

import { LineDataSourceTimeAxisView } from './LineDataSourceTimeAxisView.js';

class LineToolVertLineTimeAxisView extends LineDataSourceTimeAxisView {
  constructor(source) {
    super(source, 0);
  }

  _getBgColor() {
    return this._source.properties().linecolor.value();
  }

  _getAlwaysInViewPort() {
    return false;
  }

  _getIndex() {
    const points = this._source.points();
    return points.length === 0 ? null : points[0].index;
  }
}

export { LineToolVertLineTimeAxisView };
