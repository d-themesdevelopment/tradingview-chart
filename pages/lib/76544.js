import { deepExtend } from "./30888";
import { getLogger } from "another-library"; // ! not correct
import { TIMEFRAMETYPE } from "yet-another-library"; // ! not correct
import { isSingleValueBasedStyle } from "./42960";
import { SeriesBase } from "some-other-library"; // ! not correct
import { isInteger } from "./1722";

class CustomSeries extends SeriesBase {
  constructor(chartApi, properties, seriesSource, model) {
    properties.removeProperty("currencyId");
    super(chartApi, properties, seriesSource, model);
    this._chartApi = chartApi;
    this.createPaneView();
    this._properties.addExclusion &&
      (this._properties.addExclusion("visible"),
      this._properties.addExclusion("currencyId"));
    this._futureBarsPaneView = null;

    this.properties()
      .minTick.listeners()
      .subscribe(this, CustomSeries.prototype._recreateFormatter);
    this.properties()
      .minTick.listeners()
      .subscribe(null, () => {
        this._model.fullUpdate();
      });

    this._priceLineView = null;
    this._baseHorizontalLineView = new HorizontalLinePaneView(this);
    this.bindStyleChange();
    this.bindJapChartsInputs();
    this._createIsDWMProperty();
    this.properties()
      .showCountdown.listeners()
      .subscribe(this, CustomSeries.prototype._onChangeShowCountdown);
    this._onChangeShowCountdown(this.properties().showCountdown);
    this._recreatePriceFormattingDependencies();
    this.properties()
      .lineStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this.properties()
      .lineWithMarkersStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this.properties()
      .steplineStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this.properties()
      .areaStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this.properties()
      .baselineStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this.properties()
      .columnStyle.priceSource.listeners()
      .subscribe(this, this._updateBarFunction);
    this._updateBarFunction();
  }

  isLoading() {
    return this._loading;
  }

  styleStudyInfo(index) {
    return this.styleStudyInfos()[index];
  }

  serverTimeOffset() {
    return this._chartApi.serverTimeOffset();
  }

  _onChangeShowCountdown(showCountdown) {
    if (showCountdown.value()) {
      this._countdownUpdateTimer = this._model.setInterval(() => {
        this._priceAxisView.updateCountdown();
      }, 500);
    } else {
      this._model.clearInterval(this._countdownUpdateTimer);
      delete this._countdownUpdateTimer;
    }
  }

  _createIsDWMProperty() {
    this._isDWMProperty = new CustomProperty(this.isDWM());
    this._onRestarted.subscribe(this, () => {
      this._isDWMProperty.setValue(this.isDWM());
    });
  }

  isDWMProperty() {
    return this._isDWMProperty;
  }

  isPulse() {
    return this._symbolInfo && this._symbolInfo.resolutions.length > 0;
  }

  seriesSource() {
    return this._seriesSource;
  }

  _onSeriesTimeFrame(e, t, i, s, r) {
    const n = isSingleValueBasedStyle(this.style()) ? e + 0.5 : e;
    let o = t;
    if (r === undefined) {
      if (i !== null && i.type !== TIMEFRAMETYPE.PeriodBack) {
        o += this._model.studyAwareDefaultRightOffset();
      }
    } else if (r.applyDefaultRightMargin) {
      o += this._model.studyAwareDefaultRightOffset();
    } else if (r.percentRightMargin) {
      const a = t - n + 1;
      const l = Math.max(0, Math.min(0.99, r.percentRightMargin / 100));
      o += (l * a) / (1 - l);
    }
    this._model.setTimeViewport(n, o);
  }

  hl2(e) {
    return (this.high(e) + this.low(e)) / 2;
  }

  hlc3(e) {
    return (this.high(e) + this.low(e) + this.close(e)) / 3;
  }

  ohlc4(e) {
    return (this.open(e) + this.high(e) + this.low(e) + this.close(e)) / 4;
  }

  nearestData(e, t) {
    if (isInteger(e)) {
      const i = this.data().search(e, t);
      return i !== null ? i : undefined;
    }
    getLogger().logDebug("Series.nearestData: incorrect logicalPoint");
  }

  nearestIndex(e, t) {
    const i = this.nearestData(e, t);
    return i ? i.index : undefined;
  }

  purgeSymbolInfo() {
    this._symbolInfo = null;
  }

  bindStyleChange() {
    Object.keys(CustomSeries.STYLE_SHORT_NAMES)
      .map((key) => {
        return CustomSeries.STYLE_SHORT_NAMES[key] + "Style";
      })
      .forEach((style) => {
        this._properties[style]
          .listeners()
          .subscribe(this, CustomSeries.prototype.invalidateBarStylesCache);
      });
  }

  bindJapChartsInputs() {
    this._properties.renkoStyle.inputs.boxSize
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.renkoStyle.inputs.style
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.renkoStyle.inputs.atrLength
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.renkoStyle.inputs.wicks
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.renkoStyle.inputs.sources
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pbStyle.inputs.lb
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.kagiStyle.inputs.reversalAmount
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.kagiStyle.inputs.style
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.kagiStyle.inputs.atrLength
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.boxSize
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.reversalAmount
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.sources
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.style
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.atrLength
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.pnfStyle.inputs.oneStepBackBuilding
      .listeners()
      .subscribe(this, this.onInputChanged);
    this._properties.rangeStyle.inputs.phantomBars
      .listeners()
      .subscribe(this, this.onInputChanged);
  }

  createDividendsAdjustmentProperty() {
    throw new Error("Not implemented");
  }

  dividendsAdjustmentProperty() {
    return null;
  }

  applyPreferences(preferences) {
    const options = deepExtend({}, preferences);
    this.m_priceScale.setMode({
      autoScale: options.priceAxisProperties.autoScale,
      percentage: options.priceAxisProperties.percentage,
      log: options.priceAxisProperties.log,
      lockScale: options.priceAxisProperties.lockScale,
    });

    this.setChartStyleWithIntervalIfNeeded(options.style);
    delete options.style;
    delete options.interval;

    this._properties.mergePreferences(options);
    this._properties.saveDefaults();

    this.createPaneView();
    this.invalidateBarStylesCache();
  }

  onInputChanged() {
    this.restart();
  }

  getStyleShortName() {
    const style = this._properties.style.value();
    if (CustomSeries.STYLE_SHORT_NAMES.hasOwnProperty(style)) {
      return CustomSeries.STYLE_SHORT_NAMES[style];
    }
    throw new Error("Missed short name for style " + style);
  }

  getStyleProperties() {
    return this._properties[this.getStyleShortName() + "Style"];
  }

  getInputsProperties() {
    return this.getStyleProperties().inputs || new CustomProperty();
  }

  getInputsInfoProperties() {
    return this.getStyleProperties().inputInfo || new CustomProperty();
  }

  getSymbolName() {
    return this._symbolInfo ? this._symbolInfo.name : "";
  }

  priceScale() {
    return this.m_priceScale;
  }

  setPriceScale(priceScale) {
    if (this.m_priceScale !== priceScale) {
      this._priceScaleAboutToBeChanged.fire();
      this.m_priceScale = priceScale;
      this._properties.removeProperty("priceAxisProperties");
      this._properties.addChild("priceAxisProperties", priceScale.properties());
      this._properties.priceAxisProperties.childChanged();
      c.emit("series_event", "price_scale_changed");
      this._priceScaleChanged.fire(priceScale);
    }
  }

  getSourceIcon() {
    return {
      type: "loadSvg",
      svgId: "series." + this.properties().style.value(),
    };
  }

  isStyleSupported(style) {
    return true;
  }

  destroy() {
    this._quotesProvider.quotesUpdate().unsubscribeAll(this);
    this._quotesProvider.destroy();
    this.clearGotoDateResult();
    this._legendView.destroy();
    this._marketStatusModel.destroy();
    if (this._dataUpdatedModeModel !== null) {
      this._dataUpdatedModeModel.destroy();
    }
    this._dataProblemModel.destroy();
    if (this._paneView && this._paneView.destroy) {
      this._paneView.destroy();
    }
    this._seriesSource.destroy();
    super.destroy();
  }

  dataEvents() {
    return this._seriesSource.dataEvents();
  }

  moveData(data) {
    return this._seriesSource.moveData(data);
  }
}

Object.assign(CustomSeries, o);
TradingView.Series = CustomSeries;
t.Series = CustomSeries;
t.isSeries = function (obj) {
  return obj instanceof CustomSeries;
};
