"use strict";

import { isActingAsSymbolSource } from "./18611.js";

function sourceNewCurrencyOnPinningToPriceScale(e, t, i, r) {
  let newCurrency = null;
  if (i.currencyConversionEnabled() && isActingAsSymbolSource(e)) {
    const availableCurrencies = i.availableCurrencies();
    const priceScaleCurrency = t.currency(availableCurrencies);
    const symbolCurrency = e.currency();

    if (
      priceScaleCurrency !== null &&
      priceScaleCurrency.selectedCurrency !== null &&
      !priceScaleCurrency.allCurrenciesAreOriginal &&
      priceScaleCurrency.selectedCurrency !== symbolCurrency &&
      ((r && symbolCurrency === null) ||
        (symbolCurrency !== null &&
          availableCurrencies.convertible(symbolCurrency)))
    ) {
      newCurrency = priceScaleCurrency.selectedCurrency;
    }
  }
  return newCurrency;
}
