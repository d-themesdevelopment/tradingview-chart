import { observable } from "mobx";
// import { spawn } from '<path_to_spawn_module>';
import { readonly } from "<path_to_readonly_module>";
// import { clamp } from "clamp";

export function combine(e, t, ...args) {
  return combineWithFilteredUpdate(e, () => true, ...args);
}

export function combineWithFilteredUpdate(e, t, ...args) {
  const s = (...args) => e(...args.map((arg) => arg.value()));
  const r = new (observable())(s(...args));
  const update = () => {
    if (t(...args.map((arg) => arg.value()))) {
      r.setValue(s(...args));
    }
  };
  const spawnedArgs = args.map((arg) => arg.spawn());
  for (const arg of spawnedArgs) {
    arg.subscribe(update);
  }
  return readonly(r).spawn(() => {
    spawnedArgs.forEach((arg) => arg.destroy());
  });
}

import { enabled } from "<path_to_enabled_module>";
import {
  isConvertedToOtherUnit,
  isConvertedToOtherCurrency,
  symbolUnit,
  symbolCurrency,
} from "<path_to_conversion_module>";

const uppercaseInstrumentNamesEnabled = enabled("uppercase_instrument_names");

export function areEqualSymbols(symbolA, symbolB) {
  return symbolA === undefined
    ? symbolB === undefined
    : symbolB !== undefined &&
        (uppercaseInstrumentNamesEnabled
          ? symbolA.toUpperCase() === symbolB.toUpperCase()
          : symbolA === symbolB);
}

export function currenciesAreSame(currencyA, symbolB) {
  return currencyA === null
    ? !isConvertedToOtherCurrency(symbolB)
    : currencyA === symbolCurrency(symbolB);
}

export function symbolSameAsCurrent(symbol, current) {
  if (current === null) {
    return false;
  }
  if (current) {
    if (
      areEqualSymbols(current.full_name, symbol) ||
      areEqualSymbols(current.pro_name, symbol)
    ) {
      return true;
    }
    if (areEqualSymbols(current.ticker, symbol)) {
      return true;
    }
    if (
      current.aliases &&
      current.aliases.some((alias) => areEqualSymbols(symbol, alias))
    ) {
      return true;
    }
    if (
      current.alternatives &&
      current.alternatives.some((alternative) =>
        areEqualSymbols(symbol, alternative)
      )
    ) {
      return true;
    }
    if (
      symbol.indexOf("FRA:") === 0 &&
      areEqualSymbols(current.pro_name, symbol.replace("FRA:", "FWB:"))
    ) {
      return true;
    }
  }
  return false;
}

export function unitsAreSame(unit, symbol, current) {
  return (
    (unit === null && !isConvertedToOtherUnit(symbol, current)) ||
    unit === symbolUnit(symbol, current)
  );
}
