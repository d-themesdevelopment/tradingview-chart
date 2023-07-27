import { DataSource } from '<path_to_DataSource_module>';
import { isActingAsSymbolSource } from '<path_to_isActingAsSymbolSource_module>';
import { ensureTimePointIndex } from '<path_to_ensureTimePointIndex_module>';

class PriceDataSource extends DataSource {
  constructor(model, priceScale) {
    super(priceScale);
    this._formatterChanged = new NotificationCenter();
    this._priceStepChanged = new NotificationCenter();
    this._currencyChanged = new NotificationCenter();
    this._unitChanged = new NotificationCenter();
    this._priceRangeReadyChanged = new NotificationCenter();
    this._priceStep = null;
    this._priceRangeReady = true;
    this._model = model;
  }

  base() {
    return 0;
  }

  model() {
    return this._model;
  }

  currencyChanged() {
    return this._currencyChanged;
  }

  isCurrencySource() {
    return true;
  }

  isDisplayedInLegend() {
    return true;
  }

  unitChanged() {
    return this._unitChanged;
  }

  isUnitSource() {
    return true;
  }

  priceRange(series, range) {
    return null;
  }

  isDraggable() {
    return true;
  }

  priceLineColor(color) {
    return color;
  }

  formatterChanged() {
    return this._formatterChanged;
  }

  priceStep() {
    return this._priceStep;
  }

  priceStepChanged() {
    return this._priceStepChanged;
  }

  isIncludedInAutoScale() {
    return true;
  }

  correctScaleMargins(margins) {
    return margins;
  }

  priceRangeReady() {
    return this._priceRangeReady;
  }

  priceRangeReadyChanged() {
    return this._priceRangeReadyChanged;
  }

  disablePriceRangeReady() {
    const priceScale = this.priceScale();
    if (priceScale === null || !priceScale.isAutoScale() || priceScale.mainSource() !== this) {
      return;
    }
    this._priceRangeReady = false;
    priceScale.recalculatePriceRangeOnce();
    this._priceRangeReadyChanged.fire(false);
  }

  statusView() {
    return null;
  }

  legendView() {
    return null;
  }

  marketStatusModel() {
    return null;
  }

  dataUpdatedModeModel() {
    return null;
  }

  dataProblemModel() {
    return null;
  }

  _enablePriceRangeReady() {
    this._priceRangeReady = true;
    this._priceRangeReadyChanged.fire(true);
  }

  _onSourceCurrencyChanged() {
    if (!isActingAsSymbolSource(this)) {
      this._currencyChanged.fire();
    }
  }

  _onSourceUnitChanged() {
    if (!isActingAsSymbolSource(this)) {
      this._unitChanged.fire();
    }
  }

  _onSourcePriceRangeReadyChanged(ready) {
    if (!isActingAsSymbolSource(this) && !ready) {
      this.disablePriceRangeReady();
    }
  }
}

export { PriceDataSource, isPriceDataSource };