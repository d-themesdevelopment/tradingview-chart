import { LineDataSource } from "./13087.js";
import {alignToStep} from "./alignToStep.js"
export class LineToolTrading extends LineDataSource {
  constructor(model, customization) {
    super(model, customization);
    this.customization.forcePriceAxisLabel = true;
    this.customization.disableErasing = true;
    this.customization.showInObjectsTree = false;
    this.setSelectionEnabled(false);
  }

  isSynchronizable() {
    return false;
  }

  pointsCount() {
    return POINTS_COUNT;
  }

  hasContextMenu() {
    return false;
  }

  state() {
    return null;
  }

  startMoving() {
    super.startMoving(...arguments);
    this._cursorMoved = false;
  }

  endMoving() {
    super.endMoving(...arguments);
    this._cursorMoved = false;
  }

  _correctPoints(points, barsRange) {
    if (this._currentMovingPoint && this._startMovingPoint) {
      if (
        this._currentMovingPoint.logical.price -
        this._startMovingPoint.logical.price
      ) {
        this._cursorMoved = true;
      }
    } else {
      this._cursorMoved = false;
    }

    const step = 1 / this.priceScale().mainSource().base();

    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      if (this._cursorMoved) {
        point.price = this._currentMovingPoint.logical.price;
      }

      point.price = alignToStep(point.price, step);

      points[i] = point;
    }
  }

  userEditEnabled() {
    return true;
  }

  movable() {
    return false;
  }

  canBeHidden() {
    return false;
  }

  isUserDeletable() {
    return false;
  }

  showInObjectTree() {
    return false;
  }

  doesMovingAffectsUndo() {
    return false;
  }

  isAvailableInFloatingWidget() {
    return false;
  }

  timeAxisViews() {
    return null;
  }

  cloneable() {
    return false;
  }

  copiable() {
    return false;
  }
}

LineToolTrading.POINTS_COUNT = 1;
