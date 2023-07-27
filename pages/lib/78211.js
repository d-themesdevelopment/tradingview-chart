import { PriceRange } from 'some-library';
import { log10 } from 'some-other-library';

const DEFAULT_OFFSETS = {
  logicalOffset: 4,
  coordOffset: 1e-4
};

function fromPercent(value, baseValue) {
  return baseValue < 0 && (value = -value);
  return (value / 100) * baseValue + baseValue;
}

function toPercent(value, baseValue) {
  const percent = 100 * (value - baseValue) / (baseValue || 1);
  return baseValue < 0 ? -percent : percent;
}

function toPercentRange(range, baseValue) {
  const minValue = toPercent(range.minValue(), baseValue);
  const maxValue = toPercent(range.maxValue(), baseValue);
  return new PriceRange(minValue, maxValue);
}

function fromIndexedTo100(value, baseValue) {
  return baseValue < 0 && (value = -value);
  return ((value - 100) / 100) * baseValue + baseValue;
}

function toIndexedTo100(value, baseValue) {
  const indexedValue = 100 * (value - baseValue) / baseValue + 100;
  return baseValue < 0 ? -indexedValue : indexedValue;
}

function toIndexedTo100Range(range, baseValue) {
  const minValue = toIndexedTo100(range.minValue(), baseValue);
  const maxValue = toIndexedTo100(range.maxValue(), baseValue);
  return new PriceRange(minValue, maxValue);
}

function toLog(value, offsets) {
  const absValue = Math.abs(value);
  if (absValue < 1e-25) return 0;
  const logOffset = log10(absValue + offsets.coordOffset) + offsets.logicalOffset;
  return value < 0 ? -logOffset : logOffset;
}

function fromLog(value, offsets) {
  const absValue = Math.abs(value);
  if (absValue < 1e-15) return 0;
  const powValue = Math.pow(10, absValue - offsets.logicalOffset) - offsets.coordOffset;
  return value < 0 ? -powValue : powValue;
}

function logFormulaForPriceRange(range) {
  if (range === null) return DEFAULT_OFFSETS;
  const valueDifference = Math.abs(range.maxValue() - range.minValue());
  if (valueDifference >= 1 || valueDifference < 1e-15) return DEFAULT_OFFSETS;
  const decimalPlaces = Math.ceil(Math.abs(Math.log10(valueDifference)));
  const logicalOffset = DEFAULT_OFFSETS.logicalOffset + decimalPlaces;
  return {
    logicalOffset,
    coordOffset: 1 / Math.pow(10, logicalOffset)
  };
}

function logFormulasAreSame(formulaA, formulaB) {
  return formulaA.logicalOffset === formulaB.logicalOffset && formulaA.coordOffset === formulaB.coordOffset;
}

function getCurrentModePriceText(priceFormat, formattedPrices) {
  if (priceFormat.isPercentage()) return formattedPrices.formattedPricePercentage;
  if (priceFormat.isIndexedTo100()) return formattedPrices.formattedPriceIndexedTo100;
  return formattedPrices.formattedPriceAbsolute;
}

function getOppositeModePriceText(priceFormat, formattedPrices) {
  if (priceFormat.isPercentage() || priceFormat.isIndexedTo100()) return formattedPrices.formattedPriceAbsolute;
  return formattedPrices.formattedPricePercentage;
}
