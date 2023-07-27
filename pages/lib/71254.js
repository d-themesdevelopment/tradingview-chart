import { BitmapCoordinatesPaneRenderer } from '59590';
import { HitTestResult, HitTarget } from '18807';
import { interactionTolerance } from '45197';
import { addExclusionAreaByScope, drawVerticalLine, setLineStyle } from '68441';

class VerticalLineRenderer extends BitmapCoordinatesPaneRenderer {
  constructor() {
    super();
    this._data = null;
    this._hitTest = new HitTestResult(HitTarget.MovePoint);
  }

  setData(data) {
    this._data = data;
  }

  setHitTest(hitTest) {
    this._hitTest = hitTest;
  }

  hitTest(point) {
    if (!this._data || !this._hitTest) {
      return null;
    }

    const tolerance = interactionTolerance().line;
    const isWithinXRange = Math.abs(point.x - this._data.x) <= tolerance + this._data.linewidth / 2;
    const isWithinTopRange = typeof this._data.top === 'undefined' || this._data.top - point.y <= tolerance;
    const isWithinBottomRange = typeof this._data.bottom === 'undefined' || point.y - this._data.bottom <= tolerance;

    return isWithinXRange && isWithinTopRange && isWithinBottomRange ? this._hitTest : null;
  }

  _drawImpl(contextRenderer) {
    if (!this._data || this._data.linewidth <= 0) {
      return;
    }

    const {
      context: context,
      horizontalPixelRatio: horizontalPixelRatio,
      verticalPixelRatio: verticalPixelRatio,
      mediaSize: mediaSize,
    } = contextRenderer;

    if (this._data.x < -this._data.linewidth / 2 || this._data.x > mediaSize.width + this._data.linewidth / 2) {
      return;
    }

    context.lineCap = 'butt';
    context.strokeStyle = this._data.color;
    context.lineWidth = Math.max(1, Math.floor(this._data.linewidth * horizontalPixelRatio));

    if (typeof this._data.linestyle !== 'undefined') {
      setLineStyle(context, this._data.linestyle);
    }

    const top = typeof this._data.top !== 'undefined' ? Math.max(this._data.top, 0) : 0;
    const bottom = typeof this._data.bottom !== 'undefined' ? Math.min(this._data.bottom, mediaSize.height) : mediaSize.height;
    const x = Math.round(this._data.x * horizontalPixelRatio);
    const yTop = Math.floor(top * verticalPixelRatio);
    const yBottom = Math.ceil(bottom * verticalPixelRatio);
    const excludeBoundaries = this._data.excludeBoundaries;

    if (typeof excludeBoundaries !== 'undefined') {
      addExclusionAreaByScope(contextRenderer, excludeBoundaries);
    }

    drawVerticalLine(context, x, yTop, yBottom);
  }
}

export {
  VerticalLineRenderer
};