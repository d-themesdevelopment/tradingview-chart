







import { isActingAsSymbolSource } from '<path_to_symbolSource_module>';
import { isPriceSourceStyle } from '<path_to_priceSourceStyle_module>';

export function shouldBeFormattedAsPercent(series) {
  const priceScale = series.priceScale();
  return !(priceScale === null || !priceScale.isPercentage()) && !(isActingAsSymbolSource(series) && isPriceSourceStyle(series.style()));
}

export function shouldBeFormattedAsIndexedTo100(series) {
  const priceScale = series.priceScale();
  return !(priceScale === null || !priceScale.isIndexedTo100()) && !(isActingAsSymbolSource(series) && isPriceSourceStyle(series.style()));
}

export function getPriceValueFormatterForSource(series) {
  const priceScale = series.priceScale();

  if (shouldBeFormattedAsIndexedTo100(series) && priceScale !== null) {
    return (value) => {
      const baseValue = priceScale.formatPriceIndexedTo100(value, series.firstValue() ?? 100);
      return baseValue;
    };
  }

  if (shouldBeFormattedAsPercent(series) && priceScale !== null) {
    return (value) => {
      const baseValue = priceScale.formatPricePercentage(value, series.firstValue() ?? 100);
      return baseValue;
    };
  }

  const formatter = series.formatter();
  return formatter.format.bind(formatter);
}