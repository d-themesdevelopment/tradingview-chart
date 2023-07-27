

import { DataValue } from './59452.js';

class LineDataSourcePointIndexProperty extends DataValue {
  constructor(lineSource, pointIndex) {
    super();
    this._lineSource = lineSource;
    this._pointIndex = pointIndex;
  }

  value() {
    return this._lineSource.points()[this._pointIndex].index;
  }

  setValue(value) {
    const point = this._lineSource.points()[this._pointIndex];
    point.index = value;
    this._lineSource.startChanging(this._pointIndex, point);
    this._setPointImpl(point);
    this._lineSource.model().updateSource(this._lineSource);
    this._listeners.fire(this);
    const stateId = this._lineSource.endChanging(true, false);
    this._lineSource.syncMultichartState(stateId);
  }

  _setPointImpl(point) {
    this._lineSource.setPoint(this._pointIndex, point);
  }
}

export { LineDataSourcePointIndexProperty };