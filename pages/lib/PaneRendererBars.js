

import { PriceRange, assert, optimalBarWidth, interactionTolerance } from '<path_to_utils_module>';
import { PaneRendererSeriesBase } from '<path_to_PaneRendererSeriesBase_module>';

class PaneRendererBars extends PaneRendererSeriesBase {
  constructor(options) {
    super();
    this._bars = options.bars;
    this._barSpacing = options.barSpacing;
    this._dontDrawOpen = options.dontDrawOpen;
    this._thinBars = options.thinBars;
  }

  draw(context, pixelRatio) {
    context.save();
    const ratio = pixelRatio;

    if (this._barWidth = this._calcBarWidth(ratio), this._barWidth >= 2) {
      if (Math.max(1, Math.floor(ratio)) % 2 !== this._barWidth % 2) {
        this._barWidth--;
      }
    }

    this._barLineWidth = this._thinBars ? Math.min(this._barWidth, Math.floor(ratio)) : this._barWidth;
    let currentColor = null;

    const rounded = this._barLineWidth <= this._barWidth && this._barSpacing >= Math.floor(1.5 * pixelRatio);

    for (const bar of this._bars) {
      if (currentColor !== bar.color) {
        context.fillStyle = bar.color;
        currentColor = bar.color;
      }

      const halfLineWidth = Math.floor(0.5 * this._barLineWidth);
      const barX = Math.round(bar.time * pixelRatio);
      const x = barX - halfLineWidth;
      const width = this._barLineWidth;
      const right = x + width - 1;
      const top = Math.min(bar.high, bar.low) * pixelRatio - halfLineWidth;
      const bottom = Math.max(bar.high, bar.low) * pixelRatio + halfLineWidth;
      const barHeight = Math.max(bottom - top, this._barLineWidth);

      context.fillRect(x, top, width, barHeight);

      const wideHalfWidth = Math.ceil(1.5 * this._barWidth);
      if (rounded) {
        const left = barX - wideHalfWidth;
        const right = barX + wideHalfWidth;
        const barWidth = Math.min(x - left, right - x);

        if (!this._dontDrawOpen) {
          let openTop = Math.max(top, Math.round(bar.open * pixelRatio) - halfLineWidth);
          let openBottom = openTop + width - 1;

          if (openBottom > top + barHeight - 1) {
            openBottom = top + barHeight - 1;
            openTop = openBottom - width + 1;
          }

          context.fillRect(left, openTop, barWidth, openBottom - openTop + 1);
        }

        let closeTop = Math.max(top, Math.round(bar.close * pixelRatio) - halfLineWidth);
        let closeBottom = closeTop + width - 1;

        if (closeBottom > top + barHeight - 1) {
          closeBottom = top + barHeight - 1;
          closeTop = closeBottom - width + 1;
        }

        context.fillRect(right + 1, closeTop, barWidth, closeBottom - closeTop + 1);
      }
    }

    context.restore();
  }

  _getTolerance() {
    const barWidth = this._calcBarWidth(1);
    const tolerance = interactionTolerance().series + barWidth / 2;
    return tolerance;
  }

  _getBarSpacing() {
    return this._barSpacing;
  }

  _calcBarWidth(ratio) {
    const floorRatio = Math.floor(ratio);
    return Math.max(floorRatio, Math.floor(optimalBarWidth(this._barSpacing, ratio)));
  }
}

export { PaneRendererBars };