import { BitmapCoordinatesPaneRenderer, HitTestResult, HitTarget } from 'chart-module';
import { setLineStyle, drawHorizontalLine } from 'drawing-utils-module';
import { interactionTolerance } from 'tolerance-module';
import { addExclusionAreaByScope } from 'exclusion-utils-module';

class HorizontalLineRenderer extends BitmapCoordinatesPaneRenderer {
  constructor() {
    super();
    this._data = null;
    this._hitTest = new HitTestResult(HitTarget.Regular);
  }

  setData(data) {
    this._data = data;
  }

  setHitTest(hitTest) {
    this._hitTest = hitTest;
  }

  hitTest(position) {
    if (this._data === null || !this._data.visible || this._hitTest === null) {
      return null;
    }

    const tolerance = interactionTolerance().line;
    const isCloseToY = Math.abs(position.y - this._data.y) <= tolerance + this._data.linewidth / 2;
    const isLeftInTolerance = this._data.left === undefined || this._data.left - position.x <= tolerance;
    const isRightInTolerance = this._data.right === undefined || position.x - this._data.right <= tolerance;

    if (isCloseToY && isLeftInTolerance && isRightInTolerance) {
      return this._hitTest;
    }

    return null;
  }

  _drawImpl(context) {
    if (this._data === null || !this._data.visible) {
      return;
    }

    const { context: ctx, horizontalPixelRatio: hRatio, verticalPixelRatio: vRatio, mediaSize } = context;

    if (this._data.y < -this._data.linewidth / 2 || this._data.y > mediaSize.height + this._data.linewidth / 2) {
      return;
    }

    ctx.lineCap = 'butt';
    ctx.strokeStyle = this._data.color;
    ctx.lineWidth = Math.max(1, Math.floor(this._data.linewidth * hRatio));

    if (this._data.linestyle !== undefined) {
      setLineStyle(ctx, this._data.linestyle);
    }

    const left = this._data.left !== undefined ? Math.max(this._data.left, 0) : 0;
    const right = this._data.right !== undefined ? Math.min(this._data.right, mediaSize.width) : mediaSize.width;
    const y = Math.round(this._data.y * vRatio);
    const x1 = Math.round(left * hRatio);
    const x2 = Math.round(right * hRatio);

    const exclusionArea = this._data.excludeBoundaries;
    if (exclusionArea !== undefined) {
      addExclusionAreaByScope(context, exclusionArea);
    }

    drawHorizontalLine(ctx, y, x1, x2);
  }
}

export { HorizontalLineRenderer };