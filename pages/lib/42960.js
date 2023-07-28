import { t } from "i18n";
import { setValue, getValue } from "settings";
import { enabled } from "features";
import { SYMBOL_STRING_DATA } from "symbolStringData";
import { Interval } from "interval";
import { PriceFormatter, VolumeFormatter } from "formatters";
import { isCFDSymbol } from "symbolUtils";
import { combine, createWVFromGetterAndSubscription } from "wvUtils";

const payAttentionToTickerNotSymbol = enabled(
  "pay_attention_to_ticker_not_symbol"
);

const uppercaseInstrumentNames = enabled("uppercase_instrument_names");
const chartingLibrarySingleSymbolRequest = enabled(
  "charting_library_single_symbol_request"
);

const useTickerOnSymbolInfoUpdate = enabled("use_ticker_on_symbol_info_update");
const hideObjectTreeAndPriceScaleExchangeLabel = enabled(
  "hide_object_tree_and_price_scale_exchange_label"
);

const priceSourceStyles = [4, 7, 5, 6];
const rangeBasedStyles = [4, 5, 6, 7];
const timeBasedStyles = [0, 1, 9, 2, 14, 15, 3, 16, 10, 8, 12, 13];
const singleValueBasedStyles = [2, 14, 15, 10, 3, 13];

function getTranslatedChartStyleName(style) {
  return {
    0: t(null, void 0, i(16812)),
    1: t(null, void 0, i(63528)),
    2: t(null, void 0, i(1277)),
    14: t(null, void 0, i(38397)),
    15: t(null, void 0, i(79511)),
    3: t(null, void 0, i(42097)),
    16: t(null, void 0, i(34911)),
    9: t(null, void 0, i(61582)),
    10: t(null, void 0, i(17712)),
    12: t(null, void 0, i(31994)),
    13: t(null, void 0, i(36018)),
    4: t(null, void 0, i(20801)),
    7: t(null, void 0, i(63492)),
    5: t(null, void 0, i(92901)),
    6: t(null, void 0, i(99969)),
    11: t(null, void 0, i(90357)),
    8: t(null, void 0, i(40530)),
  }[style];
}

function isRequiringRestartSeriesStyles(style) {
  return priceSourceStyles.includes(style);
}

function isRangeBasedStyle(style) {
  return rangeBasedStyles.includes(style);
}

function isRangeStyle(style) {
  return style === 11;
}

function isTimeBasedStyle(style) {
  return timeBasedStyles.includes(style);
}

function isValidStyle(style) {
  return isRangeBasedStyle(style) || isTimeBasedStyle(style);
}

export function isSingleValueBasedStyle(style) {
  return singleValueBasedStyles.includes(style);
}

function setLastUsedStyle(style, isSingleValueBased) {
  if (isValidStyle(style)) {
    if (style !== 11) {
      setValue("chart.lastUsedStyle", style);
    }
    if (isCloseBasedSymbol(isSingleValueBased)) {
      if (isSingleValueBasedStyle(style)) {
        setValue("chart.lastUsedSingleValueBasedStyle", style);
      }
    }
  }
}

function getLastUsedStyle() {
  const style = getValue("chart.lastUsedStyle");
  return style === undefined ? 1 : style;
}

function getLastUsedSingleValueBasedStyle() {
  const style = getValue("chart.lastUsedSingleValueBasedStyle");
  return style === undefined ? 14 : style;
}

function getDefaultStyle(isRangeBased) {
  return isRangeBased ? 11 : 1;
}

function getChartStyleByResolution(resolution, style) {
  const isRangeStyle = isRangeBasedStyle(style);
  const isTimeStyle = isTimeBasedStyle(style);

  if (!isRangeStyle && Interval.isRange(resolution)) {
    return getDefaultStyle(true);
  } else if (isRangeStyle && !Interval.isRange(resolution)) {
    return getDefaultStyle(false);
  } else {
    return style;
  }
}

function chartStyleStudyId(symbol, includeVersion) {
  const data = SYMBOL_STRING_DATA[symbol];
  if (data === undefined) return null;
  if (includeVersion) {
    return `${data.type}-${data.basicStudyVersion}`;
  } else {
    return data.type;
  }
}

function preparePriceAxisProperties(properties) {
  const { lockScale, log, percentage, logDisabled, percentageDisabled } =
    properties.priceAxisProperties;
  const isRangeStyle = properties.style.value() === 6;

  if (isRangeStyle || lockScale.value()) {
    log.setValue(false);
    percentage.setValue(false);
  }

  logDisabled.setValue(!(isRangeStyle || lockScale.value()));
  percentageDisabled.setValue(!(isRangeStyle || lockScale.value()));
}

function hasProjection(style) {
  return [4, 7, 5, 6].includes(style);
}

export function isPriceSourceStyle(style) {
  return [2, 14, 15, 10, 3, 13].includes(style);
}

function getSeriesDisplayErrorWV(e) {
  return combine(
    (error, isLoading) => {
      switch (error) {
        case 4: {
          const seriesErrorMessage = e.seriesErrorMessage();
          return seriesErrorMessage !== null &&
            (seriesErrorMessage === "resolution_not_entitled" ||
              seriesErrorMessage === "custom_resolution" ||
              seriesErrorMessage === "seconds_not_entitled" ||
              seriesErrorMessage.startsWith("study_not_auth:"))
            ? null
            : "invalid_symbol";
        }
        case 1:
        case 2:
          return null;
        default:
          if (isLoading) return "no_data";
      }
      return null;
    },
    createWVFromGetterAndSubscription(() => e.status(), e.onStatusChanged()),
    createWVFromGetterAndSubscription(
      () => !e.bars().size() && !e.isInReplay(),
      e.dataEvents().dataUpdated()
    ),
    createWVFromGetterAndSubscription(
      () => ({}),
      e.model().onChartThemeLoaded()
    )
  );
}

function actualSymbol(e, useTicker) {
  let name = e && (e.pro_name || e.full_name || e.name);
  if (chartingLibrarySingleSymbolRequest && useTicker) {
    name = e.ticker || name;
  }
  if (uppercaseInstrumentNames && name) {
    name = name.toUpperCase();
  }
  return name;
}

function displayedSymbolName(e) {
  let name = (e && (Q(e) || e.name)) || "";
  if (name.length > 40) {
    name = name.substring(0, 37) + "...";
  }
  return name.trim();
}

function displayedSymbolExchange(e) {
  const exchange = e ? e.exchange : "";
  return uppercaseInstrumentNames ? exchange.toUpperCase() : exchange;
}

function actualSymbol(e, t) {
  return (e && e.full_name) || t;
}

function symbolForApi(e, t) {
  return payAttentionToTickerNotSymbol && e
    ? ensureDefined(e.ticker)
    : actualSymbol(e, t);
}

function isRegularSessionId(e) {
  return e === "regular" || e === "us_regular";
}

function isCloseBasedSymbol(e) {
  return e === "c";
}

function isMeasureUnitSymbol(e) {
  return e && e.measure === "unit" && pe(e) !== null;
}

export function measureUnitId(e) {
  return (e && e.value_unit_id) || null;
}

function symbolBaseCurrency(e) {
  return (e && e.base_currency_id) || null;
}

export function isConvertedToOtherCurrency(e) {
  return e !== null && U(e) && e.original_currency_id !== e.currency_id;
}

export function isConvertedToOtherUnit(e) {
  return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
}

function isCryptoSymbol(e) {
  return (
    (e &&
      (e.typespecs.includes("crypto") ||
        e.type === "crypto" ||
        e.type === "bitcoin")) ||
    false
  );
}

function isEconomicSymbol(e) {
  return (
    e !== null &&
    (e.type === "forex" ||
      isCFDSymbol(e.type, e.typespecs) ||
      isCryptoSymbol(e))
  );
}

function isFutureContinuousSymbolWithBackajustment(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    Boolean(
      e.has_backadjustment &&
        (e.typespecs === null || e.typespecs.includes("continuous"))
    )
  );
}

function isFuturesContractSymbol(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    (e.typespecs === null || !e.typespecs.includes("continuous"))
  );
}

export function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
  let name =
    symbolInfo &&
    (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
  if (chartingLibrarySingleSymbolRequest && ticker) {
    name = ticker;
  }
  if (uppercaseInstrumentNames && name) {
    name = name.toUpperCase();
  }
  return name;
}

export function symbolTitle(symbol, includeExchange, exchangeLabel) {
  return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
    ? symbol.name
    : `${symbol.name}, ${exchangeLabel}`;
}

function getSeriesPriceFormattingState(
  e,
  format = "default",
  ignoreMinMove = false
) {
  let priceScale = 100;
  let minMove = 1;
  let fractional = false;
  let minMove2;
  let variableMinTick;

  if (format === "default" && e != null) {
    const t = e.formatter || e.format;
    if (t === "volume") {
      return new VolumeFormatter(2);
    } else if (t === "percent") {
      return new PercentageFormatter(e.pricescale);
    }
  }

  if (format === "default") {
    if (e != null) {
      priceScale = e.pricescale;
      minMove = e.minmov;
      fractional = e.fractional;
      minMove2 = e.minmove2;
      variableMinTick = e.variable_tick_size || undefined;
    }
  } else {
    let e = format.split(",");
    if (e.length !== 3) {
      e = ["100", "1", "false"];
    }
    priceScale = parseInt(e[0]);
    minMove = parseInt(e[1]);
    fractional = e[2] === "true";
  }

  if (ignoreMinMove) {
    minMove = 1;
  }

  return new PriceFormatter(
    priceScale,
    minMove,
    fractional,
    minMove2,
    variableMinTick,
    ignoreMinMove
  );
}

function hasVolume(e) {
  return e && e.visible_plots_set !== undefined
    ? e.visible_plots_set === "ohlcv"
    : !e.has_no_volume;
}

function isMeasureUnitSymbol(e) {
  return e !== null && e.measure === "unit" && pe(e) !== null;
}

export function getStudySymbolExchange(e) {
  return isEconomicSymbol(e) && e.source
    ? e.source
    : e.exchange && e.exchange.length !== 0
    ? e.exchange
    : undefined;
}

function isCloseBasedSymbol(isSingleValueBased) {
  return isSingleValueBased === "c";
}

function isConvertedToOtherCurrency(e) {
  return e !== null && U(e) && e.original_currency_id !== e.currency_id;
}

function isConvertedToOtherUnit(e) {
  return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
}

function isCryptoSymbol(e) {
  return (
    (e &&
      (e.typespecs.includes("crypto") ||
        e.type === "crypto" ||
        e.type === "bitcoin")) ||
    false
  );
}

function isEconomicSymbol(e) {
  return (
    e !== null &&
    (e.type === "forex" ||
      isCFDSymbol(e.type, e.typespecs) ||
      isCryptoSymbol(e))
  );
}

function isFutureContinuousSymbolWithBackajustment(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    Boolean(
      e.has_backadjustment &&
        (e.typespecs === null || e.typespecs.includes("continuous"))
    )
  );
}

function isFuturesContractSymbol(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    (e.typespecs === null || !e.typespecs.includes("continuous"))
  );
}

function isMeasureUnitSymbol(e) {
  return e !== null && e.measure === "unit" && pe(e) !== null;
}

function measureUnitId(e) {
  return e !== null ? e.value_unit_id || null : null;
}

function symbolBaseCurrency(e) {
  return e !== null ? e.base_currency_id || null : null;
}

function isConvertedToOtherCurrency(e) {
  return e !== null && U(e) && e.original_currency_id !== e.currency_id;
}

function isConvertedToOtherUnit(e) {
  return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
}

function isCryptoSymbol(e) {
  return (
    (e &&
      (e.typespecs.includes("crypto") ||
        e.type === "crypto" ||
        e.type === "bitcoin")) ||
    false
  );
}

function isEconomicSymbol(e) {
  return (
    e !== null &&
    (e.type === "forex" ||
      isCFDSymbol(e.type, e.typespecs) ||
      isCryptoSymbol(e))
  );
}

function isFutureContinuousSymbolWithBackajustment(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    Boolean(
      e.has_backadjustment &&
        (e.typespecs === null || e.typespecs.includes("continuous"))
    )
  );
}

function isFuturesContractSymbol(e) {
  return (
    e !== null &&
    e.type === "futures" &&
    (e.typespecs === null || !e.typespecs.includes("continuous"))
  );
}

export function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
  let name =
    symbolInfo &&
    (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
  if (chartingLibrarySingleSymbolRequest && ticker) {
    name = ticker;
  }
  if (uppercaseInstrumentNames && name) {
    name = name.toUpperCase();
  }
  return name;
}

function symbolTitle(symbol, includeExchange, exchangeLabel) {
  return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
    ? symbol.name
    : `${symbol.name}, ${exchangeLabel}`;
}

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function isMeasureUnitSymbol(e) {
//   return e !== null && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// // function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
// //   let name =
// //     symbolInfo &&
// //     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
// //   if (chartingLibrarySingleSymbolRequest && ticker) {
// //     name = ticker;
// //   }
// //   if (uppercaseInstrumentNames && name) {
// //     name = name.toUpperCase();
// //   }
// //   return name;
// // }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// // function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
// //   let name =
// //     symbolInfo &&
// //     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
// //   if (chartingLibrarySingleSymbolRequest && ticker) {
// //     name = ticker;
// //   }
// //   if (uppercaseInstrumentNames && name) {
// //     name = name.toUpperCase();
// //   }
// //   return name;
// // }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isMeasureUnitSymbol(e) {
//   return e !== null && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// // function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
// //   let name =
// //     symbolInfo &&
// //     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
// //   if (chartingLibrarySingleSymbolRequest && ticker) {
// //     name = ticker;
// //   }
// //   if (uppercaseInstrumentNames && name) {
// //     name = name.toUpperCase();
// //   }
// //   return name;
// // }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// // function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
// //   let name =
// //     symbolInfo &&
// //     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
// //   if (chartingLibrarySingleSymbolRequest && ticker) {
// //     name = ticker;
// //   }
// //   if (uppercaseInstrumentNames && name) {
// //     name = name.toUpperCase();
// //   }
// //   return name;
// // }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
//   let name =
//     symbolInfo &&
//     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
//   if (chartingLibrarySingleSymbolRequest && ticker) {
//     name = ticker;
//   }
//   if (uppercaseInstrumentNames && name) {
//     name = name.toUpperCase();
//   }
//   return name;
// }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTree;

//   AndPriceScaleExchangeLabel ? symbol.name : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
//   let name =
//     symbolInfo &&
//     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
//   if (chartingLibrarySingleSymbolRequest && ticker) {
//     name = ticker;
//   }
//   if (uppercaseInstrumentNames && name) {
//     name = name.toUpperCase();
//   }
//   return name;
// }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isRegularSessionId(e) {
//   return e === "regular" || e === "us_regular";
// }

// function isCloseBasedSymbol(e) {
//   return e === "c";
// }

// function isMeasureUnitSymbol(e) {
//   return e && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
//   let name =
//     symbolInfo &&
//     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
//   if (chartingLibrarySingleSymbolRequest && ticker) {
//     name = ticker;
//   }
//   if (uppercaseInstrumentNames && name) {
//     name = name.toUpperCase();
//   }
//   return name;
// }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isMeasureUnitSymbol(e) {
//   return e !== null && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
//   let name =
//     symbolInfo &&
//     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
//   if (chartingLibrarySingleSymbolRequest && ticker) {
//     name = ticker;
//   }
//   if (uppercaseInstrumentNames && name) {
//     name = name.toUpperCase();
//   }
//   return name;
// }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }

// function getSeriesPriceFormattingState(
//   e,
//   format = "default",
//   ignoreMinMove = false
// ) {
//   let priceScale = 100;
//   let minMove = 1;
//   let fractional = false;
//   let minMove2;
//   let variableMinTick;

//   if (format === "default" && e != null) {
//     const t = e.formatter || e.format;
//     if (t === "volume") {
//       return new VolumeFormatter(2);
//     } else if (t === "percent") {
//       return new PercentageFormatter(e.pricescale);
//     }
//   }

//   if (format === "default") {
//     if (e != null) {
//       priceScale = e.pricescale;
//       minMove = e.minmov;
//       fractional = e.fractional;
//       minMove2 = e.minmove2;
//       variableMinTick = e.variable_tick_size || undefined;
//     }
//   } else {
//     let e = format.split(",");
//     if (e.length !== 3) {
//       e = ["100", "1", "false"];
//     }
//     priceScale = parseInt(e[0]);
//     minMove = parseInt(e[1]);
//     fractional = e[2] === "true";
//   }

//   if (ignoreMinMove) {
//     minMove = 1;
//   }

//   return new PriceFormatter(
//     priceScale,
//     minMove,
//     fractional,
//     minMove2,
//     variableMinTick,
//     ignoreMinMove
//   );
// }

// function hasVolume(e) {
//   return e && e.visible_plots_set !== undefined
//     ? e.visible_plots_set === "ohlcv"
//     : !e.has_no_volume;
// }

// function isMeasureUnitSymbol(e) {
//   return e !== null && e.measure === "unit" && measureUnitId(e) !== null;
// }

// function measureUnitId(e) {
//   return (e && e.value_unit_id) || null;
// }

// function symbolBaseCurrency(e) {
//   return (e && e.base_currency_id) || null;
// }

// function isConvertedToOtherCurrency(e) {
//   return e !== null && U(e) && e.original_currency_id !== e.currency_id;
// }

// function isConvertedToOtherUnit(e) {
//   return e !== null && Y(e) && e.original_unit_id !== e.unit_id;
// }

// function isCryptoSymbol(e) {
//   return (
//     (e &&
//       (e.typespecs.includes("crypto") ||
//         e.type === "crypto" ||
//         e.type === "bitcoin")) ||
//     false
//   );
// }

// function isEconomicSymbol(e) {
//   return (
//     e !== null &&
//     (e.type === "forex" ||
//       isCFDSymbol(e.type, e.typespecs) ||
//       isCryptoSymbol(e))
//   );
// }

// function isFutureContinuousSymbolWithBackajustment(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     Boolean(
//       e.has_backadjustment &&
//         (e.typespecs === null || e.typespecs.includes("continuous"))
//     )
//   );
// }

// function isFuturesContractSymbol(e) {
//   return (
//     e !== null &&
//     e.type === "futures" &&
//     (e.typespecs === null || !e.typespecs.includes("continuous"))
//   );
// }

// function extractSymbolNameFromSymbolInfo(symbolInfo, ticker) {
//   let name =
//     symbolInfo &&
//     (symbolInfo.pro_name || symbolInfo.full_name || symbolInfo.name);
//   if (chartingLibrarySingleSymbolRequest && ticker) {
//     name = ticker;
//   }
//   if (uppercaseInstrumentNames && name) {
//     name = name.toUpperCase();
//   }
//   return name;
// }

// function symbolTitle(symbol, includeExchange, exchangeLabel) {
//   return includeExchange || hideObjectTreeAndPriceScaleExchangeLabel
//     ? symbol.name
//     : `${symbol.name}, ${exchangeLabel}`;
// }
