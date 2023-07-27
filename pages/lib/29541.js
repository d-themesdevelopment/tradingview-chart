import { PriceRange } from "./PriceRange";

function scaleRatio(e, t) {
  if (t.isLog() || e.isEmpty() || t.isEmpty()) return null;

  const internalHeight = t.internalHeight();
  if (internalHeight === 0) return null;

  const priceRange = t.priceRange();
  if (priceRange === null || priceRange.isEmpty()) return null;

  const barSpacing = e.getValidBarSpacing();
  const priceRangeLength = priceRange.length();

  return barSpacing / Math.max(1e-10, internalHeight / priceRangeLength);
}

function priceRangeByScaleRatio(e, t, i) {
  if (e.isLog() || i === null || e.isEmpty()) return null;

  const priceRange = e.priceRange();
  if (priceRange === null || priceRange.isEmpty()) return null;

  const internalHeight = e.internalHeight();
  const targetHeight = internalHeight / (t / i);
  const priceRangeLength = priceRange.length();

  if (targetHeight === priceRangeLength) return priceRange;

  const delta = (targetHeight - priceRangeLength) / 2;
  return new PriceRange(
    priceRange.minValue() - delta,
    priceRange.maxValue() + delta
  );
}

function barSpacingByScaleRatio(e, t) {
  if (e.isLog() || t === null || e.isEmpty()) return null;

  const priceRange = e.priceRange();
  if (priceRange === null) return null;

  const priceRangeLength = priceRange.length();
  const internalHeight = e.internalHeight();

  return (internalHeight / priceRangeLength) * t;
}

export { scaleRatio, priceRangeByScaleRatio, barSpacingByScaleRatio };
