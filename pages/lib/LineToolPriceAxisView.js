
import { LineToolPriceAxisView } from '<path_to_LineToolPriceAxisView_module>';
import { PriceAxisView } from '<path_to_PriceAxisView_module>';
import { resetTransparency } from '<path_to_resetTransparency_module>';
import { ensureNotNull } from '<path_to_ensureNotNull_module>';

class LineToolPriceAxisView extends PriceAxisView {
  constructor(source, data) {
    super();
    this._active = false;
    this._source = source;
    this._data = data;
    this._properties = source.model().properties().childs().scalesProperties;
  }

  setActive(active) {
    this._active = active;
  }

  _updateRendererData(rendererData, priceScale, options) {
    rendererData.visible = false;

    const model = this._source.model();
    if (!model.timeScale() || model.timeScale().isEmpty()) {
      return;
    }

    const priceAxis = this._source.priceScale();
    if (priceAxis === null || priceAxis.isEmpty()) {
      return;
    }

    if (!model.selection().isSelected(this._source) && !this._source.isForcedDrawPriceAxisLabel()) {
      return;
    }

    if (model.timeScale().visibleBarsStrictRange() === null) {
      return;
    }

    const priceAxisPoints = this._source.priceAxisPoints();
    const pointIndex = this._data.pointIndex;
    if (priceAxisPoints.length <= pointIndex) {
      return;
    }

    const point = priceAxisPoints[pointIndex];
    if (!isFinite(point.price)) {
      return;
    }

    const ownerSource = this._source.ownerSource();
    const firstValue = ownerSource !== null ? ownerSource.firstValue() : null;
    if (firstValue === null) {
      return;
    }

    let bgColor = this._data.backgroundPropertyGetter ? this._data.backgroundPropertyGetter() : null;
    if (bgColor === null) {
      bgColor = this._getBgColor();
    }

    rendererData.background = resetTransparency(bgColor);
    rendererData.borderColor = "#2E84A6";
    rendererData.textColor = this.generateTextColor(rendererData.background);
    rendererData.coordinate = priceScale.priceToCoordinate(point.price, firstValue);
    rendererData.text = this._formatPrice(point.price, firstValue);
    rendererData.visible = true;
  }

  _getBgColor() {
    return this._active
      ? this._properties.childs().axisLineToolLabelBackgroundColorActive.value()
      : this._properties.childs().axisLineToolLabelBackgroundColorCommon.value();
  }

  _formatPrice(price, firstValue) {
    return ensureNotNull(this._source.priceScale()).formatPrice(price, firstValue);
  }
}

export { LineToolPriceAxisView };