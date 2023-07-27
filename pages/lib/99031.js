"use strict";

const { ensureNotNull, ensureDefined } = require(50151);
const { distanceToSegment } = require(4652);
const { HitTestResult, HitTarget } = require(73436);
const { extendAndClipLineSegment, addVerticalLineToPath, addHorizontalLineToPath, addLineToPath } = require(68441);
const { setLineStyle } = require(74359);
const { getArrowPoints } = require(18807);
const { LineEnd, LINESTYLE_SOLID } = require(79849);

function drawCircle(point, context, radius, style, ratio) {
  context.save();
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(point.x * ratio, point.y * ratio, radius * ratio, 0, 2 * Math.PI, false);
  context.fill();
  if (style.strokeWidth) {
    context.lineWidth = style.strokeWidth;
    context.stroke();
  }
  context.restore();
}

function drawArrow(start, end, context, style, ratio, reverse = false) {
  if (start.subtract(end).length() < 1) return;
  
  const arrowPoints = getArrowPoints(start, end, style, reverse, true).slice(0, 2);
  let prevPoint = null;

  for (let i = 0; i < arrowPoints.length; ++i) {
    const startPoint = arrowPoints[i][0];
    const endPoint = arrowPoints[i][1];
    
    if (prevPoint === null || prevPoint.subtract(startPoint).length() > 1) {
      context.moveTo(startPoint.x * ratio, startPoint.y * ratio);
    }
    
    context.lineTo(endPoint.x * ratio, endPoint.y * ratio);
    prevPoint = endPoint;
  }
}

class TrendLineRenderer {
  constructor() {
    this._data = null;
    this._hittest = new HitTestResult(HitTarget.MovePoint);
  }

  setData(data) {
    this._data = data;
  }

  setHitTest(hittest) {
    this._hittest = hittest;
  }

  draw(context, options) {
    const data = this._data;

    if (data === null) return;
    if ("points" in data && data.points.length < 2) return;

    const ratio = options.pixelRatio;

    if (data.excludeBoundaries !== undefined) {
      context.save();
      addExclusionArea(context, options, data.excludeBoundaries);
    }

    context.lineCap = data.linestyle === LINESTYLE_SOLID ? "round" : "butt";
    context.lineJoin = "round";
    context.strokeStyle = data.color;
    context.lineWidth = Math.max(1, Math.floor(data.linewidth * ratio));
    setLineStyle(context, data.linestyle);

    const startPoint = data.points[0];
    const endPoint = data.points[1];

    let endPoints = [];

    context.beginPath();
    if (data.overlayLineEndings) {
      endPoints = [startPoint.clone(), endPoint.clone()];
    } else {
      this._drawEnds(context, [startPoint, endPoint], data.linewidth, ratio);
    }

    const clippedSegment = this._extendAndClipLineSegment(startPoint, endPoint, options);
    
    if (clippedSegment !== null && data.linewidth > 0) {
      if (clippedSegment[0].x === clippedSegment[1].x) {
        addVerticalLineToPath(context, Math.round(clippedSegment[0].x * ratio), clippedSegment[0].y * ratio, clippedSegment[1].y * ratio);
      } else if (clippedSegment[0].y === clippedSegment[1].y) {
        addHorizontalLineToPath(context, Math.round(clippedSegment[0].y * ratio), clippedSegment[0].x * ratio, clippedSegment[1].x * ratio);
      } else {
        addLineToPath(context, clippedSegment[0].x * ratio, clippedSegment[0].y * ratio, clippedSegment[1].x * ratio, clippedSegment[1].y * ratio);
      }
    }

    if (data.overlayLineEndings) {
      this._drawEnds(context, endPoints, data.linewidth, ratio);
    }

    context.stroke();

    if (data.excludeBoundaries !== undefined) {
      context.restore();
    }
  }

  hitTest(point, options) {
    const data = this._data;

    if (data === null) return null;
    if ("points" in data && data.points.length < 2) return null;

    const tolerance = ensureDefined(options).interactionTolerance().line;
    const startPoint = data.points[0];
    const endPoint = data.points[1];
    const clippedSegment = this._extendAndClipLineSegment(startPoint, endPoint, options);

    if (clippedSegment !== null) {
      const distance = distanceToSegment(clippedSegment[0], clippedSegment[1], point).distance;
      if (distance <= tolerance) return this._hittest;
    }

    return null;
  }

  _extendAndClipLineSegment(start, end, options) {
    const data = ensureNotNull(this._data);
    return extendAndClipLineSegment(start, end, options.cssWidth, options.cssHeight, data.extendleft, data.extendright);
  }

  _drawEnds(context, points, linewidth, ratio) {
    const startPoint = points[0];
    const endPoint = points[1];
    const data = ensureNotNull(this._data);

    switch (data.leftend) {
      case LineEnd.Arrow:
        drawArrow(endPoint, startPoint, context, linewidth, ratio);
        break;
      case LineEnd.Circle:
        drawCircle(startPoint, context, linewidth, ensureDefined(data.endstyle), ratio);
        break;
    }

    switch (data.rightend) {
      case LineEnd.Arrow:
        drawArrow(startPoint, endPoint, context, linewidth, ratio);
        break;
      case LineEnd.Circle:
        drawCircle(endPoint, context, linewidth, ensureDefined(data.endstyle), ratio);
        break;
    }
  }
}

module.exports = {
  TrendLineRenderer,
  drawArrow
};
