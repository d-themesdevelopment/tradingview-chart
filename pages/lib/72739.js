import { ensure, ensureNotNull } from 'util-module';
import { box, Point, equalPoints } from 'geometry-module';
import { distanceToSegment } from 'distance-module';
import { generateColor } from 'color-module';
import { HitTestResult, HitTarget } from 'hit-test-module';
import { fillRectWithBorder, LINESTYLE_SOLID } from 'fill-module';
import { BitmapCoordinatesPaneRenderer } from 'renderer-module';

class RectangleRenderer extends BitmapCoordinatesPaneRenderer {
  constructor(hitTestResult, backHitTestResult, forceOverrideTransparency) {
    super();
    this._data = null;
    this._hitTestResult = hitTestResult || new HitTestResult(HitTarget.MovePoint);
    this._backHitTestResult = backHitTestResult || new HitTestResult(HitTarget.MovePointBackground);
    this._forceOverrideTransparency = Boolean(forceOverrideTransparency);
  }

  setData(data) {
    this._data = data;
  }

  hitTest(e, t) {
    if (this._data === null || this._data.points.length < 2 || this._data.nohittest) {
      return null;
    }

    const physicalWidth = t.physicalWidth;
    const { min, max } = box(...this._data.points);
    const topLeft = new Point(max.x, min.y);
    const bottomRight = new Point(min.x, max.y);

    const topHitResult = this._extendAndHitTestLineSegment(e, min, topLeft, physicalWidth);
    if (topHitResult !== null) {
      return topHitResult;
    }

    const bottomHitResult = this._extendAndHitTestLineSegment(e, bottomRight, max, physicalWidth);
    if (bottomHitResult !== null) {
      return bottomHitResult;
    }

    let distance = distanceToSegment(topLeft, max, e);
    if (distance.distance <= 3) {
      return this._hitTestResult;
    }

    distance = distanceToSegment(min, bottomRight, e);
    if (distance.distance <= 3) {
      return this._hitTestResult;
    }

    if (this._data.fillBackground) {
      return this._hitTestBackground(e, min, max, physicalWidth);
    }

    return null;
  }

  getColor() {
    const data = ensure(this._data);
    if (data.transparency === undefined) {
      return data.backcolor;
    }
    return generateColor(data.backcolor, data.transparency, this._forceOverrideTransparency);
  }

  _drawImpl(e) {
    if (this._data === null || this._data.points.length < 2 || (this._data.linewidth <= 0 && !this._data.fillBackground)) {
      return;
    }

    const {
      context: ctx,
      horizontalPixelRatio: hRatio,
      verticalPixelRatio: vRatio,
      bitmapSize,
    } = e;

    const bbox = box(...this._data.points);
    const lineWidth = this._data.linewidth ? Math.max(1, Math.floor(this._data.linewidth * hRatio)) : 0;
    const fillColor = this._data.fillBackground ? this.getColor() : undefined;
    const pixelRatio = Math.max(1, Math.floor(hRatio));

    fillRectWithBorder(
      ctx,
      Math.round(bbox.min.x * hRatio),
      Math.round(bbox.min.y * vRatio),
      Math.round(bbox.max.x * hRatio),
      Math.round(bbox.max.y * vRatio),
      fillColor,
      this._data.color,
      lineWidth,
      LINESTYLE_SOLID,
      this._data.extendLeft,
      this._data.extendRight,
      "center",
      bitmapSize.width,
      this._data.includeRightEdge && pixelRatio === 1 ? 1 : 0
    );
  }

  _extendAndHitTestLineSegment(e, t, i, s) {
    const extendedLineSegment = this._extendAndClipLineSegment(t, i, s);
    if (extendedLineSegment !== null) {
      if (distanceToSegment(extendedLineSegment[0], extendedLineSegment[1], e).distance <= 3) {
        return this._hitTestResult;
      }
    }
    return null;
  }

  _extendAndClipLineSegment(t, i, s) {
    const data = ensureNotNull(this._data);
    if (equalPoints(t, i) && !data.extendLeft && !data.extendRight) {
      return null;
    }
    const min = Math.min(t.x, i.x);
    const max = Math.max(t.x, i.x);
    const left = data.extendLeft ? 0 : Math.max(min, 0);
    const right = data.extendRight ? s : Math.min(max, s);
    if (left > right || right <= 0 || left >= s) {
      return null;
    }
    return [new Point(left, t.y), new Point(right, i.y)];
  }

  _hitTestBackground(e, t, i, s) {
    const extendedLineSegment = this._extendAndClipLineSegment(t, i, s);
    if (extendedLineSegment !== null && pointInBox(e, box(extendedLineSegment[0], extendedLineSegment[1]))) {
      return this._backHitTestResult;
    }
    return null;
  }
}

export { RectangleRenderer };
