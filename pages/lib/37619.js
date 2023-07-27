import { LineToolTrading } from "./LineToolTrading";
// import { LineDataSource } from 'path/to/LineDataSource';
import { PositionAveragePriceAxisView } from "./PositionAveragePriceAxisView";

import chartTradingUtils from "./47043";

import { DefaultProperty } from "./46100";
import { PriceFormatter } from "./61146";
import { enabled } from "./helpers";
import { sortSourcesPreOrdered } from "./98517";

function ensureString(value) {
  return value == null ? (value = "") : (value += ""), value;
}

class PositionAdapter {
  constructor(line) {
    this._line = line;
    this._data = {
      bodyText: "position",
      quantityText: "0",
    };
    this._closeEnabled = true;
    this._direction = "buy";
    this._profitState = "neutral";
  }

  setDirection(direction) {
    this._direction = direction;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  setProfitState(profitState) {
    this._profitState = profitState;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  getPrice() {
    if (this._line.points().length > 0) {
      return this._line.points()[0].price;
    }
    if (this._line._timePoint.length > 0) {
      return this._line._timePoint[0].price;
    }
    return undefined;
  }

  setPrice(price) {
    if (this._line.points().length > 0) {
      const point = this._line.points()[0];
      point.price = price;
      this._line._points[0] = point;
      this._line.normalizePoints();
      this._line.updateAllViewsAndRedraw();
    }
    if (this._line._timePoint.length > 0) {
      this._line._timePoint[0].price = price;
    }
    return this;
  }

  getText() {
    return this._data.bodyText;
  }

  setText(text) {
    this._data.bodyText = text || "";
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  setTooltip(tooltip) {
    this._line.properties().tooltip.setValue(ensureString(tooltip));
    return this;
  }

  getTooltip() {
    return this._line.properties().tooltip.value();
  }

  setProtectTooltip(protectTooltip) {
    this._line
      .properties()
      .protectTooltip.setValue(ensureString(protectTooltip));
    return this;
  }

  getProtectTooltip() {
    return this._line.properties().protectTooltip.value();
  }

  setCloseTooltip(closeTooltip) {
    this._line.properties().closeTooltip.setValue(ensureString(closeTooltip));
    return this;
  }

  getCloseTooltip() {
    return this._line.properties().closeTooltip.value();
  }

  setReverseTooltip(reverseTooltip) {
    this._line
      .properties()
      .reverseTooltip.setValue(ensureString(reverseTooltip));
    return this;
  }

  getReverseTooltip() {
    return this._line.properties().reverseTooltip.value();
  }

  getQuantity() {
    return this._data.quantityText;
  }

  setQuantity(quantity) {
    this._data.quantityText = quantity || "";
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  getExtendLeft() {
    let extendLeft = this._line.properties().extendLeft.value();
    if (extendLeft === "inherit") {
      extendLeft = this._line._model
        .properties()
        .tradingProperties.extendLeft.value();
    }
    return extendLeft;
  }

  setExtendLeft(extendLeft) {
    this._line.properties().extendLeft.setValue(extendLeft);
    return this;
  }

  getLineLength() {
    let lineLength = this._line.properties().lineLength.value();
    if (lineLength === "inherit") {
      lineLength = this._line._model
        .properties()
        .tradingProperties.lineLength.value();
    }
    return lineLength;
  }

  setLineLength(lineLength) {
    this._line
      .properties()
      .lineLength.setValue(Math.max(0, Math.min(lineLength, 100)));
    return this;
  }

  getLineColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.lineBuyColor.value()
      : properties.lineSellColor.value();
  }

  setLineColor(color) {
    if (this._direction === "buy") {
      this.setLineBuyColor(color);
    } else {
      this.setLineSellColor(color);
    }
    return this;
  }

  setLineBuyColor(color) {
    this._line.properties().lineBuyColor.setValue(color);
    return this;
  }

  setLineSellColor(color) {
    this._line.properties().lineSellColor.setValue(color);
    return this;
  }

  getLineStyle() {
    let lineStyle = this._line.properties().lineStyle.value();
    if (lineStyle === "inherit") {
      lineStyle = this._line._model
        .properties()
        .tradingProperties.lineStyle.value();
    }
    return lineStyle;
  }

  setLineStyle(style) {
    this._line.properties().lineStyle.setValue(style);
    return this;
  }

  getLineWidth() {
    let lineWidth = this._line.properties().lineWidth.value();
    if (lineWidth === "inherit") {
      lineWidth = this._line._model
        .properties()
        .tradingProperties.lineWidth.value();
    }
    return lineWidth;
  }

  setLineWidth(width) {
    this._line.properties().lineWidth.setValue(width);
    return this;
  }

  getBodyBorderColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.bodyBorderBuyColor.value()
      : properties.bodyBorderSellColor.value();
  }

  setBodyBorderColor(color) {
    if (this._direction === "buy") {
      this.setBodyBorderBuyColor(color);
    } else {
      this.setBodyBorderSellColor(color);
    }
    return this;
  }

  setBodyBorderBuyColor(color) {
    this._line.properties().bodyBorderBuyColor.setValue(color);
    return this;
  }

  setBodyBorderSellColor(color) {
    this._line.properties().bodyBorderSellColor.setValue(color);
    return this;
  }

  getBodyBackgroundColor() {
    return chartTradingUtils.getColorFromProperties(
      this._line.properties().bodyBackgroundColor,
      this._line.properties().bodyBackgroundTransparency
    );
  }

  setBodyBackgroundColor(color) {
    chartTradingUtils.setColorToProperties(
      color,
      this._line.properties().bodyBackgroundColor,
      this._line.properties().bodyBackgroundTransparency
    );
    return this;
  }

  getBodyTextColor() {
    const properties = this._line.properties();
    if (this._profitState === "positive") {
      return properties.bodyTextPositiveColor.value();
    }
    if (this._profitState === "negative") {
      return properties.bodyTextNegativeColor.value();
    }
    return properties.bodyTextNeutralColor.value();
  }

  setBodyTextColor(color) {
    if (this._profitState === "positive") {
      this.setBodyTextPositiveColor(color);
    } else if (this._profitState === "negative") {
      this.setBodyTextNegativeColor(color);
    } else {
      this.setBodyTextNeutralColor(color);
    }
    return this;
  }

  setBodyTextPositiveColor(color) {
    this._line.properties().bodyTextPositiveColor.setValue(color);
    return this;
  }

  setBodyTextNegativeColor(color) {
    this._line.properties().bodyTextNegativeColor.setValue(color);
    return this;
  }

  setBodyTextNeutralColor(color) {
    this._line.properties().bodyTextNeutralColor.setValue(color);
    return this;
  }

  getBodyFont() {
    return chartTradingUtils.getFontFromProperties(
      this._line.properties().bodyFontFamily,
      this._line.properties().bodyFontSize,
      this._line.properties().bodyFontBold,
      this._line.properties().bodyFontItalic
    );
  }

  setBodyFont(font) {
    chartTradingUtils.setFontToProperties(
      font,
      this._line.properties().bodyFontFamily,
      this._line.properties().bodyFontSize,
      this._line.properties().bodyFontBold,
      this._line.properties().bodyFontItalic
    );
    return this;
  }

  getQuantityBorderColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.quantityBorderBuyColor.value()
      : properties.quantityBorderSellColor.value();
  }

  setQuantityBorderColor(color) {
    if (this._direction === "buy") {
      this.setQuantityBorderBuyColor(color);
    } else {
      this.setQuantityBorderSellColor(color);
    }
    return this;
  }

  setQuantityBorderBuyColor(color) {
    this._line.properties().quantityBorderBuyColor.setValue(color);
    return this;
  }

  setQuantityBorderSellColor(color) {
    this._line.properties().quantityBorderSellColor.setValue(color);
    return this;
  }

  getQuantityBackgroundColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.quantityBackgroundBuyColor.value()
      : properties.quantityBackgroundSellColor.value();
  }

  setQuantityBackgroundColor(color) {
    if (this._direction === "buy") {
      this.setQuantityBackgroundBuyColor(color);
    } else {
      this.setQuantityBackgroundSellColor(color);
    }
    return this;
  }

  setQuantityBackgroundBuyColor(color) {
    this._line.properties().quantityBackgroundBuyColor.setValue(color);
    return this;
  }

  setQuantityBackgroundSellColor(color) {
    this._line.properties().quantityBackgroundSellColor.setValue(color);
    return this;
  }

  getQuantityTextColor() {
    return chartTradingUtils.getColorFromProperties(
      this._line.properties().quantityTextColor,
      this._line.properties().quantityTextTransparency
    );
  }

  setQuantityTextColor(color) {
    chartTradingUtils.setColorToProperties(
      color,
      this._line.properties().quantityTextColor,
      this._line.properties().quantityTextTransparency
    );
    return this;
  }

  getQuantityFont() {
    return chartTradingUtils.getFontFromProperties(
      this._line.properties().quantityFontFamily,
      this._line.properties().quantityFontSize,
      this._line.properties().quantityFontBold,
      this._line.properties().quantityFontItalic
    );
  }

  setQuantityFont(font) {
    chartTradingUtils.setFontToProperties(
      font,
      this._line.properties().quantityFontFamily,
      this._line.properties().quantityFontSize,
      this._line.properties().quantityFontBold,
      this._line.properties().quantityFontItalic
    );
    return this;
  }

  getReverseButtonBorderColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.reverseButtonBorderBuyColor.value()
      : properties.reverseButtonBorderSellColor.value();
  }

  setReverseButtonBorderColor(color) {
    if (this._direction === "buy") {
      this.setReverseButtonBorderBuyColor(color);
    } else {
      this.setReverseButtonBorderSellColor(color);
    }
    return this;
  }

  setReverseButtonBorderBuyColor(color) {
    this._line.properties().reverseButtonBorderBuyColor.setValue(color);
    return this;
  }

  setReverseButtonBorderSellColor(color) {
    this._line.properties().reverseButtonBorderSellColor.setValue(color);
    return this;
  }

  getReverseButtonBackgroundColor() {
    return chartTradingUtils.getColorFromProperties(
      this._line.properties().reverseButtonBackgroundColor,
      this._line.properties().reverseButtonBackgroundTransparency
    );
  }

  setReverseButtonBackgroundColor(color) {
    chartTradingUtils.setColorToProperties(
      color,
      this._line.properties().reverseButtonBackgroundColor,
      this._line.properties().reverseButtonBackgroundTransparency
    );
    return this;
  }

  getReverseButtonIconColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.reverseButtonIconBuyColor.value()
      : properties.reverseButtonIconSellColor.value();
  }

  setReverseButtonIconColor(color) {
    if (this._direction === "buy") {
      this.setReverseButtonIconBuyColor(color);
    } else {
      this.setReverseButtonIconSellColor(color);
    }
    return this;
  }

  setReverseButtonIconBuyColor(color) {
    this._line.properties().reverseButtonIconBuyColor.setValue(color);
    return this;
  }

  setReverseButtonIconSellColor(color) {
    this._line.properties().reverseButtonIconSellColor.setValue(color);
    return this;
  }

  getCloseButtonBorderColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.closeButtonBorderBuyColor.value()
      : properties.closeButtonBorderSellColor.value();
  }

  setCloseButtonBorderColor(color) {
    if (this._direction === "buy") {
      this.setCloseButtonBorderBuyColor(color);
    } else {
      this.setCloseButtonBorderSellColor(color);
    }
    return this;
  }

  setCloseButtonBorderBuyColor(color) {
    this._line.properties().closeButtonBorderBuyColor.setValue(color);
    return this;
  }

  setCloseButtonBorderSellColor(color) {
    this._line.properties().closeButtonBorderSellColor.setValue(color);
    return this;
  }

  getCloseButtonBackgroundColor() {
    return chartTradingUtils.getColorFromProperties(
      this._line.properties().closeButtonBackgroundColor,
      this._line.properties().closeButtonBackgroundTransparency
    );
  }

  setCloseButtonBackgroundColor(color) {
    chartTradingUtils.setColorToProperties(
      color,
      this._line.properties().closeButtonBackgroundColor,
      this._line.properties().closeButtonBackgroundTransparency
    );
    return this;
  }

  getCloseButtonIconColor() {
    const properties = this._line.properties();
    return this._direction === "buy"
      ? properties.closeButtonIconBuyColor.value()
      : properties.closeButtonIconSellColor.value();
  }

  setCloseButtonIconColor(color) {
    if (this._direction === "buy") {
      this.setCloseButtonIconBuyColor(color);
    } else {
      this.setCloseButtonIconSellColor(color);
    }
    return this;
  }

  setCloseButtonIconBuyColor(color) {
    this._line.properties().closeButtonIconBuyColor.setValue(color);
    return this;
  }

  setCloseButtonIconSellColor(color) {
    this._line.properties().closeButtonIconSellColor.setValue(color);
    return this;
  }

  block() {
    this._blocked = true;
    this._line.updateAllViewsAndRedraw();
  }

  unblock() {
    this._blocked = false;
    this._line.updateAllViewsAndRedraw();
  }

  isFunction(callback) {
    return typeof callback === "function";
  }

  onReverse(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onReverseData = data;
        this._onReverseCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onReverseCallback = data;
    }
    return this;
  }

  callOnReverse() {
    if (this.isFunction(this._onReverseCallback)) {
      this._onReverseCallback.call(this, this._onReverseData);
    }
  }

  isOnReverseCallbackPresent() {
    return this.isFunction(this._onReverseCallback);
  }

  onClose(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onCloseData = data;
        this._onCloseCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onCloseCallback = data;
    }
    return this;
  }

  setCloseEnabled(enabled) {
    if (this._closeEnabled !== enabled) {
      this._closeEnabled = enabled;
      if (this._onCloseCallback) {
        this._line.updateAllViewsAndRedraw();
      }
    }
    return this;
  }

  isCloseEnabled() {
    return this._closeEnabled;
  }

  callOnClose() {
    if (this.isFunction(this._onCloseCallback) && this._closeEnabled) {
      this._onCloseCallback.call(this, this._onCloseData);
    }
  }

  isOnCloseCallbackPresent() {
    return this._closeEnabled && this.isFunction(this._onCloseCallback);
  }

  onModify(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onModifyData = data;
        this._onModifyCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onModifyCallback = data;
    }
    return this;
  }

  callOnModify() {
    if (this.isFunction(this._onModifyCallback)) {
      this._onModifyCallback.call(this, this._onModifyData);
    }
  }

  onContextMenu(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onContextMenuData = data;
        this._onContextMenuCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onContextMenuCallback = data;
    }
    return this;
  }

  shouldShowContextMenu() {
    return this.isFunction(this._onContextMenuCallback);
  }

  callOnContextMenu() {
    if (this.isFunction(this._onContextMenuCallback)) {
      return this._onContextMenuCallback.call(this, this._onContextMenuData);
    }
  }

  remove() {
    this._line._model.removeSource(this._line);
    delete this._line;
  }
}

class PositionLineTool extends LineToolTrading {
  constructor(line, model) {
    super(line, model || PositionLineTool.createProperties());
    this._adapter = new PositionAdapter(this);
    import("path/to/PositionPaneView").then(({ PositionPaneView }) => {
      this._setPaneViews([new PositionPaneView(this, this._model)]);
    });
    const symbolInfo = line.mainSeries().symbolInfo();
    const priceScale = symbolInfo ? symbolInfo.pricescale : 100;
    const fractional = symbolInfo ? symbolInfo.fractional : false;
    const minMove = symbolInfo ? symbolInfo.minmov : 1;
    const minMove2 = symbolInfo ? symbolInfo.minmove2 : undefined;
    this._formatter = new PriceFormatter(
      priceScale,
      minMove,
      fractional,
      minMove2
    );
  }

  zOrder() {
    return sortSourcesPreOrdered.LineToolPosition;
  }

  isSpeciallyZOrderedSource() {
    return true;
  }

  setPoint(index, point) {
    this._points[index] = point;
    this.normalizePoints();
  }

  addPoint(point, timestamp) {
    this._points.push(point);
    this._lastPoint = null;
    this.normalizePoints();
    this.createServerPoints();
    return true;
  }

  name() {
    return "Position";
  }

  createPriceAxisView(index) {
    this._priceAxisView = new PositionAveragePriceAxisView(this, {
      pointIndex: index,
      backgroundPropertyGetter: () => this._adapter.getLineColor(),
    });
    return this._priceAxisView;
  }

  paneViews() {
    return enabled("snapshot_trading_drawings")
      ? null
      : this._model.properties().tradingProperties.showPositions.value()
      ? super.paneViews()
      : null;
  }

  priceAxisViews(startPointIndex, endPointIndex) {
    return enabled("snapshot_trading_drawings")
      ? null
      : this._model.properties().tradingProperties.showPositions.value()
      ? super.priceAxisViews(startPointIndex, endPointIndex)
      : null;
  }

  hasContextMenu() {
    return this._adapter.shouldShowContextMenu();
  }

  contextMenuItems() {
    return this._adapter.callOnContextMenu();
  }

  formatter() {
    return this._formatter;
  }

  static createProperties(properties) {
    const defaultProperties = new DefaultProperty(
      "linetoolposition",
      properties,
      false,
      false
    );
    this._configureProperties(defaultProperties);
    return defaultProperties;
  }

  static _configureProperties() {
    // Modify default properties as needed
  }
}

export { PositionLineTool };
