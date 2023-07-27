
import { Delegate  } from './57898.js';
import { ensureDefined } from './assertions.js';

export class MainSeriesScaleRatioProperty {
  constructor(model) {
    this._changed = new Delegate ();
    this._model = model;
  }

  getStepChangeValue() {
    return 0.1;
  }

  getMinValue() {
    return 1e-7;
  }

  getMaxValue() {
    return 99999999;
  }

  value() {
    return this._model.mainSeriesScaleRatio();
  }

  setValue(value, silent) {
    if (value !== this.value() || silent) {
      this._model.setMainSeriesScaleRatio(value);
      this._onChanged();
    }
  }

  state() {
    return null;
  }

  clone() {
    return new MainSeriesScaleRatioProperty(this._model);
  }

  listeners() {
    return this._changed;
  }

  subscribe(handler, thisArg) {
    this._changed.subscribe(handler, thisArg);
  }

  unsubscribe(handler, thisArg) {
    this._changed.unsubscribe(handler, thisArg);
  }

  unsubscribeAll(thisArg) {
    this._changed.unsubscribeAll(thisArg);
  }

  storeStateIfUndefined() {
    return true;
  }

  _onChanged() {
    this._changed.fire(this);
  }
}