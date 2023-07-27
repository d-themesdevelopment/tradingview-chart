
(e, t, i) => {
    "use strict";
    
    // Import dependencies
    const { ensureDefined } = i(50151);
    const { HitTestResult, HitTarget } = i(18807);
    const { optimalCandlestickWidth, interactionTolerance, fillRectInnerBorder } = i(45197);
    const { PaneRendererSeriesBase } = i(75257);
  
    class PaneRendererCandles extends PaneRendererSeriesBase {
      constructor(data) {
        super();
        this._barSpacing = 1;
        this._barWidth = 1;
        this._borderVisible = false;
        this._barBorderWidth = 1;
        this._wickVisible = false;
        this._bodyVisible = true;
        this._borderColor = undefined;
        this._wickColor = undefined;
        this._hittest = undefined;
        this._isPriceScaleInverted = false;
  
        if (data) {
          this.setData(data);
        }
      }
  
      setData(data) {
        this._bars = data.bars;
        this._barSpacing = data.barSpacing;
        this._borderVisible = data.borderVisible;
        this._bodyVisible = data.bodyVisible;
        this._wickVisible = data.wickVisible;
        this._borderColor = data.borderColor;
        this._wickColor = data.wickColor;
        this._hittest = data.hittest;
        this._isPriceScaleInverted = data.isPriceScaleInverted;
      }
  
      hitTest(position) {
        return (this._wickVisible || this._borderVisible || this._bodyVisible)
          ? super.hitTest(position)
          : null;
      }
  
      draw(context, rendererOptions) {
        if (this._bars.length === 0) {
          return;
        }
  
        const pixelRatio = rendererOptions.pixelRatio;
  
        this._barWidth = optimalCandlestickWidth(this._barSpacing, pixelRatio);
  
        if (this._barWidth >= 2) {
          if (Math.floor(pixelRatio) % 2 !== this._barWidth % 2) {
            this._barWidth--;
          }
        }
  
        if (this._wickVisible) {
          this._drawWicks(context, pixelRatio);
        }
  
        if (this._borderVisible) {
          this._drawBorder(context, pixelRatio);
        }
  
        if (this._bodyVisible) {
          this._drawCandles(context, pixelRatio);
        }
      }
  
      _getTolerance() {
        return interactionTolerance().series + this._barBorderWidth / 2;
      }
  
      _getBarSpacing() {
        return this._barSpacing;
      }
  
      _getHitTest() {
        return this._hittest || new HitTestResult(HitTarget.Regular);
      }
  
      _isPointAtBar(bar, y, tolerance) {
        const hasBody = this._bodyVisible || this._borderVisible;
        const hasWick = this._wickVisible;
  
        if (!hasBody && !hasWick) {
          return false;
        }
  
        if (hasBody) {
          const minPrice = hasWick ? Math.min(bar.high, bar.low) : Math.min(bar.open, bar.close);
          const maxPrice = hasWick ? Math.max(bar.high, bar.low) : Math.max(bar.open, bar.close);
          return minPrice - tolerance <= y && y <= maxPrice + tolerance;
        } else {
          const minPrice = Math.min(bar.open, bar.close);
          const maxPrice = Math.max(bar.open, bar.close);
          return (bar.high - tolerance <= y && y <= minPrice + tolerance) ||
                 (maxPrice - tolerance <= y && y <= bar.low + tolerance);
        }
      }
  
      _drawWicks(context, pixelRatio) {
        const bars = this._bars;
        let color = "";
        let lineWidth = Math.min(Math.floor(pixelRatio), Math.floor(this._barSpacing * pixelRatio));
        lineWidth = Math.max(Math.floor(pixelRatio), Math.min(lineWidth, this._barWidth));
        const halfLineWidth = Math.floor(0.5 * lineWidth);
        let lastX = null;
  
        for (const bar of bars) {
          const wickColor = bar.wickColor ? bar.wickColor : ensureDefined(this._wickColor);
          if (wickColor !== color) {
            context.fillStyle = wickColor;
            color = wickColor;
          }
  
          let bodyTop = Math.round(Math.min(bar.open, bar.close) * pixelRatio);
          let bodyBottom = Math.round(Math.max(bar.open, bar.close) * pixelRatio);
          let x = Math.round(bar.time * pixelRatio) - halfLineWidth;
          const xEnd = x + lineWidth - 1;
          const wickTop = Math.round(bar.high * pixelRatio);
          const wickBottom = Math.round(bar.low * pixelRatio);
  
          if (this._isPriceScaleInverted) {
            [wickTop, bodyTop] = [bodyTop, wickTop];
          }
  
          let startX = Math.max(lastX + 1, x);
          startX = Math.min(startX, xEnd);
          const width = xEnd - startX + 1;
  
          context.fillRect(startX, wickTop, width, bodyTop - wickTop);
          context.fillRect(startX, bodyBottom + 1, width, wickBottom - bodyBottom - 1);
  
          lastX = xEnd;
        }
      }
  
      _calculateBorderWidth(pixelRatio) {
        let borderWidth = Math.floor(1 * pixelRatio);
  
        if (this._barWidth <= 2 * borderWidth) {
          borderWidth = Math.floor(0.5 * (this._barWidth - 1));
        }
  
        return Math.max(Math.floor(pixelRatio), borderWidth);
      }
  
      _drawBorder(context, pixelRatio) {
        let color = "";
        const borderWidth = this._calculateBorderWidth(pixelRatio);
        let lastX = null;
  
        for (const bar of this._bars) {
          if (bar.borderColor !== color) {
            context.fillStyle = bar.borderColor ? bar.borderColor : ensureDefined(this._borderColor);
            color = bar.borderColor;
          }
  
          if (this._bodyVisible && bar.hollow) {
            continue;
          }
  
          let x = Math.round(bar.time * pixelRatio) - Math.floor(0.5 * this._barWidth);
          const xEnd = x + this._barWidth - 1;
          const bodyTop = Math.round(Math.min(bar.open, bar.close) * pixelRatio);
          const bodyBottom = Math.round(Math.max(bar.open, bar.close) * pixelRatio);
  
          if (lastX !== null) {
            x = Math.max(lastX + 1, x);
            x = Math.min(x, xEnd);
          }
  
          if (this._barSpacing * pixelRatio > 2 * borderWidth) {
            fillRectInnerBorder(context, x, bodyTop, xEnd - x + 1, bodyBottom - bodyTop + 1, borderWidth);
          } else {
            const width = xEnd - x + 1;
            context.fillRect(x, bodyTop, width, bodyBottom - bodyTop + 1);
          }
  
          lastX = xEnd;
        }
      }
  
      _drawCandles(context, pixelRatio) {
        let color = "";
        const borderWidth = this._calculateBorderWidth(pixelRatio);
  
        for (const bar of this._bars) {
          if (this._borderVisible && this._barWidth <= 2 * borderWidth && !bar.hollow) {
            continue;
          }
  
          let bodyTop = Math.round(Math.min(bar.open, bar.close) * pixelRatio);
          let bodyBottom = Math.round(Math.max(bar.open, bar.close) * pixelRatio);
          let x = Math.round(bar.time * pixelRatio) - Math.floor(0.5 * this._barWidth);
          const xEnd = x + this._barWidth - 1;
  
          if (bar.color !== color) {
            const fillColor = bar.color;
            context.fillStyle = fillColor;
            color = fillColor;
          }
  
          if (bar.hollow) {
            context.fillStyle = bar.color;
            fillRectInnerBorder(context, x, bodyTop, xEnd - x + 1, bodyBottom - bodyTop + 1, borderWidth);
          } else {
            if (this._borderVisible) {
              x += borderWidth;
              bodyTop += borderWidth;
              xEnd -= borderWidth;
              bodyBottom -= borderWidth;
            }
  
            if (bodyTop > bodyBottom) {
              continue;
            }
  
            context.fillRect(x, bodyTop, xEnd - x + 1, bodyBottom - bodyTop + 1);
          }
        }
      }
    }
  
    return { PaneRendererCandles };
  }