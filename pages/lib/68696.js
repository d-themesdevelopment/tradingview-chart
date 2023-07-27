



import { getLogger } from '<path_to_getLogger_module>';
import { ensureNotNull } from '<path_to_ensureNotNull_module>';

function dematerializeVertLine(vertLine, invalidTimePoints) {
  if (vertLine.index >= invalidTimePoints.length) {
    return null;
  }

  const validIndex = invalidTimePoints[vertLine.index];
  return validIndex === s.INVALID_TIME_POINT_INDEX
    ? null
    : {
        startPrice: vertLine.startPrice,
        endPrice: vertLine.endPrice,
        index: validIndex,
        extendTop: vertLine.extendTop,
        extendBottom: vertLine.extendBottom,
      };
}

function materializeVertLine(vertLine, id, invalidTimePoints) {
  const validIndex = ensureTimePointIndexIndex(invalidTimePoints.indexOf(vertLine.index));
  return {
    id: id,
    ...vertLine,
    index: validIndex,
  };
}

function isVertLineInBarsRange(vertLine, barsRange) {
  return barsRange.contains(vertLine.index);
}

export { dematerializeVertLine, materializeVertLine, isVertLineInBarsRange };