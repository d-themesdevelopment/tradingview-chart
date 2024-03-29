"use strict";
import {LineStyle} from ("./79849.js");
import { LINESTYLE_SOLID } from ("./95586.js");

function fillRectWithBorder(e, t, i, r, n, o, a, l, c, h, d, u, p, _, m) {
  const g = h ? 0 : t,
      f = d ? p : r;
  if (void 0 !== o && (e.fillStyle = o, e.fillRect(g, i, f - g + _, n - i)), void 0 !== a && l > 0) {
      if (e.beginPath(), v(e, c), void 0 !== m) {
          const t = m.map((e => e * l));
          e.setLineDash(t)
      }
      let o = point(0, 0),
          h = point(0, 0),
          d = point(0, 0),
          p = point(0, 0);
      switch (u) {
          case "outer": {
              const e = .5 * l;
              d = point(0, e), p = point(0, e), o = point(e, -l), h = point(e, -l);
              break
          }
          case "center": {
              const e = l % 2 ? .5 : 0,
                  t = l % 2 ? .5 : _;
              d = point(.5 * l - e, -e), p = point(t + .5 * l, -e), o = point(-e, e + .5 * l), h = point(t, e + .5 * l);
              break
          }
          case "inner": {
              const e = .5 * l;
              d = point(0, -e), p = point(1, -e), o = point(-e, l), h = point(1 - e, l);
              break
          }
      }
      e.lineWidth = l, e.strokeStyle = a, e.moveTo(g - d.x, i - d.y), e.lineTo(f + p.x, i - p.y), e.moveTo(r + h.x, i + h.y), e.lineTo(r + h.x, n - h.y), e.moveTo(g - d.x, n + d.y), e.lineTo(f + p.x, n + p.y), e.moveTo(t - o.x, i + o.y), e.lineTo(t - o.x, n - o.y), e.stroke()
  }
}

function clearRectWithGradient(
  context,
  x,
  y,
  width,
  height,
  startColor,
  endColor
) {
  context.save();
  context.globalCompositeOperation = "copy";
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  context.fillStyle = gradient;
  context.fillRect(x, y, width, height);
  context.restore();
}

function fillRectInnerBorder(
  context,
  x,
  y,
  width,
  height,
  radius,
  borderWidth
) {
  context.fillRect(x + borderWidth, y, width - 2 * borderWidth, borderWidth);
  context.fillRect(
    x + borderWidth,
    y + height - borderWidth,
    width - 2 * borderWidth,
    borderWidth
  );
  context.fillRect(x, y, borderWidth, height);
  context.fillRect(x + width - borderWidth, y, borderWidth, height);
}

function addHorizontalLine(context, x1, y, x2) {
  const offset = context.lineWidth % 2 ? 0.5 : 0;
  context.moveTo(x1, y + offset);
  context.lineTo(x2, y + offset);
}

export function drawHorizontalLine(context, x1, y, x2) {
  context.beginPath();
  addHorizontalLine(context, x1, y, x2);
  context.stroke();
}

function addVerticalLine(context, x, y1, y2) {
  const offset = context.lineWidth % 2 ? 0.5 : 0;
  context.moveTo(x + offset, y1);
  context.lineTo(x + offset, y2);
}

function drawVerticalLine(context, x, y1, y2) {
  context.beginPath();
  addVerticalLine(context, x, y1, y2);
  context.stroke();
}

function offsetValue(value, offset) {
  return Array.isArray(value)
    ? value.map((v) => (v === 0 ? v : v + offset))
    : value + offset;
}

export function drawRoundRect(context, x, y, width, height, radius, closePath) {
  let topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius;
  if (Array.isArray(radius)) {
    if (radius.length === 2) {
      const [topRadius, bottomRadius] = radius;
      topLeftRadius = topRadius;
      topRightRadius = topRadius;
      bottomLeftRadius = bottomRadius;
      bottomRightRadius = bottomRadius;
    } else {
      if (radius.length !== 4) {
        throw new Error(
          "Wrong border radius - it should be like css border radius"
        );
      }
      [topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius] =
        radius;
    }
  } else {
    const r = Math.max(0, radius);
    topLeftRadius = r;
    topRightRadius = r;
    bottomLeftRadius = r;
    bottomRightRadius = r;
  }
  if (!closePath) {
    context.beginPath();
  }
  context.moveTo(x + topLeftRadius, y);
  context.lineTo(x + width - topRightRadius, y);
  if (topRightRadius !== 0) {
    context.arcTo(x + width, y, x + width, y + topRightRadius, topRightRadius);
  }
  context.lineTo(x + width, y + height - bottomRightRadius);
  if (bottomRightRadius !== 0) {
    context.arcTo(
      x + width,
      y + height,
      x + width - bottomRightRadius,
      y + height,
      bottomRightRadius
    );
  }
  context.lineTo(x + bottomLeftRadius, y + height);
  if (bottomLeftRadius !== 0) {
    context.arcTo(
      x,
      y + height,
      x,
      y + height - bottomLeftRadius,
      bottomLeftRadius
    );
  }
  context.lineTo(x, y + topLeftRadius);
  if (topLeftRadius !== 0) {
    context.arcTo(x, y, x + topLeftRadius, y, topLeftRadius);
  }
}

function drawRoundRectWithInnerBorder(
  context,
  x,
  y,
  width,
  height,
  radius,
  fillColor,
  borderColor = "",
  borderWidth = 0,
  lineStyle = LINESTYLE_SOLID
) {
  if (!borderWidth || !borderColor || borderColor === fillColor) {
    drawRoundRect(context, x, y, width, height, radius);
    context.fillStyle = fillColor;
    context.fill();
    context.restore();
    return;
  }
  const halfBorderWidth = borderWidth / 2;
  if (fillColor !== "transparent") {
    const shouldApplyBorder =
      borderColor !== "transparent" && lineStyle !== LINESTYLE_SOLID;
    drawRoundRect(
      context,
      shouldApplyBorder ? x : x + borderWidth,
      shouldApplyBorder ? y : y + borderWidth,
      shouldApplyBorder ? width : width - 2 * borderWidth,
      shouldApplyBorder ? height : height - 2 * borderWidth,
      radius - halfBorderWidth
    );
    context.fillStyle = fillColor;
    context.fill();
  }
  if (borderColor !== "transparent") {
    drawRoundRect(
      context,
      x + halfBorderWidth,
      y + halfBorderWidth,
      width - borderWidth,
      height - borderWidth,
      radius - halfBorderWidth
    );
    context.lineWidth = borderWidth;
    context.strokeStyle = borderColor;
    setLineStyle(context, lineStyle);
    context.closePath();
    context.stroke();
  }
  context.restore();
}

function createCircle(context, x, y, radius) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.closePath();
}

function drawPoly(context, points, fill) {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  for (const point of points) {
    context.lineTo(point.x, point.y);
  }
  context.closePath();
  context.stroke();
  if (fill) {
    context.fill();
  }
}

export function setLineStyle(context, style) {
  let dashArray = [];
  if (style !== LINESTYLE_SOLID) {
    dashArray = [
      [context.lineWidth, 2 * context.lineWidth],
      [5 * context.lineWidth, 6 * context.lineWidth],
      [6 * context.lineWidth, 6 * context.lineWidth],
      [context.lineWidth, 4 * context.lineWidth],
      [2 * context.lineWidth, context.lineWidth],
    ][style - 1];
  }
  context.setLineDash(dashArray);
}

function addLine(context, x1, y1, x2, y2) {
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
}

function drawLine(context, x1, y1, x2, y2) {
  if (isFinite(x1) && isFinite(x2) && isFinite(y1) && isFinite(y2)) {
    context.beginPath();
    addLine(context, x1, y1, x2, y2);
    context.stroke();
  }
}

