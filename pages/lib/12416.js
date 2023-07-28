import { getLogger } from "path/to/logger"; // ! not correct
import { deepExtend } from "./30888";
import {
  candleStylePreferencesDefault,
  hollowCandlePreferencesStyleDefault,
  barStylePreferencesDefault,
  lineStyleDefault,
  areaStylePreferencesDefault,
  hlcAreaStylePreferencesDefault,
  baselineStylePreferencesDefault,
  hiloStylePreferencesDefault,
  haStylePreferencesDefault,
  renkoStylePreferencesDefault,
  pbStylePreferencesDefault,
  kagiStylePreferencesDefault,
  pnfStylePreferencesDefault,
  rangeStylePreferencesDefault,
  columnStylePreferencesDefault,
} from "path/to/styles";

import { PriceAxisLastValueMode } from "./PriceAxisLastValueMode";
import { sessionsPreferencesDefault } from "./sessionsPreferencesDefault";
import { tradingPreferencesDefault } from "./67980";

const logger = getLogger("Chart.ApplyPreferencesToAllCharts");

const defaultGridProperties = {
  color: "",
  style: 0,
};

const defaultAxisProperties = {
  autoScale: false,
  autoScaleDisabled: false,
  lockScale: false,
  percentage: false,
  percentageDisabled: false,
  log: false,
  logDisabled: false,
  alignLabels: false,
  isInverted: false,
  indexedTo100: false,
};

const defaultPaneProperties = {
  backgroundType: ColorType.Solid,
  background: "",
  backgroundGradientStartColor: "",
  backgroundGradientEndColor: "",
  topMargin: 0,
  bottomMargin: 0,
  rightOffset: 0,
  gridLinesMode: "both",
  horzGridProperties: { ...defaultGridProperties },
  vertGridProperties: { ...defaultGridProperties },
  crossHairProperties: {
    color: "",
    style: 0,
    transparency: 0,
    width: 0,
  },
  legendProperties: {
    showStudyArguments: false,
    showStudyTitles: false,
    showStudyValues: false,
    showSeriesTitle: false,
    showSeriesOHLC: false,
    showLegend: false,
    showBarChange: true,
    showVolume: false,
    showPriceSource: false,
    showBackground: true,
    backgroundTransparency: 0,
  },
  axisProperties: { ...defaultAxisProperties },
  separatorColor: "",
};

const defaultPriceAxisProperties = {
  lineColor: "",
  textColor: "",
  fontSize: 0,
  scaleSeriesOnly: false,
  showSeriesLastValue: false,
  seriesLastValueMode: PriceAxisLastValueMode.LastValueAccordingToScale,
  showSeriesPrevCloseValue: false,
  showStudyLastValue: false,
  showSymbolLabels: false,
  showStudyPlotLabels: false,
  showBidAskLabels: false,
  showPrePostMarketPriceLabel: true,
  showFundamentalLastValue: false,
  showFundamentalNameLabel: false,
  showPriceScaleCrosshairLabel: true,
  showTimeScaleCrosshairLabel: true,
};

const defaultMainSeriesProperties = {
  style: 0,
  minTick: "",
  showPriceLine: false,
  priceLineWidth: 0,
  priceLineColor: "",
  baseLineColor: "",
  showPrevClosePriceLine: false,
  showCountdown: true,
  prevClosePriceLineWidth: 0,
  sessionId: "regular",
  prevClosePriceLineColor: "",
  esdShowDividends: false,
  esdShowSplits: false,
  esdShowEarnings: false,
  esdShowBreaks: false,
  showContinuousContractSwitches: false,
  showContinuousContractSwitchesBreaks: false,
  showFuturesContractExpiration: false,
  showLastNews: false,
  dividendsAdjustment: false,
  backAdjustment: false,
  settlementAsClose: true,
  statusViewStyle: {
    fontSize: 16,
    showExchange: true,
    showInterval: true,
    symbolTextSource: "description",
  },
  priceAxisProperties: { ...defaultAxisProperties },
  highLowAvgPrice: {
    highLowPriceLinesVisible: false,
    highLowPriceLabelsVisible: false,
    averageClosePriceLabelVisible: false,
    averageClosePriceLineVisible: false,
    highLowPriceLinesColor: "",
    highLowPriceLinesWidth: 0,
    averagePriceLineColor: "",
    averagePriceLineWidth: 0,
  },
  candleStyle: { ...candleStylePreferencesDefault },
  hollowCandleStyle: { ...hollowCandlePreferencesStyleDefault },
  barStyle: { ...barStylePreferencesDefault },
  lineStyle: { ...lineStyleDefault },
  lineWithMarkersStyle: { ...lineStyleDefault },
  steplineStyle: { ...lineStyleDefault },
  areaStyle: { ...areaStylePreferencesDefault },
  hlcAreaStyle: { ...hlcAreaStylePreferencesDefault },
  baselineStyle: { ...baselineStylePreferencesDefault },
  hiloStyle: { ...hiloStylePreferencesDefault },
  haStyle: { ...haStylePreferencesDefault },
  renkoStyle: { ...renkoStylePreferencesDefault },
  pbStyle: { ...pbStylePreferencesDefault },
  kagiStyle: { ...kagiStylePreferencesDefault },
  pnfStyle: { ...pnfStylePreferencesDefault },
  rangeStyle: { ...rangeStylePreferencesDefault },
  columnStyle: { ...columnStylePreferencesDefault },
};

const defaultTimeScaleProperties = {
  defaultRightOffset: 0,
  defaultRightOffsetPercentage: 5,
  usePercentageRightOffset: false,
};

export const defaultsPreferencesByWhiteList = {
  timezone: "",
  scalesProperties: { ...defaultPriceAxisProperties },
  priceScaleSelectionStrategyName: "auto",
  timeScale: { ...defaultTimeScaleProperties },
  mainSeries: { ...defaultMainSeriesProperties },
  sessions: { ...sessionsPreferencesDefault },
  paneProperties: { ...defaultPaneProperties },
  chartEventsSourceProperties: {},
  tradingProperties: { ...tradingPreferencesDefault },
};

const preferencesByWhiteList = {
  timezone: "",
  priceScaleSelectionStrategyName: "auto",
  timeScale: { ...defaultTimeScaleProperties },
  mainSeries: {},
  sessions: {},
  paneProperties: {},
  scalesProperties: {},
  chartEventsSourceProperties: {},
  tradingProperties: {},
};

function getPropertyByWhiteList(key, target, whiteList, prefix, deep = true) {
  if (target[key] === undefined) {
    logger.logDebug(
      `We haven't had this property ${prefix}.${key} yet, please, remove it from whiteList`
    );
    return null;
  }
  if (deepExtend && typeof target[key] === "object") {
    const subProperties = Object.keys(target[key]);
    let subProperty = "";
    return subProperties
      .map((subProperty) => ({
        [subProperty]: getPropertyByWhiteList(
          subProperty,
          target[key],
          whiteList[key],
          `${prefix}.${key}`,
          deep
        ),
      }))
      .reduce((accumulator, currentValue) => {
        subProperty = Object.keys(currentValue)[0];
        accumulator[subProperty] = currentValue[subProperty];
        return accumulator;
      }, {});
  }
  return deep ? target[key].value() : target[key];
}

function applyPreferencesToAllCharts(
  chart,
  preferences,
  whiteList = defaultsPreferencesByWhiteList
) {
  const appliedPreferences = {
    timezone: "",
    priceScaleSelectionStrategyName: "auto",
    timeScale: {
      defaultRightOffset: chart.timeScale().rightOffsetDefaultValue(),
      defaultRightOffsetPercentage: chart
        .timeScale()
        .defaultRightOffsetPercentage()
        .value(),
      usePercentageRightOffset: chart
        .timeScale()
        .usePercentageRightOffset()
        .value(),
    },
    mainSeries: {},
    sessions: {},
    paneProperties: {},
    scalesProperties: {},
    chartEventsSourceProperties: {},
    tradingProperties: {},
  };

  const whitelistKeys = ["timeScale", "mainSeries", "sessions"];
  const mainSeriesWhiteList = whiteList.mainSeries;
  const properties = Object.keys(whiteList);
  const mainSeriesProperties = Object.keys(mainSeriesWhiteList);
  const chartProperties = chart.properties();
  const preferencesProperties = preferences.properties();

  const sessionsWhiteList = whiteList.sessions;
  const sessionsProperties = Object.keys(sessionsWhiteList);
  const chartSessionsProperties = chart.sessions().properties();

  mainSeriesProperties.forEach((property) => {
    if (property !== "style") {
      appliedPreferences.mainSeries[property] = getPropertyByWhiteList(
        property,
        chartProperties,
        mainSeriesWhiteList,
        "mainSeries"
      );
    }
  });

  sessionsProperties.forEach((property) => {
    appliedPreferences.sessions[property] = getPropertyByWhiteList(
      property,
      chartSessionsProperties,
      sessionsWhiteList,
      "sessions"
    );
  });

  properties.forEach((property) => {
    if (!whitelistKeys.includes(property)) {
      appliedPreferences[property] = getPropertyByWhiteList(
        property,
        preferencesProperties,
        whiteList,
        "preferences"
      );
    }
  });

  return appliedPreferences;
}

function getDefaultPreferences(
  preferences,
  whiteList = preferencesByWhiteList
) {
  const defaultPreferences = {
    timeScale: {
      defaultRightOffset: preferences.timeScale().defaultRightOffset().value(),
      defaultRightOffsetPercentage: preferences
        .timeScale()
        .defaultRightOffsetPercentage()
        .value(),
      usePercentageRightOffset: preferences
        .timeScale()
        .usePercentageRightOffset()
        .value(),
    },
    mainSeries: {},
    sessions: deepExtend({}, sessionsPreferencesDefault),
    paneProperties: {},
    scalesProperties: {},
    chartEventsSourceProperties: {},
    tradingProperties: {},
    priceScaleSelectionStrategyName: "auto",
  };

  const whitelistKeys = ["timeScale", "mainSeries", "sessions"];
  const mainSeriesWhiteList = whiteList.mainSeries;
  const properties = Object.keys(whiteList);
  const mainSeriesProperties = Object.keys(mainSeriesWhiteList);
  const defaultMainSeriesProperties = factoryDefaults(
    "chartproperties.mainSeriesProperties"
  );
  const defaultProperties = factoryDefaults("chartproperties");

  mainSeriesProperties.forEach((property) => {
    if (property !== "style") {
      defaultPreferences.mainSeries[property] = getPropertyByWhiteList(
        property,
        defaultMainSeriesProperties,
        mainSeriesWhiteList,
        "mainSeries",
        false
      );
    }
  });

  properties.forEach((property) => {
    if (!whitelistKeys.includes(property)) {
      defaultPreferences[property] = getPropertyByWhiteList(
        property,
        defaultProperties,
        whiteList,
        "preferences",
        false
      );
    }
  });

  return defaultPreferences;
}

export {
  defaultsPreferencesByWhiteList,
  preferencesByWhiteList,
  applyPreferencesToAllCharts,
  getDefaultPreferences,
};
