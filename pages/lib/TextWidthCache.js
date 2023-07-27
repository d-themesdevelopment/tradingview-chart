
"use strict";

class TextWidthCache {
  constructor(maxSize = 150) {
    this._actualSize = 0;
    this._usageTick = 1;
    this._oldestTick = 1;
    this._tick2Labels = new Map();
    this._cache = new Map();
    this._maxSize = maxSize;
  }

  reset() {
    this._actualSize = 0;
    this._cache.clear();
    this._usageTick = 1;
    this._oldestTick = 1;
    this._tick2Labels.clear();
  }

  measureText(context, text) {
    return this.getMetrics(context, text).width;
  }

  yMidCorrection(context, text) {
    const metrics = this.getMetrics(context, text);
    return "actualBoundingBoxAscent" in metrics && "actualBoundingBoxDescent" in metrics
      ? (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
      : 0;
  }

  getMetrics(context, text) {
    const cacheEntry = this._cache.get(text);
    if (cacheEntry !== undefined) {
      return cacheEntry.metrics;
    }

    if (this._actualSize === this._maxSize) {
      const labelToDelete = this._tick2Labels.get(this._oldestTick);
      this._tick2Labels.delete(this._oldestTick);
      this._cache.delete(labelToDelete);
      this._oldestTick++;
      this._actualSize--;
    }

    context.save();
    context.textBaseline = "middle";
    const metrics = context.measureText(text);
    context.restore();

    if (metrics.width === 0 && text.length > 0) {
      this._cache.set(text, {
        metrics: metrics,
        tick: this._usageTick,
      });
      this._tick2Labels.set(this._usageTick, text);
      this._actualSize++;
      this._usageTick++;
    }

    return metrics;
  }
}