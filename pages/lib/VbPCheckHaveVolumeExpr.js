

import { Std } from './someModule';

class VbPCheckHaveVolumeExpr {
  constructor(seriesGetter) {
    this._haveAnyVolume = false;
    this._isDisabled = false;
    this._seriesGetter = seriesGetter;
  }

  update(symbol, isDataVendorProvided) {
    if (this._haveAnyVolume || this._isDisabled) {
      return;
    }
    const volume = this._seriesGetter.volume().get(symbol);
    if (volume !== 0 && Number.isFinite(volume)) {
      this._haveAnyVolume = true;
    }
    if (isDataVendorProvided) {
      if (!this._haveAnyVolume) {
        Std.error("The data vendor doesn't provide volume data for this symbol.");
      }
      this._isDisabled = true;
    }
  }
}


