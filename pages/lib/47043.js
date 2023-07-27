import { makeFont, parseFont } from 'fontUtils';
import { getLogger } from 'logger';
import { drawPoly } from 'polyUtils';

const logger = getLogger('Model.ChartTradingUtils');

const chartTradingUtils = {
  _fontHeightCache: {},
  _parsedColorCache: {},

  _parseColor(color) {
    if (this._parsedColorCache[color]) {
      return this._parsedColorCache[color];
    }

    const div = document.createElement('div');
    div.style.color = color;

    const match = div.style.color.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    ) || div.style.color.match(
      /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/i
    );

    const parsedColor = {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4] || '1'
    };

    this._parsedColorCache[color] = parsedColor;
    return parsedColor;
  },

  getColorFromProperties(colorProperty, transparencyProperty) {
    const transparency = 1 - transparencyProperty.value();
    const parsedColor = this._parseColor(colorProperty.value());
    return `rgba(${parsedColor.r},${parsedColor.g},${parsedColor.b},${transparency})`;
  },

  setColorToProperties(color, colorProperty, transparencyProperty) {
    const parsedColor = this._parseColor(color);
    colorProperty.setValue(`rgb(${parsedColor.r},${parsedColor.g},${parsedColor.b})`);
    const transparency = 100 * (1 - parsedColor.a);
    transparencyProperty.setValue(Math.max(0, Math.min(transparency, 100)));
  },

  getFontFromProperties(fontProperty, sizeProperty, isBoldProperty, isItalicProperty) {
    return makeFont(
      sizeProperty.value(),
      fontProperty.value(),
      isItalicProperty.value() ? 'italic' : '',
      isBoldProperty.value() ? 'bold' : ''
    );
  },

  setFontToProperties(font, fontProperty, sizeProperty, isBoldProperty, isItalicProperty) {
    const parsedFont = parseFont(font);
    if (parsedFont !== null) {
      if (parsedFont.family.length > 0) {
        fontProperty.setValue(parsedFont.family);
      }
      sizeProperty.setValue(parsedFont.size);
      isBoldProperty.setValue(parsedFont.bold);
      isItalicProperty.setValue(parsedFont.italic);
    } else {
      logger.logError(`Invalid font: ${font}`);
    }
  },

  fontHeight(font) {
    if (!this._fontHeightCache[font]) {
      const span = document.createElement('span');
      span.appendChild(document.createTextNode('height'));
      document.body.appendChild(span);
      span.style.cssText = `font: ${font}; white-space: nowrap; display: inline;`;
      const height = span.offsetHeight;
      document.body.removeChild(span);
      this._fontHeightCache[font] = Math.ceil(height);
    }
    return this._fontHeightCache[font];
  },

  drawPolyHoverOrPress(context, points, hasPress, hasHover) {
    if (hasPress) {
      context.save();
      context.fillStyle = 'rgba(0, 0, 0, 0.15)';
      drawPoly(context, points, true);
      context.restore();
    } else if (hasHover) {
      context.save();
      context.fillStyle = 'rgba(0, 0, 0, 0.1)';
      drawPoly(context, points, true);
      context.restore();
    }
  },

  repaint(chart) {
    chart.lightUpdate();
  },

  roundToMinTick(source, value) {
    const base = 1 / source.mainSource().base();
    return base * Math.round(value / base);
  }
};

export default chartTradingUtils;