import { equalPoints, Point, lineThroughPoints, box, lineSegment } from 'geometryUtils';
import { intersectLineAndBox, intersectRayAndBox, intersectLineSegmentAndBox } from 'intersectionUtils';
import { lastMouseOrTouchEventInfo } from 'mouseUtils';
import { setLineStyle } from 'lineUtils';

const lineToolConstants = {
  line: 13,
  minDistanceBetweenPoints: 10,
  series: 14,
  curve: 10,
  anchor: 13,
  esd: 4
};

const seriesConstants = {
  line: 3,
  minDistanceBetweenPoints: 5,
  series: 2,
  curve: 3,
  anchor: 2,
  esd: 0
};

function extendAndClipLineSegment(start, end, minX, minY, maxX, maxY, extendStart, extendEnd) {
  if (equalPoints(start, end)) return null;

  const zeroPoint = new Point(0, 0);
  const containerPoint = new Point(maxX, maxY);

  if (extendEnd) {
    if (extendStart) {
      const intersect = intersectLineAndBox(lineThroughPoints(start, end), box(zeroPoint, containerPoint));
      return Array.isArray(intersect) ? intersect : null;
    } else {
      const intersect = intersectRayAndBox(end, start, box(zeroPoint, containerPoint));
      return (intersect === null || equalPoints(end, intersect)) ? null : lineSegment(end, intersect);
    }
  } else {
    if (extendStart) {
      const intersect = intersectRayAndBox(start, end, box(zeroPoint, containerPoint));
      return (intersect === null || equalPoints(start, intersect)) ? null : lineSegment(start, intersect);
    } else {
      const intersect = intersectLineSegmentAndBox(lineSegment(start, end), box(zeroPoint, containerPoint));
      return Array.isArray(intersect) ? intersect : null;
    }
  }
}

function getArrowPoints(start, end, arrowLength, isFilled, ratio) {
  const halfLength = 0.5 * arrowLength;
  const sqrt2 = Math.sqrt(2);
  const vector = end.subtract(start);
  const direction = vector.normalized();
  let arrowSize = 5 * arrowLength;
  if (isFilled) {
    arrowSize = Math.min(arrowSize, 0.35 * vector.length());
  }
  const offset = 1 * halfLength;
  if (arrowSize * sqrt2 * 0.2 <= offset) return [];

  const scaledVector = direction.scaled(arrowSize);
  const arrowPoint = end.subtract(scaledVector);
  const transposedVector = direction.transposed();
  const scaledOffset = 1 * arrowSize;
  const offsetVector = transposedVector.scaled(scaledOffset);
  const upperPoint = arrowPoint.add(offsetVector);
  const lowerPoint = arrowPoint.subtract(offsetVector);
  const normalizedVector = end.subtract(start).normalized().scaled(halfLength);
  const startPoint = isFilled ? end : end.add(normalizedVector);
  const endPoint = isFilled ? end : end.add(normalizedVector.negated());
  const width = halfLength * (sqrt2 - 1);
  const scaledWidth = transposedVector.scaled(width);
  const middlePoint = startPoint.subtract(offsetVector);
  
  return [
    [upperPoint, startPoint],
    [lowerPoint, endPoint],
    [middlePoint, middlePoint.subtract(offsetVector)],
    [middlePoint, middlePoint.add(offsetVector)]
  ];
}

function optimalBarWidth(width, ratio) {
  return Math.floor(0.3 * width * ratio);
}

function optimalCandlestickWidth(width, ratio) {
  if (width >= 2.5 && width <= 4) return Math.floor(3 * ratio);
  
  const ratioFactor = 1 - 0.2 * Math.atan(Math.max(4, width) - 4) / (0.5 * Math.PI);
  const scaledWidth = Math.floor(width * ratioFactor * ratio);
  const defaultWidth = Math.floor(width * ratio);
  const minScaledWidth = Math.min(scaledWidth, defaultWidth);
  return Math.max(Math.floor(ratio), minScaledWidth);
}

function optimalHiLoWidth(width) {
  return 0.4 * width;
}

function interactionTolerance() {
  const { isTouch } = lastMouseOrTouchEventInfo();
  return isTouch ? lineToolConstants : seriesConstants;
}

function coordinateIsValid(coordinate) {
  return coordinate !== null && !isNaN(coordinate);
}

function setValidLineStyle(context, style) {
  if (typeof style !== 'undefined') {
    setLineStyle(context, style);
  }
}

function fillScaledRadius(radius, scale) {
  const isOdd = Math.max(1, Math.floor(scale)) % 2 ? 0.5 : 0;
  return Math.round(radius * scale) + isOdd;
}

function strokeScaledRadius(radius, scale, isOdd) {
  const isOddScaled = Math.max(1, Math.floor(scale)) % 2 ? 0.5 : 0;
  return Math.round(radius * scale) + (isOdd !== isOddScaled ? 0.5 : 0);
}

export {
  coordinateIsValid,
  extendAndClipLineSegment,
  fillScaledRadius,
  getArrowPoints,
  interactionTolerance,
  optimalBarWidth,
  optimalCandlestickWidth,
  optimalHiLoWidth,
  setValidLineStyle,
  strokeScaledRadius
};