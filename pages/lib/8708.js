import { enabled } from "./helpers";
// import { emit } from "lodash";
import { symbolTitle, PlotList, emit } from "./42960";
import PlotList from "./PlotList";
import { StudyBarColorer } from "./35994";
import {
  colorToInteger,
  // getLogger,
  isLinePlot,
  isOhlcPlot,
  isBarColorerPlot,
  isPlotTitleDefined,
  // isRGB,
} from "./87095";

import {
  isLinePlot,
  isOhlcPlot,
  isBarColorerPlot,
  isPlotTitleDefined,
  // isRGB,
} from "./72877";

import { StudyBase } from "path/to/u"; // ! not correct

export class Study extends StudyBase {
  constructor(chartApi, series, model, metaInfo) {
    super(chartApi, series, model, metaInfo);
    this._resolvedSymbols = {};
    this._chartApi = chartApi;
    this._plotFields = [];
    const plots = this.metaInfo().plots;
    if (plots) {
      for (let i = 0; i < plots.length; i++) {
        const plotId = plots[i].id;
        this._plotFields.push(plotId);
      }
    }
    this._invalidateLastNonEmptyPlotRowCache();
    this.m_data = new PlotList(this._createViews(), this._metaInfo);
    this._plotOffsetsMetaInfoOverride = {};
    this._recreatePriceFormattingDependencies();
    this._properties.precision
      .listeners()
      .subscribe(this, this._precisionChanged);
    this._showStudyArgumentsProperty
      .listeners()
      .subscribe(this, this.invalidateTitleCache);
    this._properties.inputs
      .listeners()
      .subscribe(this, this.invalidateTitleCache);
    if (enabled("update_study_formatter_on_symbol_resolve")) {
      this._model
        .mainSeries()
        .dataEvents()
        .symbolResolved()
        .subscribe(this, this._recreatePriceFormattingDependencies);
    }
    this._model
      .mainSeries()
      .dataEvents()
      .symbolResolved()
      .subscribe(this, this.invalidateTitleCache);
    this._simplePlotsCount = 0;
    // const { plots } = this._metaInfo;
    if (plots) {
      const map = {};
      for (let i = 0; i < plots.length; ++i) {
        if (isLinePlot(plots[i])) {
          this._simplePlotsCount++;
        } else if (isOhlcPlot(plots[i])) {
          const target = this.metaInfo().plots[i].target;
          if (!map[target]) {
            map[target] = target;
            this._simplePlotsCount++;
          }
        }
      }
    }
    if (this.hasBarColorer()) {
      this._properties.visible
        .listeners()
        .subscribe(
          this._model.mainSeries(),
          this._model.mainSeries().invalidateBarStylesCache
        );
    }
    this._formatterChanged = new EventEmitter();
    this._priceStepChanged = new EventEmitter();
    this._aboutToBeDestroyed = new EventEmitter();
    this._definitionsViewModel = null;
    this._updateMaxOffsetValue();
  }

  series() {
    return this._series;
  }

  model() {
    return this._model;
  }

  onTagsChanged() {
    return this._tagsChanged;
  }

  isSavedInStudyTemplates() {
    for (let i = 0; i < this._metaInfo.inputs.length; i++) {
      if (this._metaInfo.inputs[i].type === "bar_time") {
        return false;
      }
    }
    return true;
  }

  _prepareInputValue(input, options) {
    const inputId = input.id;
    if (options.valuesAsIsFromProperties) {
      return this._properties.inputs[inputId].value();
    }
    if (input.type === "symbol") {
      const symbolsForDisplay = options && options.symbolsForDisplay;
      let value = this._properties.inputs[inputId].value();
      const symbol = symbolsForDisplay ? value : this._getSymbolForApi(value);
      let resolvedSymbol =
        this._resolvedSymbols &&
        this._resolvedSymbols[this._getSymbolForResolve(symbol)];
      if (value === "" && input.optional) {
        if (options && options.keepOptionalSymbolsEmpty) {
          return value;
        }
        value = this._model.mainSeries().symbol();
        resolvedSymbol = this._model.mainSeries().symbolInfo();
      }
      if (symbolsForDisplay) {
        if (resolvedSymbol) {
          if (enabled("study_symbol_ticker_description")) {
            switch (
              this._model.mainSeries().symbolTextSourceProxyProperty().value()
            ) {
              case "description":
                value = resolvedSymbol.description;
                break;
              case "ticker-and-description":
                value = `${resolvedSymbol.name}, ${resolvedSymbol.description}`;
                break;
              case "ticker":
                value = resolvedSymbol.name;
            }
          } else {
            value = symbolTitle(resolvedSymbol, options.noExchanges);
          }
        } else if (enabled("hide_unresolved_symbols_in_legend")) {
          value = "";
        }
      } else if (resolvedSymbol) {
        value = resolvedSymbol.ticker || resolvedSymbol.full_name;
      }
      if (!this.isPine() && options && options.symbolsForChartApi) {
        value = this.getSymbolString(value);
      }
      return value;
    }
    if (input.type === "bar_time") {
      let value = this._properties.inputs[inputId].value();
      if (value < 0) {
        const unixTime = this._rightOffsetToUnixTime(-value);
        value = unixTime && unixTime >= 0 ? unixTime : value;
      }
      return value;
    }
    if (this._metaInfo.isTVScript || this._metaInfo.pine) {
      if (inputId === "text") {
        return this._metaInfo.defaults.inputs.text;
      }
      if (inputId === "pineId") {
        return this._metaInfo.scriptIdPart;
      }
      if (inputId === "pineVersion") {
        return this._metaInfo.pine ? this._metaInfo.pine.version : "-1";
      }
      if (input.type === "color" && this._metaInfo.isRGB) {
        const value = this._properties.inputs[inputId].value();
        return colorToInteger(value);
      }
      if (input.type === "price") {
        const value = this._properties.inputs[inputId].value();
        return options.priceInputsForDisplay
          ? this.formatter().format(value)
          : value;
      }
      return this._properties.inputs[inputId].value();
    }
    return this._properties.inputs[inputId].value();
  }

  priceLabelText(plotId) {
    let title;
    const styles = this._metaInfo.styles;
    const ohlcPlots = this._metaInfo.ohlcPlots;
    if (styles && styles[plotId]) {
      title = styles[plotId].title;
    } else if (ohlcPlots && ohlcPlots[plotId]) {
      title = ohlcPlots[plotId].title;
    }
    const isSimplePlot =
      this._simplePlotsCount !== 1 || isPlotTitleDefined(title);
    if (
      this._metaInfo.is_price_study &&
      title !== this._metaInfo.shortDescription
    ) {
      return isSimplePlot
        ? `${this._metaInfo.shortDescription}:${title}`
        : this._metaInfo.shortDescription;
    }
    return isSimplePlot ? title : this._metaInfo.shortDescription;
  }

  data() {
    return this.m_data;
  }

  moveData(index) {
    this._ongoingDataUpdate = this._ongoingDataUpdate.then(() => {
      this._invalidateLastNonEmptyPlotRowCache();
      this.data().move(index);
    });
  }

  static offset(study, plotIndex) {
    let offset = 0;
    if (study._plotOffsets && study._plotOffsets[plotIndex] !== undefined) {
      offset += study._plotOffsets[plotIndex];
    }
    if (
      study.properties().offsets &&
      study.properties().offsets[plotIndex] !== undefined
    ) {
      offset += study.properties().offsets[plotIndex].val.value();
    }
    if (study.properties().offset !== undefined) {
      offset += study.properties().offset.val.value();
    }
    return offset;
  }

  offset(plotIndex) {
    return Study.offset(this, plotIndex);
  }

  _showLastValueOnPriceScale() {
    return this._model.properties().scalesProperties.showStudyLastValue.value();
  }

  barColorer() {
    const plots = this._metaInfo.plots;
    let barColorer = null;
    for (let i = 0; i < plots.length; ++i) {
      if (isBarColorerPlot(plots[i])) {
        const barColorerPlot = new StudyBarColorer(this, i);
        if (barColorer === null) {
          barColorer = barColorerPlot;
        } else {
          barColorer.pushBackBarColorer(barColorerPlot);
        }
      }
    }
    if (barColorer === null) {
      throw new Error(
        "Cannot create BarColorer: study doesn't have a bar_colorer plot!"
      );
    }
    return barColorer;
  }

  base() {
    return 0;
  }

  _onSourceFormatterChanged() {
    if (this._formatter === null) {
      if (this._priceScale !== null) {
        this._priceScale.updateFormatter();
      }
      this._formatterChanged.emit();
    }
  }

  _onSourcePriceStepChanged() {
    if (this._priceStep === null) {
      this._priceStepChanged.emit();
    }
  }

  _precisionChanged() {
    this._recreatePriceFormattingDependencies();
  }

  setOwnerSource(ownerSource) {
    super.setOwnerSource(ownerSource);
    this._recreatePriceFormattingDependencies();
  }

  nearestIndex(logicalPoint, time, secondPoint) {
    if (TradingView.isInteger(logicalPoint)) {
      const searchResult = this.data().search(logicalPoint, time, secondPoint);
      return searchResult !== null ? searchResult.index : undefined;
    }
    console.log("nearestIndex: incorrect logicalPoint");
  }

  tags() {
    if (
      !this._metaInfo ||
      !this._metaInfo.description ||
      this._metaInfo.isTVScriptStub ||
      this._metaInfo.is_hidden_study ||
      (this._metaInfo.isTVScript && this._metaInfo.productId === "tv-scripting")
    ) {
      return [];
    }
    return [this._metaInfo.description];
  }

  onExtendedHoursChanged() {
    this.restart(true);
  }

  hasSymbolInputs() {
    for (let i = this._metaInfo.inputs.length; i--; ) {
      if (this._metaInfo.inputs[i].type === "symbol") {
        return true;
      }
    }
    return false;
  }

  canOverrideMinTick() {
    return false;
  }

  _subscribeExtendedHours() {
    if (!this._isSubscribedToExtendedHours && this.hasSymbolInputs()) {
      this._series
        .onExtendedHoursChanged()
        .subscribe(this, this.onExtendedHoursChanged);
      this._isSubscribedToExtendedHours = true;
    }
  }

  removeByRemoveAllStudies() {
    return true;
  }

  getPlotFields() {
    return this._plotFields;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.resolve(null);
  }

  getPropertyDefinitionsViewModel() {
    if (this._definitionsViewModel === null) {
      return this._getPropertyDefinitionsViewModelClass().then(
        (PropertyDefinitionsViewModelClass) => {
          if (PropertyDefinitionsViewModelClass === null || this._isDestroyed) {
            return null;
          }
          if (this._definitionsViewModel === null) {
            this._definitionsViewModel = new PropertyDefinitionsViewModelClass(
              this._model.undoModel(),
              this
            );
          }
          return this._definitionsViewModel;
        }
      );
    }
    return Promise.resolve(this._definitionsViewModel);
  }

  _getTelemetryAdditionalData() {
    let suffix = "";
    if (
      this._metaInfo.pine &&
      this._metaInfo.pine.version &&
      this._metaInfo.shortId.indexOf("USER") >= 0
    ) {
      suffix = `_v${this._metaInfo.pine.version}`;
    }
    return {
      symbol: this.series().actualSymbol(),
      resolution: this.series().interval(),
      study: `${this._metaInfo.shortId}${suffix}`,
    };
  }

  _sendTelemetryReport(
    event,
    data,
    additionalData = this._getTelemetryAdditionalData()
  ) {
    const reportData = {
      ...data,
      additional: additionalData,
    };
    emitChartReport(event, reportData);
  }

  _sendTelemetryCounter(event, additionalData) {
    this._sendTelemetryReport(event, { count: 1 }, additionalData);
  }

  onAboutToBeDestroyed() {
    return this._aboutToBeDestroyed;
  }

  destroy() {
    this._aboutToBeDestroyed.emit();
    this._isDestroyed = true;
    if (this._definitionsViewModel !== null) {
      this._definitionsViewModel.destroy();
      this._definitionsViewModel = null;
    }
    this._properties.precision
      .listeners()
      .unsubscribe(this, this._precisionChanged);
    this._showStudyArgumentsProperty
      .listeners()
      .unsubscribe(this, this.invalidateTitleCache);
    this._model.mainSeries().dataEvents().symbolResolved().unsubscribeAll(this);
    if (this.hasBarColorer()) {
      this._properties.visible
        .listeners()
        .unsubscribe(
          this._model.mainSeries(),
          this._model.mainSeries().invalidateBarStylesCache
        );
    }
    this._model
      .mainSeries()
      .dataEvents()
      .symbolResolved()
      .unsubscribe(this, this._recreatePriceFormattingDependencies);
    if (this._properties.offsets !== undefined) {
      this._properties.offsets
        .listeners()
        .unsubscribe(this, this._updateMaxOffsetValue);
    }
    if (this._properties.offset !== undefined) {
      this._properties.offset
        .listeners()
        .unsubscribe(this, this._updateMaxOffsetValue);
    }
    super.destroy();
  }

  desiredPriceScalePosition() {
    if (this.metaInfo().isTVScriptStub) {
      return "overlay";
    }
    if (this.metaInfo().linkedToSeries) {
      return "as-series";
    }
    if (this.metaInfo().priceScale === undefined) {
      return null;
    }
    return ["right", "left", "overlay"][this.metaInfo().priceScale];
  }

  formatterChanged() {
    return this._formatterChanged;
  }

  copiable() {
    return enabled("datasource_copypaste") && !this.isChildStudy();
  }

  setPriceScale(priceScale) {
    super.setPriceScale(priceScale);
    emit("study_event", this.id(), "price_scale_changed");
  }
}

TradingView.Study = Study;
t.Study = Study;
