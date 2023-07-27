


import { EventDispatcher } from '<path_to_EventDispatcher_module>';
import { ensureDefined } from '<path_to_ensureDefined_module>';

export class InvalidationLevel {
  constructor(level = defaultInvalidationLevel) {
    this._paneInvalidationLevel = defaultInvalidationLevel;
    this._leftPriceScalesInvalidationMap = new Map();
    this._rightPriceScalesInvalidationMap = new Map();
    this._legendWidgetInvalidated = false;
    this._invalidationLevel = level;
  }

  fullInvalidation() {
    return this._invalidationLevel;
  }

  invalidateAll(level) {
    this._invalidationLevel = Math.max(this._invalidationLevel, level);
  }

  invalidatePane(level) {
    this._paneInvalidationLevel = Math.max(this._invalidationLevel, level);
  }

  invalidateLegendWidgetLayout() {
    this._legendWidgetInvalidated = true;
  }

  invalidatePriceScale(side, priceScale, level) {
    const scalesMap = side === "left" ? this._leftPriceScalesInvalidationMap : this._rightPriceScalesInvalidationMap;
    const previousLevel = scalesMap.get(priceScale) || defaultInvalidationLevel;
    scalesMap.set(priceScale, Math.max(previousLevel, level));
  }

  invalidationLevelForPane() {
    return Math.max(this._paneInvalidationLevel, this._invalidationLevel);
  }

  legendWidgetLayoutInvalidated() {
    return this._legendWidgetInvalidated || this._invalidationLevel === InvalidationLevel.Full;
  }

  getterForPriceScaleInvalidationLevelBySide(side) {
    const scalesMap = side === "left" ? this._leftPriceScalesInvalidationMap : this._rightPriceScalesInvalidationMap;
    return (priceScale) => Math.max(scalesMap.get(priceScale) || defaultInvalidationLevel, this._invalidationLevel);
  }

  priceScaleSideMaxLevel(side) {
    const scalesMap = side === "left" ? this._leftPriceScalesInvalidationMap : this._rightPriceScalesInvalidationMap;
    let maxLevel = this._invalidationLevel;
    if (scalesMap.size > 0) {
      scalesMap.forEach((level) => {
        if (level > maxLevel) {
          maxLevel = level;
        }
      });
    }
    return maxLevel;
  }

  merge(invalidationLevel) {
    this._invalidationLevel = Math.max(this._invalidationLevel, invalidationLevel._invalidationLevel);
    this._paneInvalidationLevel = Math.max(this._paneInvalidationLevel, invalidationLevel._paneInvalidationLevel);
    invalidationLevel._leftPriceScalesInvalidationMap.forEach((level, priceScale) => {
      const previousLevel = this._leftPriceScalesInvalidationMap.get(priceScale) || defaultInvalidationLevel;
      this._leftPriceScalesInvalidationMap.set(priceScale, Math.max(previousLevel, level));
    });
    invalidationLevel._rightPriceScalesInvalidationMap.forEach((level, priceScale) => {
      const previousLevel = this._rightPriceScalesInvalidationMap.get(priceScale) || defaultInvalidationLevel;
      this._rightPriceScalesInvalidationMap.set(priceScale, Math.max(previousLevel, level));
    });
    this._legendWidgetInvalidated = this._legendWidgetInvalidated || invalidationLevel._legendWidgetInvalidated;
  }
}

export const defaultInvalidationLevel = InvalidationLevel.None;

class InvalidationMask {
  constructor(level = defaultInvalidationLevel) {
    this._panesOrderChanged = false;
    this._keepVisibleTimeRangeOnResize = false;
    this._timeAxisInvalidationLevel = defaultInvalidationLevel;
    this._invalidatedPanes = new Map();
    this._additionalActions = [];
    this._timeScaleInvalidations = [];
    this._invalidationLevel = level;
  }

  invalidateAll(level) {
    if (this._invalidationLevel !== level) {
      this._invalidationLevel = Math.max(this._invalidationLevel, level);
      this._invalidatedPanes.forEach((pane) => {
        pane.invalidateAll(this._invalidationLevel);
      });
    }
  }

  invalidateAllPane(pane, level) {
    if (!this._invalidatedPanes.has(pane)) {
      this._invalidatedPanes.set(pane, new InvalidationLevel(this._invalidationLevel));
    }
    ensureDefined(this._invalidatedPanes.get(pane)).invalidateAll(level);
  }

  invalidatePriceScale(pane, priceScale, level) {
    if (!this._invalidatedPanes.has(pane)) {
      this._invalidatedPanes.set(pane, new InvalidationLevel(this._invalidationLevel));
    }
    ensureDefined(this._invalidatedPanes.get(pane)).invalidatePriceScale(priceScale, level);
  }

  invalidateTimeScale(level) {
    this._timeAxisInvalidationLevel = Math.max(this._timeAxisInvalidationLevel, level);
  }

  invalidatePanesOrder() {
    this._panesOrderChanged = true;
  }

  lockVisibleTimeRangeOnResize() {
    this._keepVisibleTimeRangeOnResize = true;
  }

  fullInvalidation() {
    return this._invalidationLevel;
  }

  maxPaneInvalidation() {
    const levels = [];
    this._invalidatedPanes.forEach((pane) => {
      levels.push(pane.fullInvalidation());
    });
    return Math.max(...levels, this._invalidationLevel);
  }

  invalidateForPane(pane) {
    return this._invalidatedPanes.get(pane) || new InvalidationLevel(this._invalidationLevel);
  }

  invalidateForTimeScale() {
    return Math.max(this._timeAxisInvalidationLevel, this._invalidationLevel);
  }

  validationActions() {
    return this._additionalActions;
  }

  addValidationAction(action) {
    this._additionalActions.push(action);
  }

  merge(invalidationMask) {
    this._invalidationLevel = Math.max(this._invalidationLevel, invalidationMask._invalidationLevel);
    this._panesOrderChanged = this._panesOrderChanged || invalidationMask._panesOrderChanged;
    this._keepVisibleTimeRangeOnResize = this._keepVisibleTimeRangeOnResize || invalidationMask._keepVisibleTimeRangeOnResize;
    this._invalidatedPanes.forEach((pane) => {
      pane.invalidateAll(this._invalidationLevel);
    });
    invalidationMask._invalidatedPanes.forEach((invalidationLevel, pane) => {
      if (!this._invalidatedPanes.has(pane)) {
        this._invalidatedPanes.set(pane, new InvalidationLevel(this._invalidationLevel));
      }
      ensureDefined(this._invalidatedPanes.get(pane)).merge(invalidationLevel);
    });
    this._timeAxisInvalidationLevel = Math.max(this._timeAxisInvalidationLevel, invalidationMask._timeAxisInvalidationLevel);
    for (let i = 0; i < invalidationMask._additionalActions.length; i++) {
      this._additionalActions.push(invalidationMask._additionalActions[i]);
    }
    for (const invalidation of invalidationMask._timeScaleInvalidations) {
      this._applyTimeScaleInvalidation(invalidation);
    }
  }

  panesOrderInvalidated() {
    return this._panesOrderChanged;
  }

  isVisibleTimeRangeLockedOnResize() {
    return this._keepVisibleTimeRangeOnResize;
  }

  setTimeScaleAnimation(animation) {
    this._removeTimeScaleAnimation();
    this._timeScaleInvalidations.push({
      type: 0,
      value: animation
    });
  }

  stopTimeScaleAnimation() {
    this._removeTimeScaleAnimation();
    this._timeScaleInvalidations.push({
      type: 1
    });
  }

  timeScaleInvalidations() {
    return this._timeScaleInvalidations;
  }

  static cursor() {
    return new InvalidationMask(InvalidationLevel.Cursor);
  }

  static light() {
    return new InvalidationMask(InvalidationLevel.Light);
  }

  static full() {
    return new InvalidationMask(InvalidationLevel.Full);
  }

  static panesOrder() {
    const mask = InvalidationMask.full();
    mask.invalidatePanesOrder();
    return mask;
  }

  static invalidateLegendWidgetLayout(pane) {
    const mask = new InvalidationMask();
    mask._invalidatedPanes.set(pane, new InvalidationLevel());
    const paneInvalidation = mask._invalidatedPanes.get(pane);
    paneInvalidation?.invalidateLegendWidgetLayout();
    return mask;
  }

  static validateAction(action) {
    const mask = new InvalidationMask();
    mask._additionalActions.push(action);
    return mask;
  }

  _applyTimeScaleInvalidation(invalidation) {
    switch (invalidation.type) {
      case 0:
        this.setTimeScaleAnimation(invalidation.value);
        break;
      case 1:
        this._removeTimeScaleAnimation();
        break;
    }
  }

  _removeTimeScaleAnimation() {
    const index = this._timeScaleInvalidations.findIndex((invalidation) => invalidation.type === 0);
    if (index !== -1) {
      const [removed] = this._timeScaleInvalidations.splice(index, 1);
      removed.value.terminate();
    }
  }
}

export const defaultInvalidationLevel = InvalidationLevel.None;
