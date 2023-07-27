


import { drawScaled, colorFromBackground } from 74359;

class TimeAxisViewRenderer {
  constructor() {
    this._data = null;
  }

  setData(data) {
    this._data = data;
  }

  draw(ctx, options, pixelRatio) {
    if (this._data === null || !this._data.visible || this._data.text.length === 0) {
      return;
    }

    const data = this._data;
    ctx.font = options.font;

    const textWidth = Math.round(options.widthCache.measureText(ctx, data.text));
    if (textWidth <= 0) {
      return;
    }

    ctx.save();
    const paddingHorizontal = options.paddingHorizontal;
    const containerWidth = textWidth + 2 * paddingHorizontal;
    const halfWidth = containerWidth / 2;

    let coordinate = data.coordinate;
    let startX = Math.floor(coordinate - halfWidth) + 0.5;

    if (data.alwaysInViewPort) {
      const width = data.width;
      if (startX < 0) {
        coordinate += Math.abs(0 - startX);
        startX = Math.floor(coordinate - halfWidth) + 0.5;
      } else if (startX + containerWidth > width) {
        coordinate -= Math.abs(width - (startX + containerWidth));
        startX = Math.floor(coordinate - halfWidth) + 0.5;
      }
    }

    const endX = startX + containerWidth;
    const startY = Math.ceil(0 + options.borderSize + options.offsetSize + options.paddingTop + options.fontSize + options.paddingBottom);

    ctx.fillStyle = data.background;
    const scaledStartX = Math.round(startX * pixelRatio);
    const scaledStartY = Math.round(0 * pixelRatio);
    const scaledEndX = Math.round(endX * pixelRatio);
    const scaledEndY = Math.round(startY * pixelRatio);
    const scaledBorderRadius = Math.round(2 * pixelRatio);

    ctx.beginPath();
    ctx.moveTo(scaledStartX, scaledStartY);
    ctx.lineTo(scaledStartX, scaledEndY - scaledBorderRadius);
    ctx.arcTo(scaledStartX, scaledEndY, scaledStartX + scaledBorderRadius, scaledEndY, scaledBorderRadius);
    ctx.lineTo(scaledEndX - scaledBorderRadius, scaledEndY);
    ctx.arcTo(scaledEndX, scaledEndY, scaledEndX, scaledEndY - scaledBorderRadius, scaledBorderRadius);
    ctx.lineTo(scaledEndX, scaledStartY);
    ctx.fill();

    const textBaselineY = 0 + options.borderSize + options.offsetSize + options.paddingTop + options.fontSize / 2;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = data.color;
    const yMidCorrection = options.widthCache.yMidCorrection(ctx, "Apr0");
    ctx.translate((startX + paddingHorizontal) * pixelRatio, (textBaselineY + yMidCorrection) * pixelRatio);
    drawScaled(ctx, pixelRatio, pixelRatio, () => {
      ctx.fillText(data.text, 0, 0);
    });
    ctx.restore();
  }
}

class TimeAxisView {
  constructor(model) {
    this._renderer = new TimeAxisViewRenderer();
    this._rendererData = {
      background: "",
      color: "",
      coordinate: 0,
      text: "",
      visible: false,
      width: 0,
      alwaysInViewPort: true
    };
    this._invalidated = true;
    this._model = model;
    this._renderer.setData(this._rendererData);
  }

  update() {
    this._invalidated = true;
  }

  renderer() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    return this._renderer;
  }

  coordinate() {
    return this._rendererData.coordinate;
  }

  _getAlwaysInViewPort() {
    return true;
  }

  _getText(index) {
    const time = this._model.timeScale().indexToUserTime(index);
    return time !== null ? this._model.dateTimeFormatter().format(time) : "";
  }

  _updateImpl() {
    const data = this._rendererData;
    data.visible = false;

    if (this._model.timeScale().isEmpty() || !this._isVisible()) {
      return;
    }

    const index = this._getIndex();
    if (index === null) {
      return;
    }

    data.visible = true;
    data.width = this._model.timeScale().width();
    data.background = this._getBgColor();
    data.color = colorFromBackground(data.background);
    data.coordinate = this._model.timeScale().indexToCoordinate(index);
    data.alwaysInViewPort = this._getAlwaysInViewPort();
    data.text = this._getText(index);

    this._invalidated = false;
  }
}

export { TimeAxisView };
