
const { CanvasRenderingTarget2D, size } = require('27714');

class MediaCoordinatesPaneRenderer {
  draw(canvasElement, dimensions) {
    new CanvasRenderingTarget2D(canvasElement, size({ width: dimensions.cssWidth, height: dimensions.cssHeight }), size({ width: dimensions.physicalWidth, height: dimensions.physicalHeight })).useMediaCoordinateSpace((context) => this._drawImpl(context));
  }

  drawBackground(canvasElement, dimensions) {
    new CanvasRenderingTarget2D(canvasElement, size({ width: dimensions.cssWidth, height: dimensions.cssHeight }), size({ width: dimensions.physicalWidth, height: dimensions.physicalHeight })).useMediaCoordinateSpace((context) => this._drawBackgroundImpl(context));
  }

  _drawBackgroundImpl(context) {}
}

module.exports = {
  MediaCoordinatesPaneRenderer,
};

