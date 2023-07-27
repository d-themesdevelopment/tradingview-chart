import { ensureNotNull, ensureDefined } from "./assertions";
import { enabled } from "./helpers";
// import {
//   LineDataSource,
//   PriceAxisView,
//   generateTextColor,
//   resetTransparency,
//   getCurrentModePriceText,
//   getOppositeModePriceText,
// } from "path/to/lineDataSource";

import { DefaultProperty, currencyUnitVisibilityProperty } from "./46100"; // !
import { symbolSameAsCurrent } from "./97121";

import { CheckMobile, isLineToolName } from "./15367"; // !

import { StudyValuesProvider } from "./54303";
import { StudyDataWindowView } from "./StudyDataWindowView";
import { StudyStatusProvider } from "./6892";

import { extractSymbolNameFromSymbolInfo } from "./42960";
import { symbolCurrency, symbolUnit } from "./helpers";
import { isConvertedToOtherCurrency, isConvertedToOtherUnit } from "./42960";
import { measureUnitId, getStudySymbolExchange } from "./42960";

import {
  StudyValuesProvider,
  // symbolForApi,
  createSeriesFormatter,
  // displayedSymbolExchange,
  // displayedSymbolName,
  // getSymbolForResolve,
  // symbolInfo,
  // availablePriceSources,
} from "./54303"; // ! not correct

import { StudyStatusView } from "./StudyStatusView";
import { isNumber } from "lodash";

const forceExchangeAsTitle = enabled("force_exchange_as_title");
const hideStudyCompareLegendItem = enabled("hide_study_compare_legend_item");
const hideUnresolvedSymbolsInLegend = enabled(
  "hide_unresolved_symbols_in_legend"
);
const symbolInfoPriceSource = enabled("symbol_info_price_source");

class StudyCompare {
  constructor(model, inputs, id, source) {
    this._model = model;
    this._inputs = inputs || StudyCompare.createProperties();
    this._id = id;
    this._source = source;
    this._isActingAsSymbolSource = new SomeClass(true);
    this._realignToolsLastParams = null;
    this._inputs.minTick.subscribe(null, () =>
      this._recreatePriceFormattingDependencies()
    );
    this._inputs.minTick.subscribe(null, () => this._model.fullUpdate());
    this._symbolResolvingActive = new SomeClass(false);
    this._symbolHibernated = new SomeClass(false);
    model
      .mainSeries()
      .onIntervalChanged()
      .subscribe(this, () => model.realignLineTools(this));
  }

  static createProperties(defaults) {
    return new DefaultProperty("study_compare", defaults);
  }

  properties() {
    return this._inputs;
  }

  isActingAsSymbolSource() {
    return this._isActingAsSymbolSource.readonly();
  }

  setSymbolParams(params) {
    this._setSymbolCurrencyUnitInternal(params);
  }

  setSymbol(symbol) {
    this.setSymbolParams({ symbol });
  }

  symbol() {
    return this.properties().inputs.symbol.value();
  }

  symbolInfo() {
    if (!this._resolvedSymbols) return null;
    const symbol = this.properties().inputs.symbol.value();
    if (!symbol) return null;
    let info;
    info = this._resolvedSymbols[this._getSymbolForResolve(symbol)] || null;
    return info;
  }

  symbolResolved() {
    return this.symbolsResolved();
  }

  symbolResolvingActive() {
    return this._symbolResolvingActive;
  }

  symbolHibernated() {
    return this._symbolHibernated;
  }

  isVisible() {
    const isVisible = super.isVisible();
    this._symbolHibernated.setValue(!isVisible);
    return isVisible;
  }

  symbolSameAsCurrent(symbol) {
    return symbolSameAsCurrent(symbol, this.symbolInfo());
  }

  currency() {
    return this.properties().currencyId.value() || null;
  }

  setCurrency(currency) {
    this.setSymbolParams({ currency });
  }

  isConvertedToOtherCurrency() {
    return isConvertedToOtherCurrency(this.symbolInfo());
  }

  unit() {
    return this.properties().unitId.value() || null;
  }

  setUnit(unit) {
    this.setSymbolParams({ unit });
  }

  isConvertedToOtherUnit() {
    return isConvertedToOtherUnit(
      this.symbolInfo(),
      this._model.unitConversionEnabled()
    );
  }

  style() {
    return 2;
  }

  interval() {
    return this._model.mainSeries().interval();
  }

  setStyle(style) {}

  setInterval(interval) {}

  symbolSource() {
    return this;
  }

  statusView() {
    return hideStudyCompareLegendItem ? super.statusView() : null;
  }

  guiPlotName() {
    return this.properties().inputs.symbol.value();
  }

  canOverrideMinTick() {
    return true;
  }

  canBeHiddenByGlobalFlag() {
    return false;
  }

  valuesProvider() {
    return new StudyCompareValuesProvider(this, this._model);
  }

  statusProvider(index) {
    return new StudyCompareStatusProvider(
      this,
      this._model.properties().scalesProperties.textColor
    );
  }

  measureUnitId() {
    return measureUnitId(this.symbolInfo());
  }

  _createViews() {
    this._legendView =
      this._legendView || new StudyCompareLegendView(this, this._model);
    this._dataWindowView =
      this._dataWindowView || new StudyCompareDataWindowView(this, this._model);
    this._statusView = this._statusView || new StudyStatusView(this);
    super._createViews();
  }

  _showLastValueOnPriceScale() {
    return this._model
      .properties()
      .scalesProperties.showSeriesLastValue.value();
  }

  _onUnitChanged() {
    if (currencyUnitVisibilityProperty().value() !== "alwaysOff") {
      this._model.fullUpdate();
    }
    if (this._model.unitConversionEnabled() && this.isStarted()) {
      this._tryChangeInputs();
    }
    this._unitChanged.fire();
  }

  _getSymbolObject(e) {
    const symbolObject = super._getSymbolObject(e);
    const currency = this.currency();
    if (currency !== null) {
      symbolObject["currency-id"] = currency;
    }
    const unit = this.unit();
    if (this._model.unitConversionEnabled() && unit !== null) {
      symbolObject["unit-id"] = unit;
    }
    return symbolObject;
  }

  _onSymbolResolvingStart() {
    super._onSymbolResolvingStart();
    this._symbolResolvingActive.setValue(true);
  }

  _onSymbolError() {
    super._onSymbolError();
    this._symbolResolvingActive.setValue(false);
  }

  _onSymbolResolved(e, symbol, symbolInfo) {
    super._onSymbolResolved(e, symbol, symbolInfo);
    this._recreatePriceFormattingDependencies();
    const isSymbolSame = symbol === this.symbol();
    const symbolName = isSymbolSame
      ? extractSymbolNameFromSymbolInfo(symbolInfo, this.symbol())
      : null;
    const currency = symbolCurrency(symbolInfo);
    const unit = symbolUnit(symbolInfo, this._model.unitConversionEnabled());
    this._setSymbolCurrencyUnitInternal(
      { symbol: symbolName, currency, unit },
      symbolInfo
    );
    this._symbolResolvingActive.setValue(false);
  }

  async _changeInputsImpl(e, t) {
    await super._changeInputsImpl(e, t);
    this._realignLineToolsIfParamsChanged();
  }

  _createStudyOnServer() {
    super._createStudyOnServer();
    this._realignLineToolsIfParamsChanged();
  }

  _tryCreateFormatter() {
    const customFormatterFactory = ensureDefined(
      I.customFormatters
    ).priceFormatterFactory;
    const formatter =
      customFormatterFactory?.call(
        I.customFormatters,
        this.symbolInfo(),
        this.properties().minTick.value()
      ) || null;
    return (
      formatter ||
      createSeriesFormatter(
        this.symbolInfo(),
        this.properties().minTick.value()
      )
    );
  }

  _titleInParts(e, t, i, s) {
    const symbolInfo = this.symbolInfo();
    return [
      this._getSymbolTitlePart(symbolInfo),
      [
        this._getExchangeTitlePart(symbolInfo, s),
        this._getPriceSourceTitlePart(symbolInfo),
      ].filter((e) => e !== null),
    ];
  }

  _skipHistogramBaseOnAutoScale() {
    return true;
  }

  _getSymbolTitlePart(symbolInfo) {
    if (symbolInfo === null) {
      return hideUnresolvedSymbolsInLegend
        ? ""
        : this.properties().inputs.symbol.value();
    }
    const exchange = getStudySymbolExchange(symbolInfo);
    if (forceExchangeAsTitle && exchange !== undefined) {
      return exchange;
    }
    if (enabled("study_overlay_compare_legend_option")) {
      switch (
        this._model.mainSeries().symbolTextSourceProxyProperty().value()
      ) {
        case "description":
          return symbolInfo.description;
        case "ticker-and-description":
          return `${symbolInfo.name}, ${symbolInfo.description}`;
        case "long-description":
          return symbolInfo.long_description !== null
            ? symbolInfo.long_description
            : symbolInfo.description;
      }
    }
    return symbolInfo.name;
  }

  _getExchangeTitlePart(symbolInfo, showExchange) {
    if (symbolInfo === null || showExchange) {
      return null;
    }
    return getStudySymbolExchange(symbolInfo) || null;
  }

  _getPriceSourceTitlePart(symbolInfo) {
    if (
      !symbolInfo ||
      !symbolInfoPriceSource ||
      !this._model
        .properties()
        .paneProperties.legendProperties.showPriceSource.value()
    ) {
      return null;
    }
    const priceSourceId = symbolInfo.price_source_id;
    if (priceSourceId !== undefined) {
      const sourceName = ensureDefined(
        this._model.availablePriceSources().name(priceSourceId)
      );
      return sourceName || null;
    }
    return null;
  }

  _setSymbolCurrencyUnitInternal(params, symbolInfo) {
    const { symbol: newSymbol, currency: newCurrency, unit: newUnit } = params;
    const inputs = this.properties().inputs;
    const oldSymbol = inputs.symbol.value();
    const oldCurrency = inputs.currencyId.value();
    const oldUnit = inputs.unitId.value();

    if (newSymbol !== undefined && newSymbol !== oldSymbol) {
      inputs.symbol.setValueSilently(newSymbol);
    }

    if (newCurrency !== undefined && newCurrency !== oldCurrency) {
      inputs.currencyId.setValueSilently(newCurrency);
    }

    if (newUnit !== undefined && newUnit !== oldUnit) {
      inputs.unitId.setValueSilently(newUnit);
    }

    if (symbolInfo) {
      this._resolvedSymbolsByInput[this.symbol()] = symbolInfo;
      this._resolvedSymbols[this._getSymbolForResolve(this.symbol())] =
        symbolInfo;
      this._realignToolsLastParams = null;
    } else {
      const symbolInfo = this.symbolInfo();
      if (symbolInfo !== null) {
        inputs.currencyId.setValueSilently(symbolCurrency(symbolInfo));
        inputs.unitId.setValueSilently(
          symbolUnit(symbolInfo, this._model.unitConversionEnabled())
        );
      }
    }

    if (inputs.symbol.value() !== oldSymbol) {
      inputs.symbol.listeners().fire(inputs.symbol);
    }

    if (inputs.currencyId.value() !== oldCurrency) {
      inputs.currencyId.listeners().fire(inputs.currencyId);
    }

    if (inputs.unitId.value() !== oldUnit) {
      inputs.unitId.listeners().fire(inputs.unitId);
    }

    this._realignLineToolsIfParamsChanged();
  }

  _realignLineToolsIfParamsChanged() {
    const symbol = this.symbol();
    const interval = this.interval();
    const currency = this.currency();
    const unit = this.unit();

    if (
      this._realignToolsLastParams &&
      this._realignToolsLastParams.symbol === symbol &&
      this._realignToolsLastParams.interval === interval &&
      this._realignToolsLastParams.currency === currency &&
      this._realignToolsLastParams.unit === unit
    ) {
      return;
    }

    this._model.realignLineTools(this);
    this._realignToolsLastParams = { symbol, interval, currency, unit };
  }
}

class SomeClass {
  constructor(value) {
    this._value = value;
  }

  readonly() {
    return this._value;
  }

  setValue(value) {
    this._value = value;
  }
}

class StudyCompareValuesProvider extends StudyValuesProvider {
  constructor(compare, model) {
    super(compare, model);
    this._emptyValues[0].title = compare.guiPlotName("");
  }

  getValues(index) {
    if (!isNumber(index)) {
      if (this._showLastPriceAndChangeOnly()) {
        index = this._study.data().lastIndex();
      } else {
        index = this._model.crossHairSource().appliedIndex();
        if (!isNumber(index)) {
          index = this._study.data().lastIndex();
        }
      }
    }
    return super.getValues(index);
  }

  _hideValues() {
    return false;
  }

  _showLastPriceAndChangeOnly() {
    return (
      CheckMobile.any() &&
      (this._model.crossHairSource().pane === null ||
        isLineToolName(
          this._model.properties().paneProperties.legendProperties.tool.value()
        ) ||
        this._model.lineBeingEdited() !== null)
    );
  }
}

class StudyCompareDataWindowView extends StudyDataWindowView {
  _hideValues() {
    return false;
  }

  _createValuesProvider(index, priceScale) {
    return new StudyCompareDataWindowValuesProvider(index, priceScale);
  }
}

class StudyCompareDataWindowValuesProvider extends StudyValuesProvider {
  constructor(compare, model) {
    super(compare, model);
    this._emptyValues[0].title = compare.guiPlotName("");
  }
}

class StudyCompareLegendView extends StudyDataWindowView {
  constructor(compare, model) {
    super(compare, model);
    this._studyCompare = compare;
  }

  _hideValues() {
    return false;
  }

  _createValuesProvider(index, priceScale) {
    return new StudyCompareLegendValuesProvider(index, priceScale);
  }
}

class StudyCompareLegendValuesProvider extends StudyValuesProvider {
  constructor(compare, model) {
    super(compare, model);
    this._additional = null;
    this._showSeriesOHLC =
      compare.properties().paneProperties.legendProperties.showSeriesOHLC;
    this._showSeriesOHLC.subscribe(this, this.update);
  }

  areValuesVisible() {
    return this._showSeriesOHLC.value();
  }

  destroy() {
    this._showSeriesOHLC.unsubscribeAll(this);
  }

  additional() {
    return this._additional;
  }

  _updateImpl() {
    super._updateImpl();
  }
}

class StudyCompareStatusProvider extends StudyStatusProvider {
  getSplitTitle() {
    return this._source.titleInParts(true, undefined, false, false);
  }

  text() {
    const source = this._source;
    if (source.isActualInterval()) {
      if (source.isFailed()) {
        return `${source.title(
          true,
          undefined,
          false,
          false
        )}: ${this.sourceStatusText()}`;
      }
      return `${source.title(
        true,
        undefined,
        false,
        false
      )} ${this.sourceStatusText()}`;
    }
    return source.title(true, undefined, false, false);
  }
}

export { StudyCompare };
