"use strict";

const { SeriesCandlesPaneView } = require("./57917");
const { CompositeRenderer, PaneRendererCandles } = require("./19266");
const { SelectionRenderer } = require("./80101");
const { optimalBarWidth } = require("./45197");

class SeriesHollowCandlesPaneView extends SeriesCandlesPaneView {
  renderer() {
    if (this._invalidated) {
      this._updateImpl(null);
      this._invalidated = false;
    }

    const priceScale = this._source.priceScale();

    if (!priceScale) {
      return null;
    }

    const hollowCandleStyle = this._source
      .properties()
      .childs()
      .hollowCandleStyle.childs();
    const barSpacing = this._model.timeScale().barSpacing();

    const rendererOptions = {
      bars: this._bars,
      barSpacing,
      bodyVisible: hollowCandleStyle.drawBody.value(),
      borderVisible: hollowCandleStyle.drawBorder.value(),
      borderColor: hollowCandleStyle.borderColor.value(),
      wickColor: hollowCandleStyle.wickColor.value(),
      barWidth: optimalBarWidth(barSpacing),
      wickVisible: hollowCandleStyle.drawWick.value(),
      isPriceScaleInverted: priceScale.isInverted(),
    };

    const compositeRenderer = new CompositeRenderer();
    compositeRenderer.append(new PaneRendererCandles(rendererOptions));

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      compositeRenderer.append(new SelectionRenderer(this._selectionData));
    }

    return compositeRenderer;
  }
}

export { SeriesHollowCandlesPaneView };
