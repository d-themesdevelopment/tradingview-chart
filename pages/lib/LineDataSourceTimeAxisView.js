

import { ensureNotNull } from '<path_to_ensureNotNull_module>';
import { TimeAxisView } from '<path_to_TimeAxisView_module>';

export class LineDataSourceTimeAxisView extends TimeAxisView {
  constructor(source, pointIndex) {
    super(source.model());
    this._active = false;
    this._source = source;
    this._pointIndex = pointIndex;
    this._properties = source.model().properties().childs().scalesProperties;
  }

  setActive(active) {
    this._active = active;
  }

  _getBgColor() {
    return this._active
      ? this._properties.childs().axisLineToolLabelBackgroundColorActive.value()
      : this._properties.childs().axisLineToolLabelBackgroundColorCommon.value();
  }

  _getIndex() {
    if (!this._model.selection().isSelected(this._source)) return null;
    const timeAxisPoints = this._source.timeAxisPoints();
    return timeAxisPoints.length <= this._pointIndex ? null : timeAxisPoints[this._pointIndex].index;
  }

  _isVisible() {
    return true;
  }
}
