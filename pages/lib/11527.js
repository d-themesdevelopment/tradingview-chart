"use strict";

import { PriceAxisView } from "./12442";
import { ensureDefined } from "./assertions";
import { drawHorizontalLine } from "./68441";
import { LINESTYLE_DOTTED } from "./79849";
import { setLineStyle } from "./68441";

class PriceLineAxisView {
  constructor(data, commonData) {
    this.setData(data, commonData);
  }

  setData(data, commonData) {
    this._data = data;
    this._commonData = commonData;
  }

  draw(ctx, pixelRatio, width, height, left, top, bottom) {
    if (!this._data.visible) return;

    const coordinate = ensureDefined(
      this._commonData.fixedCoordinate,
      this._commonData.coordinate
    );
    ctx.lineWidth = Math.max(
      1,
      Math.floor(ensureDefined(this._data.linewidth) * pixelRatio)
    );
    ctx.lineCap = "butt";
    setLineStyle(ctx, ensureDefined(this._data.linestyle, LINESTYLE_DOTTED));
    ctx.strokeStyle = this._commonData.textColor;
    drawHorizontalLine(
      ctx,
      Math.round(coordinate * pixelRatio),
      0,
      Math.ceil(width * pixelRatio)
    );
  }

  topBottomTotalHeight() {
    return {
      top: 0,
      bottom: 0,
      total: 0,
    };
  }
}

class SeriesPriceLineAxisView extends PriceAxisView {
  constructor(series) {
    super(PriceLineAxisView);
    this._series = series;
  }

  ignoreAlignment() {
    return true;
  }

  _updateRendererData(
    seriesRendererData,
    priceLineRendererData,
    commonRendererData
  ) {
    if (!this._isVisible()) {
      priceLineRendererData.visible = false;
      seriesRendererData.visible = false;
      return;
    }

    const value = this._value();
    if (value.noData) return;

    commonRendererData.background = "";
    commonRendererData.textColor = this._priceLineColor(value.color);
    commonRendererData.coordinate = value.coordinate;
    commonRendererData.floatCoordinate = value.floatCoordinate;
    priceLineRendererData.linewidth = this._lineWidth();
    priceLineRendererData.linestyle = this._lineStyle();
    priceLineRendererData.backgroundAreaVisible = this._backgroundAreaVisible();
    priceLineRendererData.backgroundAreaColor = this._backgroundAreaColor();
    priceLineRendererData.backgroundAreaHeight = this._backgroundAreaHeight();
    priceLineRendererData.visible = true;
  }

  _value() {
    return this._series.lastValueData(undefined, true);
  }

  _priceLineColor(color) {
    return this._series.priceLineColor(color);
  }

  _lineWidth() {
    return this._series.properties().childs().priceLineWidth.value();
  }

  _isVisible() {
    const showSeriesLastValue = this._series
      .model()
      .properties()
      .childs()
      .scalesProperties.childs()
      .showSeriesLastValue.value();
    return (
      this._series.properties().childs().showPriceLine.value() &&
      showSeriesLastValue
    );
  }
}

class StudyPriceLineAxisView extends PriceAxisView {
  constructor(study, plotname) {
    super(PriceLineAxisView);
    this._study = study;
    this._plotname = plotname;
  }

  _value() {
    return this._study.lastValueData(this._plotname, true);
  }

  _lineWidth() {
    return this._study
      .properties()
      .childs()
      .styles.childs()
      [this._plotname].childs()
      .linewidth.value();
  }

  _lineStyle() {
    return LINESTYLE_DOTTED;
  }

  _priceLineColor(color) {
    return color;
  }

  _isVisible() {
    const showStudyLastValue = this._study
      .model()
      .properties()
      .childs()
      .scalesProperties.childs()
      .showStudyLastValue.value();
    const isPlotVisible = this._study.isPlotVisibleAt(this._plotname, 1);
    return (
      this._study
        .properties()
        .childs()
        .styles.childs()
        [this._plotname].childs()
        .trackPrice.value() &&
      showStudyLastValue &&
      isPlotVisible
    );
  }
}

export { PriceLineAxisView, SeriesPriceLineAxisView, StudyPriceLineAxisView };
