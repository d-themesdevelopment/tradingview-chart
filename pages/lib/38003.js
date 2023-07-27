"use strict";

const { HorizontalLineRenderer } = require("./74997");
const { LINESTYLE_SOLID } = require("./79849");
// const { rgba } = require("./79849"); // ! not correct

class HorizontalLinePaneView {
  constructor() {
    this._lineRendererData = {
      y: 0,
      color: "rgba(0, 0, 0, 0)",
      linewidth: 1,
      linestyle: LINESTYLE_SOLID,
      visible: false,
    };
    this._lineRenderer = new HorizontalLineRenderer();
    this._invalidated = true;
    this._lineRenderer.setData(this._lineRendererData);
  }

  update() {
    this._invalidated = true;
  }

  renderer() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    return this._lineRenderer;
  }

  _updateImpl() {
    // Implementation logic goes here
  }
}

export { HorizontalLinePaneView };
