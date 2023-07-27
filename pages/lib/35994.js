import { getHexColorByName } from "./48891"; // Replace 'color-module' with the actual module path
// import { RangeBarStyle } from "range-bar-style-module"; // Replace 'range-bar-style-module' with the actual module path
import { PlotRowSearchMode } from "./86094"; // Replace 'plot-row-search-mode-module' with the actual module path
import { STUDYPLOTDISPLAYTARGET } from "study-plot-display-target-module"; // Replace 'study-plot-display-target-module' with the actual module path // ! not correct
import { rgbaFromInteger } from "./87095"; // Replace 'rgba-from-integer-module' with the actual module path

const mintyGreenColor = getHexColorByName("color-minty-green-500");
const ripeRedColor = getHexColorByName("color-ripe-red-500");

function BarColorer() {
  this.backColorers = [];
}

function SeriesBarColorer(series) {
  BarColorer.call(this);
  this._series = series;
}

export function StudyBarColorer(study, plotIndex) {
  BarColorer.call(this);
  this._study = study;
  this._plotIndex = plotIndex;
}

BarColorer.prototype.barStyle = function (index, isOffset, style) {
  const barStyles = {};
  for (let i = this.backColorers.length - 1; i >= 0; i--) {
    this.backColorers[i].applyBarStyle(index, isOffset, barStyles, style);
  }
  this.applyBarStyle(index, isOffset, barStyles, style);
  return barStyles;
};

BarColorer.prototype.pushBackColorer = function (colorer) {
  this.backColorers.push(colorer);
};

BarColorer.prototype.applyBarStyle = function (index, isOffset, style) {
  throw new Error(
    "This function is supposed to be reimplemented in a subclass"
  );
};

SeriesBarColorer.upColor = function (series, style) {
  switch (series.style.value()) {
    case TradingView.Series.STYLE_LINE:
      return series.lineStyle.color.value();
    case TradingView.Series.STYLE_LINE_WITH_MARKERS:
      return series.lineWithMarkersStyle.color.value();
    case TradingView.Series.STYLE_STEPLINE:
      return series.steplineStyle.color.value();
    case TradingView.Series.STYLE_AREA:
      return series.areaStyle.linecolor.value();
    case TradingView.Series.STYLE_HLC_AREA:
      return series.hlcAreaStyle.closeLineColor.value();
    case TradingView.Series.STYLE_BARS:
      return series.barStyle.upColor.value();
    case TradingView.Series.STYLE_CANDLES:
      return series.candleStyle.upColor.value();
    case TradingView.Series.STYLE_HOLLOW_CANDLES:
      return series.hollowCandleStyle.upColor.value();
    case TradingView.Series.STYLE_HEIKEN_ASHI:
      return series.haStyle.upColor.value();
    case TradingView.Series.STYLE_BASELINE:
      return series.baselineStyle.topLineColor.value();
    case TradingView.Series.STYLE_HILO:
      return series.hiloStyle.color.value();
    case TradingView.Series.STYLE_COLUMNS:
      return series.columnStyle.upColor.value();
  }
  throw new Error("Unknown series style");
};

SeriesBarColorer.downColor = function (series, style) {
  switch (series.style.value()) {
    case TradingView.Series.STYLE_LINE:
      return series.lineStyle.color.value();
    case TradingView.Series.STYLE_LINE_WITH_MARKERS:
      return series.lineWithMarkersStyle.color.value();
    case TradingView.Series.STYLE_STEPLINE:
      return series.steplineStyle.color.value();
    case TradingView.Series.STYLE_AREA:
      return series.areaStyle.linecolor.value();
    case TradingView.Series.STYLE_HLC_AREA:
      return series.hlcAreaStyle.closeLineColor.value();
    case TradingView.Series.STYLE_BARS:
      return series.barStyle.downColor.value();
    case TradingView.Series.STYLE_CANDLES:
      return series.candleStyle.downColor.value();
    case TradingView.Series.STYLE_HOLLOW_CANDLES:
      return series.hollowCandleStyle.downColor.value();
    case TradingView.Series.STYLE_HEIKEN_ASHI:
      return series.haStyle.downColor.value();
    case TradingView.Series.STYLE_BASELINE:
      return series.baselineStyle.bottomLineColor.value();
    case TradingView.Series.STYLE_HILO:
      return series.hiloStyle.color.value();
    case TradingView.Series.STYLE_COLUMNS:
      return series.columnStyle.downColor.value();
  }
  throw new Error("Unknown series style");
};

SeriesBarColorer.prototype._applyLineStyle = function (
  index,
  isOffset,
  style,
  series
) {
  style.barColor = SeriesBarColorer.upColor(series);
};

SeriesBarColorer.prototype._applyAreaStyle = function (
  index,
  isOffset,
  style,
  series
) {
  style.barColor = SeriesBarColorer.upColor(series);
};

SeriesBarColorer.prototype._applyHLCAreaStyle = function (
  index,
  isOffset,
  style,
  series
) {
  let isNewBarUp;
  const currentBar = this.findBar(index, false, series);
  const prevBar = this.findPrevBar(index, false, series);
  isNewBarUp =
    this._series.data().first().index !== index
      ? prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
      : currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  style.barColor = SeriesBarColorer.upColor(series, isOffset);
  style.barBorderColor = isNewBarUp ? mintyGreenColor : ripeRedColor;
};

SeriesBarColorer.prototype._applyBarStyle = function (
  index,
  isOffset,
  style,
  series
) {
  const upColor = SeriesBarColorer.upColor(series, isOffset);
  const downColor = SeriesBarColorer.downColor(series, isOffset);
  const currentBar = this.findBar(index, false, series);
  if (series.barStyle.barColorsOnPrevClose.value()) {
    const prevBar = this.findPrevBar(index, false, series);
    style.barColor =
      prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
    style.barBorderColor =
      prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
  } else {
    style.barColor =
      currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
    style.barBorderColor =
      currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
  }
};

SeriesBarColorer.prototype._applyCandleStyle = function (
  index,
  isOffset,
  style,
  series
) {
  let isNewBarUp;
  const upColor = SeriesBarColorer.upColor(series, isOffset);
  const downColor = SeriesBarColorer.downColor(series, isOffset);
  const borderUpColor = series.candleStyle.borderUpColor
    ? series.candleStyle.borderUpColor.value()
    : series.candleStyle.borderColor.value();
  const borderDownColor = series.candleStyle.borderDownColor
    ? series.candleStyle.borderDownColor.value()
    : series.candleStyle.borderColor.value();
  const wickUpColor = series.candleStyle.wickUpColor
    ? series.candleStyle.wickUpColor.value()
    : series.candleStyle.wickColor.value();
  const wickDownColor = series.candleStyle.wickDownColor
    ? series.candleStyle.wickDownColor.value()
    : series.candleStyle.wickColor.value();
  const currentBar = this.findBar(index, false, series);
  if (series.candleStyle.barColorsOnPrevClose.value()) {
    const prevBar = this.findPrevBar(index, false, series);
    isNewBarUp =
      prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  } else {
    isNewBarUp =
      currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  }
  style.barColor = isNewBarUp ? upColor : downColor;
  style.barBorderColor = isNewBarUp ? borderUpColor : borderDownColor;
  style.barWickColor = isNewBarUp ? wickUpColor : wickDownColor;
};

SeriesBarColorer.prototype._applyHollowCandleStyle = function (
  index,
  isOffset,
  style,
  series
) {
  let isNewBarUp;
  const upColor = SeriesBarColorer.upColor(series, isOffset);
  const downColor = SeriesBarColorer.downColor(series, isOffset);
  const borderUpColor = series.hollowCandleStyle.borderUpColor
    ? series.hollowCandleStyle.borderUpColor.value()
    : series.hollowCandleStyle.borderColor.value();
  const borderDownColor = series.hollowCandleStyle.borderDownColor
    ? series.hollowCandleStyle.borderDownColor.value()
    : series.hollowCandleStyle.borderColor.value();
  const wickUpColor = series.hollowCandleStyle.wickUpColor
    ? series.hollowCandleStyle.wickUpColor.value()
    : series.hollowCandleStyle.wickColor.value();
  const wickDownColor = series.hollowCandleStyle.wickDownColor
    ? series.hollowCandleStyle.wickDownColor.value()
    : series.hollowCandleStyle.wickColor.value();
  const currentBar = this.findBar(index, false, series);
  const prevBar = this.findPrevBar(index, false, series);
  isNewBarUp =
    this._series.data().first().index !== index
      ? prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
      : currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  style.barColor = isNewBarUp ? upColor : downColor;
  style.barBorderColor = isNewBarUp ? borderUpColor : borderDownColor;
  style.barWickColor = isNewBarUp ? wickUpColor : wickDownColor;
  style.isBarHollow =
    currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
};

SeriesBarColorer.prototype._applyHAStyle = function (
  index,
  isOffset,
  style,
  series
) {
  let isNewBarUp;
  const upColor = SeriesBarColorer.upColor(series, isOffset);
  const downColor = SeriesBarColorer.downColor(series, isOffset);
  const borderUpColor = series.haStyle.borderUpColor.value();
  const borderDownColor = series.haStyle.borderDownColor.value();
  const wickUpColor = series.haStyle.wickUpColor.value();
  const wickDownColor = series.haStyle.wickDownColor.value();
  const currentBar = this.findBar(index, isOffset, series);
  if (series.haStyle.barColorsOnPrevClose.value()) {
    const prevBar = this.findPrevBar(index, isOffset, series);
    isNewBarUp =
      prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  } else {
    isNewBarUp =
      currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT];
  }
  style.barColor = isNewBarUp ? upColor : downColor;
  style.barBorderColor = isNewBarUp ? borderUpColor : borderDownColor;
  style.barWickColor = isNewBarUp ? wickUpColor : wickDownColor;
};

SeriesBarColorer.prototype._applyBaseLineStyle = function (
  index,
  isOffset,
  style,
  series
) {
  const currentBar = this.findBar(index, isOffset, series);
  const baselineStyle = series.baselineStyle;
  const priceScale = this._series.priceScale();
  const baselineLevelPercentage = baselineStyle.baseLevelPercentage.value();
  const baselineOffset = Math.round(
    priceScale.height() * (Math.abs(100 - baselineLevelPercentage) / 100)
  );
  const firstValue = this._series.firstValue();
  const baselinePrice = priceScale.coordinateToPrice(
    baselineOffset,
    firstValue
  );
  if (currentBar[TradingView.CLOSE_PLOT] > baselinePrice) {
    style.barColor = SeriesBarColorer.upColor(series, isOffset);
  } else {
    style.barColor = SeriesBarColorer.downColor(series, isOffset);
  }
};

SeriesBarColorer.prototype._applyHiLoStyle = function (
  index,
  isOffset,
  style,
  series
) {
  style.barColor = SeriesBarColorer.upColor(series, isOffset);
  style.barBorderColor = series.hiloStyle.borderColor.value();
};

SeriesBarColorer.prototype._applyColumnStyle = function (
  index,
  isOffset,
  style,
  series
) {
  const upColor = SeriesBarColorer.upColor(series);
  const downColor = SeriesBarColorer.downColor(series);
  const currentBar = this.findBar(index, false, series);
  if (series.columnStyle.barColorsOnPrevClose.value()) {
    const prevBar = this.findPrevBar(index, false, series);
    style.color =
      prevBar[TradingView.CLOSE_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
  } else {
    style.color =
      currentBar[TradingView.OPEN_PLOT] <= currentBar[TradingView.CLOSE_PLOT]
        ? upColor
        : downColor;
  }
  style.barColor = style.color;
};

SeriesBarColorer.prototype.applyBarStyle = function (index, isOffset, style) {
  if (!style) {
    style = {};
  }
  style.barColor = null;
  style.barBorderColor = null;
  style.barWickColor = null;
  style.isBarHollow = null;
  style.isBarUp = null;
  style.upColor = null;
  style.downColor = null;
  style.isTwoColorBar = null;
  style.isMergedBar = null;

  const seriesProperties = this._series.properties();
  switch (seriesProperties.style.value()) {
    case TradingView.Series.STYLE_LINE:
    case TradingView.Series.STYLE_LINE_WITH_MARKERS:
    case TradingView.Series.STYLE_STEPLINE:
      this._applyLineStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_AREA:
      this._applyAreaStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_HLC_AREA:
      this._applyHLCAreaStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_BARS:
      this._applyBarStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_CANDLES:
      this._applyCandleStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_HOLLOW_CANDLES:
      this._applyHollowCandleStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_HEIKEN_ASHI:
      this._applyHAStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_BASELINE:
      this._applyBaseLineStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_HILO:
      this._applyHiLoStyle(index, isOffset, style, seriesProperties);
      break;
    case TradingView.Series.STYLE_COLUMNS:
      this._applyColumnStyle(index, isOffset, style, seriesProperties);
      break;
  }
  return style;
};

SeriesBarColorer.prototype.getSeriesBars = function (isOffset) {
  return isOffset ? this._series.nsBars() : this._series.bars();
};

SeriesBarColorer.prototype._findBarFieldValue = function (
  index,
  field,
  isOffset
) {
  const seriesBars = this.getSeriesBars(isOffset);
  const bar = seriesBars.valueAt(index);
  if (bar !== null) {
    return bar[field];
  }
};

SeriesBarColorer.prototype.findBar = function (index, isOffset, series) {
  return series
    ? series.value
    : this.getSeriesBars(isOffset).valueAt(index) || [];
};

SeriesBarColorer.prototype.findPrevBar = function (index, isOffset, series) {
  if (series && series.previousValue) {
    return series.previousValue;
  }
  const prevBar = this._series
    .bars()
    .search(index - 1, PlotRowSearchMode.NearestLeft, TradingView.CLOSE_PLOT);
  return prevBar !== null ? prevBar.value : [];
};

StudyBarColorer.prototype.getBars = function () {
  return this._study.series().bars();
};

StudyBarColorer.prototype.firstColoredBar = function (index) {
  let minColoredBar = index;
  for (let i = 0; i < this.backColorers.length; i++) {
    minColoredBar = Math.min(
      minColoredBar,
      this.backColorers[i].firstColoredBar(index)
    );
  }
  const offset = this.getOffset(this._plotIndex);
  minColoredBar = Math.min(minColoredBar, index + offset);
  const firstBarIndex = this.getBars().firstIndex();
  return Math.max(minColoredBar, firstBarIndex);
};

StudyBarColorer.prototype.getOffset = function () {
  const plotId = this._study.metaInfo().plots[this._plotIndex].id;
  return this._study.offset(plotId);
};

StudyBarColorer.prototype.applyBarStyle = function (index, isOffset, style) {
  if (!style) {
    style = {};
  }
  if (isOffset) {
    return style;
  }
  const studyProperties = this._study.properties();
  if (!studyProperties.visible.value()) {
    return style;
  }
  const studyMetaInfo = this._study.metaInfo();
  const studyData = this._study.data();
  if (!studyData || studyData.size() === 0) {
    return style;
  }
  const plot = studyMetaInfo.plots[this._plotIndex];
  const offset = this.getOffset();
  if (this._study.getMinFirstBarIndexForPlot(plot.id) > index + offset) {
    return style;
  }
  if (
    studyProperties.styles[plot.id].display.value() ===
    STUDYPLOTDISPLAYTARGET.None
  ) {
    return style;
  }
  const value = studyData.valueAt(index - offset);
  if (value === null) {
    return style;
  }
  const plotValue = value[this._plotIndex + 1];
  if (plotValue === undefined) {
    return style;
  }
  const roundedValue = Math.round(plotValue);
  if (studyMetaInfo.isRGB) {
    style.barColor = rgbaFromInteger(roundedValue);
    style.upColor = style.barColor;
    style.downColor = style.barColor;
  } else {
    style.barColor = getHexColorByName(roundedValue);
    style.upColor = style.barColor;
    style.downColor = style.barColor;
  }
  return style;
};
