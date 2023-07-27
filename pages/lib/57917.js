import { CompositeRenderer } from 'some-module';
import { PaneRendererCandles } from 'some-other-module';
import { SelectionRenderer } from 'another-module';
import { optimalBarWidth } from 'some-utils-module';

class SeriesCandlesPaneView extends SeriesBarCandlesPaneView {
  renderer(context, invalidated) {
    if (this._invalidated) {
      this._updateImpl(null);
      this._invalidated = false;
    }

    const priceScale = this._source.priceScale();
    if (!priceScale) return null;

    const candleStyle = this._source.properties().childs().candleStyle.childs();
    const barSpacing = this._model.timeScale().barSpacing();

    const rendererParams = {
      bars: this._bars,
      barSpacing: barSpacing,
      bodyVisible: candleStyle.drawBody.value(),
      borderVisible: candleStyle.drawBorder.value(),
      borderColor: candleStyle.borderColor.value(),
      wickColor: candleStyle.wickColor.value(),
      barWidth: optimalBarWidth(barSpacing),
      wickVisible: candleStyle.drawWick.value(),
      isPriceScaleInverted: priceScale.isInverted()
    };

    const compositeRenderer = new CompositeRenderer();
    compositeRenderer.append(new PaneRendererCandles(rendererParams));

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      compositeRenderer.append(new SelectionRenderer(this._selectionData));
    }

    return compositeRenderer;
  }

  _createItem(time, index, barStyle) {
    const item = {
      time: time,
      open: NaN,
      high: NaN,
      low: NaN,
      close: NaN,
      color: barStyle.barColor,
      borderColor: barStyle.barBorderColor,
      wickColor: barStyle.barWickColor,
      hollow: barStyle.isBarHollow
    };

    return baseBarCandlesUpdater(index, item) ? item : null;
  }
}

export {
  SeriesCandlesPaneView
};