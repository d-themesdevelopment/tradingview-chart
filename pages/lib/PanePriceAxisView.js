

class PriceAxisViewRenderer {
    constructor(textWidthCache) {
      this._priceAxisViewRenderer = null;
      this._rendererOptions = null;
      this._align = "right";
      this._width = 0;
      this._height = 0;
      this._textWidthCache = textWidthCache;
    }
  
    setParams(priceAxisViewRenderer, rendererOptions, width, height, align) {
      this._priceAxisViewRenderer = priceAxisViewRenderer;
      this._rendererOptions = rendererOptions;
      this._width = width;
      this._height = height;
      this._align = align;
    }
  
    draw(context, pixelRatio) {
      if (this._rendererOptions && this._priceAxisViewRenderer) {
        this._priceAxisViewRenderer.draw(
          context,
          this._rendererOptions,
          this._textWidthCache,
          this._width,
          this._height,
          this._align,
          pixelRatio
        );
      }
    }
  
    hitTest(position) {
      return this._priceAxisViewRenderer?.hitTest?.(position, this._width, this._align) ?? null;
    }
  }
  
  class PanePriceAxisView {
    constructor(priceAxisView, dataSource, chartModel) {
      this._renderer = null;
      this._invalidated = true;
      this._priceAxisView = priceAxisView;
      this._textWidthCache = new TextWidthCache(100);
      this._dataSource = dataSource;
      this._chartModel = chartModel;
      this._fontSize = -1;
      this._panePriceAxisViewRenderer = new PriceAxisViewRenderer(this._textWidthCache);
    }
  
    update() {
      this._invalidated = true;
    }
  
    renderer(width, height) {
      if (this._invalidated) {
        this._updateRenderer(width, height);
      }
      return this._renderer;
    }
  
    _position() {
      const crossHairSource = this._chartModel.crossHairSource();
      const pane = this._dataSource === crossHairSource ? crossHairSource.pane : this._chartModel.paneForSource(this._dataSource);
  
      if (!pane) {
        return null;
      }
  
      const priceScale = this._priceScale();
      if (!priceScale) {
        return null;
      }
  
      let position = pane.priceScalePosition(priceScale);
      if (position === "overlay") {
        position = pane.priceScalePosition(pane.defaultPriceScale());
      }
  
      return position === "overlay" ? null : position;
    }
  
    _updateRenderer(width, height) {
      this._renderer = null;
      const position = this._position();
      if (position === null) {
        return;
      }
  
      const rendererOptions = this._chartModel.priceAxisRendererOptions();
      if (rendererOptions.fontSize !== this._fontSize) {
        this._fontSize = rendererOptions.fontSize;
        this._textWidthCache.reset();
      }
  
      this._panePriceAxisViewRenderer.setParams(
        this._priceAxisView.paneRenderer(),
        rendererOptions,
        width,
        height,
        position
      );
      this._renderer = this._panePriceAxisViewRenderer;
      this._invalidated = false;
    }
  
    _priceScale() {
      return this._dataSource.priceScale();
    }
  }
  