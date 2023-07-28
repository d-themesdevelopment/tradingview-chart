// ! not correct
var s = i(86441);
var r = i(4652);
var n = i(18807);
var o = i(45197);
var a = i(68441);
var l = i(59590);

export class PaneRendererLine extends l.BitmapCoordinatesPaneRenderer {
  constructor(data) {
    super();
    this._data = data;
  }

  hitTest(point) {
    const tolerance =
      o.interactionTolerance().series + this._data.lineWidth / 2;
    let startIndex =
      null !== this._data.visibleItemsRange?.startItemIndex
        ? this._data.visibleItemsRange.startItemIndex
        : 0;
    let endIndex =
      (null !== this._data.visibleItemsRange?.endItemIndex
        ? this._data.visibleItemsRange.endItemIndex
        : this._data.items.length) - 1;

    while (endIndex - startIndex > 2) {
      const middleIndex = Math.round((endIndex + startIndex) / 2);
      if (this._data.items[middleIndex].x <= point.x) {
        startIndex = middleIndex;
      } else {
        endIndex = middleIndex;
      }
    }

    startIndex = Math.max(1, startIndex - 1);
    endIndex = Math.min(this._data.items.length - 1, endIndex + 1);

    for (let i = startIndex; i <= endIndex; ++i) {
      const prevPoint = this._data.items[i - 1];
      const currentPoint = this._data.items[i];
      const startX = prevPoint.x;
      const endX = currentPoint.x;

      if (
        r.distanceToSegment(
          new s.Point(startX, prevPoint.y),
          new s.Point(endX, currentPoint.y),
          new s.Point(point.x, point.y)
        ).distance <= tolerance
      ) {
        return this._data.hittest
          ? this._data.hittest
          : new n.HitTestResult(n.HitTarget.Regular);
      }
    }

    return null;
  }

  _drawImpl(context) {
    const {
      context: ctx,
      horizontalPixelRatio: hRatio,
      verticalPixelRatio: vRatio,
    } = context;
    ctx.scale(hRatio, vRatio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this._data.lineColor;
    ctx.fillStyle = this._data.lineColor;
    ctx.lineWidth = this._data.lineWidth;
    a.setLineStyle(ctx, this._data.lineStyle);
    o.setValidLineStyle(ctx, this._data.lineStyle);

    if (this._data.simpleMode) {
      this._drawSimpleMode(ctx, hRatio, vRatio);
    } else {
      this._drawLines(ctx);
    }
  }

  _drawSimpleMode(ctx, hRatio, vRatio) {
    ctx.beginPath();
    this._walkLine(ctx, this._data.items, false, NaN);
    ctx.stroke();

    const barSpacing = 0.25 * this._data.barSpacing;
    if (
      this._data.withMarkers &&
      2 * this._data.lineWidth + 2 < this._data.barSpacing
    ) {
      ctx.scale(1 / hRatio, 1 / vRatio);

      const halfPixelOffset = (Math.max(1, Math.floor(hRatio)) % 2) / 2;
      const markerRadius = this._data.lineWidth * vRatio + halfPixelOffset;
      const fullCircle = 2 * Math.PI;

      ctx.beginPath();
      const startIndex =
        null !== this._data.visibleItemsRange?.startItemIndex
          ? this._data.visibleItemsRange.startItemIndex
          : 0;
      for (
        let i =
          (null !== this._data.visibleItemsRange?.endItemIndex
            ? this._data.visibleItemsRange.endItemIndex
            : this._data.items.length) -
          1 +
          1;
        i-- >= startIndex;

      ) {
        const item = this._data.items[i];
        if (item) {
          const x = Math.round(item.x * hRatio) + halfPixelOffset;
          const y = item.y * vRatio;
          ctx.moveTo(x, y);
          ctx.arc(x, y, markerRadius, 0, fullCircle);
        }
      }
      ctx.fill();
    }
  }

  _walkLine(ctx, items, isGap, skipCheck) {
    if (!items) return;

    const halfBarSpacing = 0.25 * this._data.barSpacing;
    let prevBar, currentBar, nextBar;

    const isValid = o.coordinateIsValid;
    const startIndex = isGap
      ? 0
      : null !== this._data.visibleItemsRange?.startItemIndex
      ? this._data.visibleItemsRange.startItemIndex
      : 0;
    const endIndex = isGap
      ? items.length - 1
      : Math.min(
          (null !== this._data.visibleItemsRange?.endItemIndex
            ? this._data.visibleItemsRange.endItemIndex
            : items.length) - 1,
          items.length - 1
        );

    for (let i = startIndex; i <= endIndex; i++) {
      const currentItem = items[i];
      if (isValid(currentItem.y)) {
        currentBar = currentItem;
        prevBar = i;
        break;
      }
    }

    if (prevBar !== undefined && currentBar !== undefined) {
      for (let i = prevBar; i <= endIndex; i++) {
        nextBar = items[i];
        const x = Math.round(nextBar.x);

        if (isValid(nextBar.y)) {
          if (currentBar && isValid(currentBar.y)) {
            ctx.lineTo(x, nextBar.y);
            if (isGap && !isValid(nextBar.y)) {
              ctx.lineTo(x, skipCheck);
            }
          } else if (nextBar && isValid(nextBar.y)) {
            if (isGap) {
              if (i !== prevBar) {
                ctx.lineTo(x, skipCheck);
              }
              ctx.lineTo(x, nextBar.y);
            } else {
              ctx.moveTo(x, nextBar.y);
            }
          }
        } else if (isGap) {
          if (i === prevBar) continue;
          ctx.lineTo(x - halfBarSpacing, skipCheck);
          ctx.lineTo(x - halfBarSpacing, nextBar.y);
          ctx.lineTo(x + halfBarSpacing, nextBar.y);
          ctx.lineTo(x + halfBarSpacing, skipCheck);
        } else {
          ctx.moveTo(x - halfBarSpacing, nextBar.y);
          ctx.lineTo(x + halfBarSpacing, nextBar.y);
        }

        currentBar = nextBar;
      }
    }
  }

  _drawLines(ctx) {
    if (!this._data.items.length) return;

    let startIndex =
      null !== this._data.visibleItemsRange?.startItemIndex
        ? this._data.visibleItemsRange.startItemIndex
        : 0;
    let endIndex =
      (null !== this._data.visibleItemsRange?.endItemIndex
        ? this._data.visibleItemsRange.endItemIndex
        : this._data.items.length) - 1;
    const firstPoint = this._data.items[startIndex];
    if (firstPoint) {
      ctx.moveTo(firstPoint.x, firstPoint.y);
    }

    let prevPoint, currentPoint, nextPoint;
    let prevStyle, prevColor, prevWidth;
    let currentStyle = ctx.strokeStyle;
    let currentWidth = ctx.lineWidth;

    for (let i = startIndex + 1; i <= endIndex; ++i) {
      prevPoint = this._data.items[i - 1];
      currentPoint = this._data.items[i];
      nextPoint = this._data.items[i + 1] || {};

      if (currentPoint.style && !this._data.forceLineColor) {
        currentStyle = currentPoint.style.color;
        currentWidth = currentPoint.style.width;
        prevStyle = currentStyle;
        prevColor = currentColor;
        prevWidth = currentWidth;
      } else {
        currentStyle = this._data.lineColor;
        currentWidth = this._data.lineWidth;
        prevStyle = currentStyle;
        prevColor = currentColor;
        prevWidth = currentWidth;
      }

      if (
        prevColor !== currentStyle ||
        prevWidth !== currentWidth ||
        prevStyle !== currentStyle
      ) {
        currentStyle = prevStyle;
        currentWidth = prevWidth;
        prevColor = currentStyle;
        prevWidth = currentWidth;
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = currentStyle;
        ctx.lineWidth = currentWidth;
        o.setValidLineStyle(ctx, prevStyle);
        ctx.moveTo(prevPoint.x, prevPoint.y);
      }

      ctx.lineTo(currentPoint.x, currentPoint.y);
    }

    ctx.stroke();
  }
}
