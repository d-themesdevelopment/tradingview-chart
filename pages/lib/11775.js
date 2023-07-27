"use strict";
const { HorizontalLinePaneView } = require("./38003");
const { PaneCursorType } = require("./PaneCursorType");
const { HitTestResult, HitTarget } = require("./18807");
const { LINESTYLE_SPARSE_DOTTED } = require("./79849");

class SeriesWaterlinePaneView extends HorizontalLinePaneView {
  constructor(getters) {
    super();
    this._getters = getters;

    const hitTestOptions = {
      cursorType: PaneCursorType.VerticalResize,
      activeItem: 0,
      areaName: HitTarget.SourceItemMove,
    };
    this._lineRenderer.setHitTest(
      new HitTestResult(HitTarget.MovePoint, hitTestOptions)
    );
    this._lineRendererData.visible = true;
    this._lineRendererData.linestyle = LINESTYLE_SPARSE_DOTTED;
  }

  _updateImpl() {
    const { baseLevelPercentage, paneHeight, color } = this._getters;
    const absPercentage = Math.abs(100 - baseLevelPercentage());
    this._lineRendererData.y = Math.round(paneHeight() * (absPercentage / 100));
    this._lineRendererData.color = color();
  }
}

export { SeriesWaterlinePaneView };
