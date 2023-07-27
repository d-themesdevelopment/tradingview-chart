import { colorsPalette } from 'color-library';
import { BitmapCoordinatesPaneRenderer, pointInBox } from 'renderer-library';
import { HitTestResult } from 'hit-test-library';

const defaultColor = colorsPalette["color-tv-blue-600"];

export class SelectionRenderer extends BitmapCoordinatesPaneRenderer {
  constructor(data) {
    super();
    this._data = data || null;
  }

  setData(data) {
    this._data = data;
  }

  hitTest(point) {
    if (!this._data || !this._data.visible) {
      return null;
    }

    for (let i = 0; i < this._data.points.length; i++) {
      const p = this._data.points[i];
      if (p.subtract(point).length() <= 5.5) {
        const cursorType = (typeof this._data.pointsCursorType !== 'undefined') ? this._data.pointsCursorType[i] : PaneCursorType.Default;
        return new HitTestResult(this._data.hittestResult, {
          pointIndex: p.data,
          cursorType: cursorType
        });
      }
    }

    return null;
  }

  doesIntersectWithBox(box) {
    return !!this._data && this._data.points.some((p) => pointInBox(p, box));
  }

  _drawImpl(context) {
    if (this._data === null || !this._data.visible) {
      return;
    }

    const { context: ctx, horizontalPixelRatio } = context;
    ctx.strokeStyle = (typeof this._data.color !== 'undefined') ? this._data.color : defaultColor;
    ctx.lineCap = "butt";
    const lineWidth = Math.max(1, Math.floor(horizontalPixelRatio));
    ctx.lineWidth = lineWidth;
    const verticalOffset = this._data.vertOffset || 0;

    for (let i = 0; i < this._data.points.length; ++i) {
      const point = this._data.points[i];
      if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
        ctx.fillStyle = this._data.bgColors[i];
        this._drawMarker(context, point, verticalOffset, lineWidth);
      }
    }
  }

  _drawMarker(context, point, verticalOffset, lineWidth) {
    const { context: ctx, horizontalPixelRatio, verticalPixelRatio } = context;
    let markerRadius = Math.round(3.5 * horizontalPixelRatio * 2);
    if (markerRadius % 2 !== lineWidth % 2) {
      markerRadius += 1;
    }
    let markerSize = Math.round(markerRadius + 2 * (.5 * lineWidth + .75 * horizontalPixelRatio));
    if (markerSize % 2 !== lineWidth % 2) {
      markerSize += 1;
    }
    const x = Math.round(point.x * horizontalPixelRatio);
    const y = Math.round((point.y + verticalOffset) * verticalPixelRatio);
    const halfLineWidth = lineWidth % 2 / 2;

    ctx.beginPath();
    ctx.arc(x + halfLineWidth, y + halfLineWidth, markerSize / 2, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + halfLineWidth, y + halfLineWidth, markerRadius / 2, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.stroke();
  }
}