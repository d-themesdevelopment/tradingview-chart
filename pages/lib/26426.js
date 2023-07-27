import { assert as _assert } from "./assertions";
import { Study as _Study } from "./8708";

function isNonSeriesStudy(obj) {
  return obj instanceof NonSeriesStudy;
}

class NonSeriesStudy extends _Study {
  clearData() {
    this._customData = null;
    this._indexes = null;
  }
  restoreData(data, customData, indexes) {
    super.restoreData(data);
    this._customData = customData;
    this._indexes = indexes;
  }
  state(fullData) {
    const state = super.state(fullData);
    if (fullData) {
      state.nonSeriesData = this._customData;
      state.indexes = this._indexes;
    }
    return state;
  }
  customData() {
    return this._customData;
  }
  _setPaneViews(views) {
    this._paneViews = views;
    this.model().lightUpdate();
  }
  _onDataUpdated(fullUpdate, updateData, updateIndexes) {
    if (updateData !== null) {
      if (updateData.indexes_replace) {
        _assert("nochange" !== updateIndexes);
        this._indexes = updateIndexes;
      } else {
        this._customData = updateData.data;
        if ("nochange" !== updateIndexes) {
          this._indexes = updateIndexes;
        }
      }
    }
    super._onDataUpdated(fullUpdate, updateData, updateIndexes);
  }
}

export { NonSeriesStudy, isNonSeriesStudy };
