
import { BitmapCoordinatesPaneRenderer } from './BitmapCoordinatesPaneRenderer.js';
import { HitTestResult, HitTarget } from './18807.js';

class PaneRendererColumns extends BitmapCoordinatesPaneRenderer {
  constructor(data) {
    super();
    this._data = null;
    this._precalculatedCache = [];
    this.setData(data);
  }

  setData(data) {
    this._data = data;
    this._precalculatedCache = [];
  }

  hitTest(point) {
    if (this._data === null) {
      return null;
    }

    const halfBarSpacing = 0.5 * this._data.barSpacing;
    const left = point.x - halfBarSpacing;
    const right = point.x + halfBarSpacing;
    const startItemIndex = this._data.visibleItemsRange?.startItemIndex ?? 0;
    const endItemIndex = this._data.visibleItemsRange?.endItemIndex ?? this._data.items.length - 1;

    for (let i = startItemIndex; i <= endItemIndex; i++) {
      const item = this._data.items[i];
      const x = item.x;

      if (x >= left && x <= right) {
        const y = item.y;

        if (point.y >= Math.min(y, this._data.histogramBase) && point.y <= Math.max(y, this._data.histogramBase)) {
          return new HitTestResult(HitTarget.Regular);
        }
      }
    }

    return null;
  }

  _drawImpl(context) {
    if (this._data === null || this._data.items.length === 0) {
      return;
    }

    const {
      context: ctx,
      horizontalPixelRatio,
      verticalPixelRatio,
    } = context;

    this._precalculatedCache.length || this._fillPrecalculatedCache(horizontalPixelRatio);

    const lineWidth = Math.max(1, Math.floor(horizontalPixelRatio));
    const lineHeight = Math.max(1, Math.floor(verticalPixelRatio));
    const histogramBase = Math.round(this._data.histogramBase * verticalPixelRatio) - Math.floor(lineWidth / 2);
    const histogramTop = histogramBase + lineWidth;
    const lineColor = this._data.lineColor;
    const startItemIndex = this._data.visibleItemsRange?.startItemIndex ?? 0;
    const endItemIndex = this._data.visibleItemsRange?.endItemIndex ?? this._data.items.length - 1;

    for (let i = startItemIndex; i <= endItemIndex; i++) {
      const item = this._data.items[i];
      const precalculated = this._precalculatedCache[i - startItemIndex];
      const y = Math.round(item.y * verticalPixelRatio);

      let top, bottom;

      ctx.fillStyle = item.style ? item.style.color : lineColor;

      if (y <= histogramBase) {
        top = y;
        bottom = histogramTop;
      } else {
        top = histogramBase;
        bottom = y - Math.floor(lineHeight / 2) + lineHeight;
      }

      ctx.fillRect(precalculated.left, top, precalculated.right - precalculated.left + 1, bottom - top);
    }
  }

  _fillPrecalculatedCache(pixelRatio) {
    if (this._data === null || this._data.items.length === 0) {
      this._precalculatedCache = [];
      return;
    }

    const {
      barSpacing,
      visibleItemsRange: range,
      items,
    } = this._data;

    const actualBarSpacing = Math.ceil(barSpacing * pixelRatio) <= 1 ? 0 : Math.max(1, Math.floor(pixelRatio));
    const roundedBarSpacing = Math.round(barSpacing * pixelRatio) - actualBarSpacing;
    const startItemIndex = range?.startItemIndex ?? 0;
    const endItemIndex = (range?.endItemIndex ?? items.length - 1);
    const itemCount = endItemIndex - startItemIndex + 1;

    if (itemCount <= 0) {
      this._precalculatedCache = [];
      return;
    }

    this._precalculatedCache = new Array(itemCount);

    for (let i = startItemIndex; i <= endItemIndex; i++) {
      const item = items[i];
      const x = Math.round(item.x * pixelRatio);

      let left, right;

      if (actualBarSpacing % 2) {
        const halfSpacing = (actualBarSpacing - 1) / 2;
        left = x - halfSpacing;
        right = x + halfSpacing;
      } else {
        const halfSpacing = actualBarSpacing / 2;
        left = x - halfSpacing;
        right = x + halfSpacing - 1;
      }

      this._precalculatedCache[i - startItemIndex] = {
        left: left,
        right: right,
        roundedCenter: x,
        center: item.x * pixelRatio,
        time: item.timePointIndex,
      };
    }

    for (let i = startItemIndex + 1; i <= endItemIndex; i++) {
      const current = this._precalculatedCache[i - startItemIndex];
      const previous = this._precalculatedCache[i - startItemIndex - 1];

      if (current.time === previous.time + 1) {
        if (current.left - previous.right !== actualBarSpacing + 1) {
          if (previous.roundedCenter > previous.center) {
            previous.right = current.left - actualBarSpacing - 1;
          } else {
            current.left = previous.right + actualBarSpacing + 1;
          }
        }
      }
    }

    let minWidth = Math.ceil(barSpacing * pixelRatio);

    for (let i = startItemIndex + 1; i <= endItemIndex; i++) {
      const current = this._precalculatedCache[i - startItemIndex];
      const previous = this._precalculatedCache[i - startItemIndex - 1];

      if (current.right < current.left) {
        current.right = current.left;
      }

      const width = current.right - current.left + 1;
      minWidth = Math.min(width, minWidth);
    }

    if (actualBarSpacing > 0 && minWidth < 4) {
      for (let i = startItemIndex + 1; i <= endItemIndex; i++) {
        const current = this._precalculatedCache[i - startItemIndex];

        if (current.right - current.left + 1 > minWidth) {
          if (current.roundedCenter > current.center) {
            current.right -= 1;
          } else {
            current.left += 1;
          }
        }
      }
    }
  }
}

export { PaneRendererColumns };