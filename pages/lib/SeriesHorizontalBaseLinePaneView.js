
import { SeriesHorizontalLinePaneView } from 'path/to/SeriesHorizontalLinePaneView';

class SeriesHorizontalBaseLinePaneView extends SeriesHorizontalLinePaneView {
  constructor(series) {
    super(series);
  }

  _updateImpl() {
    this._lineRendererData.visible = false;
    const priceScaleMode = this._series.priceScale().mode();

    if (!priceScaleMode.percentage && !priceScaleMode.indexedTo100) {
      return;
    }

    const firstValue = this._series.firstValue();

    if (firstValue !== null) {
      this._lineRendererData.visible = true;
      this._lineRendererData.y = this._series.priceScale().priceToCoordinate(firstValue, firstValue);
      this._lineRendererData.color = this._series.properties().childs().baseLineColor.value();
    }
  }
}
