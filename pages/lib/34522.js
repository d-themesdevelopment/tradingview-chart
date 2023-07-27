import { assert } from "./assertions"; // Replace 'some-module' with the actual module path
import { ensureTimePointIndex } from "./1115"; // Replace 'another-module' with the actual module path

export function materializeHorizLine(line, bars) {
  if (line.startIndex >= bars.length || line.endIndex >= bars.length)
    return null;
  const startBarIndex = bars[line.startIndex];
  const endBarIndex = bars[line.endIndex];
  if (
    startBarIndex === INVALID_TIME_POINT_INDEX ||
    endBarIndex === INVALID_TIME_POINT_INDEX
  ) {
    return null;
  }
  assert(startBarIndex <= endBarIndex, "startIndex should not exceed endIndex");
  return {
    startIndex: startBarIndex,
    endIndex: endBarIndex,
    level: line.level,
    extendLeft: line.extendLeft,
    extendRight: line.extendRight,
  };
}

export function dematerializeHorizLine(line, id, indexLookup) {
  const startIndex = ensureTimePointIndex(indexLookup.indexOf(line.startIndex));
  const endIndex = ensureTimePointIndex(indexLookup.indexOf(line.endIndex));
  return {
    id: id,
    ...line,
    startIndex: startIndex,
    endIndex: endIndex,
  };
}

export function isHorizLineInBarsRange(line, range) {
  const minIndex = Math.min(line.startIndex, line.endIndex);
  const maxIndex = Math.max(line.startIndex, line.endIndex);
  if (
    range.contains(minIndex) ||
    range.contains(maxIndex) ||
    (minIndex < range.firstBar() && maxIndex > range.lastBar())
  ) {
    return true;
  }
  const extendLeft =
    line.startIndex < line.endIndex ? line.extendLeft : line.extendRight;
  const extendRight =
    line.startIndex < line.endIndex ? line.extendRight : line.extendLeft;
  return (
    (maxIndex < range.firstBar() && extendRight) ||
    (minIndex > range.lastBar() && extendLeft)
  );
}
