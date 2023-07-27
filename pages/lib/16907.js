"use strict";

var LineToolTrading = i(87564).LineToolTrading;
var LineToolPriceAxisView = i(71243).LineToolPriceAxisView;
var getColorFromProperties = i(47043).getColorFromProperties;
var LineDataSource = i(13087).LineDataSource;
var DefaultProperty = i(46100).DefaultProperty;
const enabled = i(14483).enabled;
var sortSourcesPreOrdered = i(98517).sortSourcesPreOrdered.LineToolOrder;

function toString(value) {
  return null == value ? (value = "") : (value += ""), value;
}

class Adapter {
  constructor(line) {
    this._line = line;
    this._data = {
      bodyText: "order",
      quantityText: "0",
    };
    this._editable = true;
    this._cancellable = true;
    this._mode = "";
    this._direction = "buy";
    this._active = true;
  }

  setMode(mode) {
    this._mode = mode;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  setDirection(direction) {
    this._direction = direction;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  setActive(active) {
    this._active = active;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  setEditable(editable) {
    this._editable = editable;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  getEditable() {
    return this._editable;
  }

  setCancellable(cancellable) {
    this._cancellable = cancellable;
    this._line.updateAllViewsAndRedraw();
    return this;
  }

  getCancellable() {
    return this._cancellable;
  }

  hasMoveCallback() {
    return this.isFunction(this._onMoveCallback);
  }

  hasModifyCallback() {
    return this.isFunction(this._onModifyCallback);
  }

  getPrice() {
    if (this._line.points().length > 0) {
      return this._line.points()[0].price;
    } else if (this._line._timePoint.length > 0) {
      return this._line._timePoint[0].price;
    } else {
      return undefined;
    }
  }

  setPrice(price) {
    if (this._line.points().length > 0) {
      var point = this._line.points()[0];
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
    this._line.properties().tooltip.setValue(toString(tooltip));
    return this;
  }

  getTooltip() {
    return this._line.properties().tooltip.value();
  }

  setModifyTooltip(tooltip) {
    this._line.properties().modifyTooltip.setValue(toString(tooltip));
    return this;
  }

  getModifyTooltip() {
    return this._line.properties().modifyTooltip.value();
  }

  setCancelTooltip(tooltip) {
    this._line.properties().cancelTooltip.setValue(toString(tooltip));
    return this;
  }

  getCancelTooltip() {
    return this._line.properties().cancelTooltip.value();
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
    var extendLeft = this._line.properties().extendLeft.value();
    if (extendLeft === "inherit") {
      return this._line._model
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
    var lineLength = this._line.properties().lineLength.value();
    if (lineLength === "inherit") {
      return this._line._model
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
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.lineActiveBuyColor.value()
        : properties.lineInactiveBuyColor.value();
    }
    return this._active
      ? properties.lineActiveSellColor.value()
      : properties.lineInactiveSellColor.value();
  }

  setLineColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setLineActiveBuyColor(color)
        : this.setLineInactiveBuyColor(color);
    } else {
      this._active
        ? this.setLineActiveSellColor(color)
        : this.setLineInactiveSellColor(color);
    }
    return this;
  }

  setLineActiveBuyColor(color) {
    this._line.properties().lineActiveBuyColor.setValue(color);
    return this;
  }

  setLineInactiveBuyColor(color) {
    this._line.properties().lineInactiveBuyColor.setValue(color);
    return this;
  }

  setLineActiveSellColor(color) {
    this._line.properties().lineActiveSellColor.setValue(color);
    return this;
  }

  setLineInactiveSellColor(color) {
    this._line.properties().lineInactiveSellColor.setValue(color);
    return this;
  }

  getLineStyle() {
    var lineStyle = this._line.properties().lineStyle.value();
    return lineStyle === "inherit"
      ? this._line._model.properties().tradingProperties.lineStyle.value()
      : lineStyle;
  }

  setLineStyle(style) {
    this._line.properties().lineStyle.setValue(style);
    return this;
  }

  getLineWidth() {
    var lineWidth = this._line.properties().lineWidth.value();
    return lineWidth === "inherit"
      ? this._line._model.properties().tradingProperties.lineWidth.value()
      : lineWidth;
  }

  setLineWidth(width) {
    this._line.properties().lineWidth.setValue(width);
    return this;
  }

  getBodyBorderColor() {
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.bodyBorderActiveBuyColor.value()
        : properties.bodyBorderInactiveBuyColor.value();
    }
    return this._active
      ? properties.bodyBorderActiveSellColor.value()
      : properties.bodyBorderInactiveSellColor.value();
  }

  setBodyBorderColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setBodyBorderActiveBuyColor(color)
        : this.setBodyBorderInactiveBuyColor(color);
    } else {
      this._active
        ? this.setBodyBorderActiveSellColor(color)
        : this.setBodyBorderInactiveSellColor(color);
    }
    return this;
  }

  setBodyBorderActiveBuyColor(color) {
    this._line.properties().bodyBorderActiveBuyColor.setValue(color);
    return this;
  }

  setBodyBorderInactiveBuyColor(color) {
    this._line.properties().bodyBorderInactiveBuyColor.setValue(color);
    return this;
  }

  setBodyBorderActiveSellColor(color) {
    this._line.properties().bodyBorderActiveSellColor.setValue(color);
    return this;
  }

  setBodyBorderInactiveSellColor(color) {
    this._line.properties().bodyBorderInactiveSellColor.setValue(color);
    return this;
  }

  getBodyBackgroundColor() {
    return getColorFromProperties(
      this._line.properties().bodyBackgroundColor,
      this._line.properties().bodyBackgroundTransparency
    );
  }

  setBodyBackgroundColor(color) {
    getColorFromProperties(
      color,
      this._line.properties().bodyBackgroundColor,
      this._line.properties().bodyBackgroundTransparency
    );
    return this;
  }

  getBodyTextColor() {
    var properties = this._line.properties();
    if (this._mode === "limit") {
      return this._active
        ? properties.bodyTextActiveLimitColor.value()
        : properties.bodyTextInactiveLimitColor.value();
    } else if (this._mode === "stop") {
      return this._active
        ? properties.bodyTextActiveStopColor.value()
        : properties.bodyTextInactiveStopColor.value();
    } else if (this._direction === "buy") {
      return this._active
        ? properties.bodyTextActiveBuyColor.value()
        : properties.bodyTextInactiveBuyColor.value();
    }
    return this._active
      ? properties.bodyTextActiveSellColor.value()
      : properties.bodyTextInactiveSellColor.value();
  }

  setBodyTextColor(color) {
    if (this._mode === "limit") {
      this._active
        ? this.setBodyTextActiveLimitColor(color)
        : this.setBodyTextInactiveLimitColor(color);
    } else if (this._mode === "stop") {
      this._active
        ? this.setBodyTextActiveStopColor(color)
        : this.setBodyTextInactiveStopColor(color);
    } else if (this._direction === "buy") {
      this._active
        ? this.setBodyTextActiveBuyColor(color)
        : this.setBodyTextInactiveBuyColor(color);
    } else {
      this._active
        ? this.setBodyTextActiveSellColor(color)
        : this.setBodyTextInactiveSellColor(color);
    }
    return this;
  }

  setBodyTextInactiveLimitColor(color) {
    this._line.properties().bodyTextInactiveLimitColor.setValue(color);
    return this;
  }

  setBodyTextActiveLimitColor(color) {
    this._line.properties().bodyTextActiveLimitColor.setValue(color);
    return this;
  }

  setBodyTextInactiveStopColor(color) {
    this._line.properties().bodyTextInactiveStopColor.setValue(color);
    return this;
  }

  setBodyTextActiveStopColor(color) {
    this._line.properties().bodyTextActiveStopColor.setValue(color);
    return this;
  }

  setBodyTextInactiveBuyColor(color) {
    this._line.properties().bodyTextInactiveBuyColor.setValue(color);
    return this;
  }

  setBodyTextActiveBuyColor(color) {
    this._line.properties().bodyTextActiveBuyColor.setValue(color);
    return this;
  }

  setBodyTextInactiveSellColor(color) {
    this._line.properties().bodyTextInactiveSellColor.setValue(color);
    return this;
  }

  setBodyTextActiveSellColor(color) {
    this._line.properties().bodyTextActiveSellColor.setValue(color);
    return this;
  }

  getBodyFont() {
    return n.getFontFromProperties(
      this._line.properties().bodyFontFamily,
      this._line.properties().bodyFontSize,
      this._line.properties().bodyFontBold,
      this._line.properties().bodyFontItalic
    );
  }

  setBodyFont(font) {
    n.setFontToProperties(
      font,
      this._line.properties().bodyFontFamily,
      this._line.properties().bodyFontSize,
      this._line.properties().bodyFontBold,
      this._line.properties().bodyFontItalic
    );
    return this;
  }

  getQuantityBorderColor() {
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.quantityBorderActiveBuyColor.value()
        : properties.quantityBorderInactiveBuyColor.value();
    }
    return this._active
      ? properties.quantityBorderActiveSellColor.value()
      : properties.quantityBorderInactiveSellColor.value();
  }

  setQuantityBorderColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setQuantityBorderActiveBuyColor(color)
        : this.setQuantityBorderInactiveBuyColor(color);
    } else {
      this._active
        ? this.setQuantityBorderActiveSellColor(color)
        : this.setQuantityBorderInactiveSellColor(color);
    }
    return this;
  }

  setQuantityBorderActiveBuyColor(color) {
    this._line.properties().quantityBorderActiveBuyColor.setValue(color);
    return this;
  }

  setQuantityBorderInactiveBuyColor(color) {
    this._line.properties().quantityBorderInactiveBuyColor.setValue(color);
    return this;
  }

  setQuantityBorderActiveSellColor(color) {
    this._line.properties().quantityBorderActiveSellColor.setValue(color);
    return this;
  }

  setQuantityBorderInactiveSellColor(color) {
    this._line.properties().quantityBorderInactiveSellColor.setValue(color);
    return this;
  }

  getQuantityBackgroundColor() {
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.quantityBackgroundActiveBuyColor.value()
        : properties.quantityBackgroundInactiveBuyColor.value();
    }
    return this._active
      ? properties.quantityBackgroundActiveSellColor.value()
      : properties.quantityBackgroundInactiveSellColor.value();
  }

  setQuantityBackgroundColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setQuantityBackgroundActiveBuyColor(color)
        : this.setQuantityBackgroundInactiveBuyColor(color);
    } else {
      this._active
        ? this.setQuantityBackgroundActiveSellColor(color)
        : this.setQuantityBackgroundInactiveSellColor(color);
    }
    return this;
  }

  setQuantityBackgroundActiveBuyColor(color) {
    this._line.properties().quantityBackgroundActiveBuyColor.setValue(color);
    return this;
  }

  setQuantityBackgroundInactiveBuyColor(color) {
    this._line.properties().quantityBackgroundInactiveBuyColor.setValue(color);
    return this;
  }

  setQuantityBackgroundActiveSellColor(color) {
    this._line.properties().quantityBackgroundActiveSellColor.setValue(color);
    return this;
  }

  setQuantityBackgroundInactiveSellColor(color) {
    this._line.properties().quantityBackgroundInactiveSellColor.setValue(color);
    return this;
  }

  getQuantityTextColor() {
    return getColorFromProperties(
      this._line.properties().quantityTextColor,
      this._line.properties().quantityTextTransparency
    );
  }

  setQuantityTextColor(color) {
    getColorFromProperties(
      color,
      this._line.properties().quantityTextColor,
      this._line.properties().quantityTextTransparency
    );
    return this;
  }

  getQuantityFont() {
    return n.getFontFromProperties(
      this._line.properties().quantityFontFamily,
      this._line.properties().quantityFontSize,
      this._line.properties().quantityFontBold,
      this._line.properties().quantityFontItalic
    );
  }

  setQuantityFont(font) {
    n.setFontToProperties(
      font,
      this._line.properties().quantityFontFamily,
      this._line.properties().quantityFontSize,
      this._line.properties().quantityFontBold,
      this._line.properties().quantityFontItalic
    );
    return this;
  }

  getCancelButtonBorderColor() {
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.cancelButtonBorderActiveBuyColor.value()
        : properties.cancelButtonBorderInactiveBuyColor.value();
    }
    return this._active
      ? properties.cancelButtonBorderActiveSellColor.value()
      : properties.cancelButtonBorderInactiveSellColor.value();
  }

  setCancelButtonBorderColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setCancelButtonBorderActiveBuyColor(color)
        : this.setCancelButtonBorderInactiveBuyColor(color);
    } else {
      this._active
        ? this.setCancelButtonBorderActiveSellColor(color)
        : this.setCancelButtonBorderInactiveSellColor(color);
    }
    return this;
  }

  setCancelButtonBorderActiveBuyColor(color) {
    this._line.properties().cancelButtonBorderActiveBuyColor.setValue(color);
    return this;
  }

  setCancelButtonBorderInactiveBuyColor(color) {
    this._line.properties().cancelButtonBorderInactiveBuyColor.setValue(color);
    return this;
  }

  setCancelButtonBorderActiveSellColor(color) {
    this._line.properties().cancelButtonBorderActiveSellColor.setValue(color);
    return this;
  }

  setCancelButtonBorderInactiveSellColor(color) {
    this._line.properties().cancelButtonBorderInactiveSellColor.setValue(color);
    return this;
  }

  getCancelButtonBackgroundColor() {
    return getColorFromProperties(
      this._line.properties().cancelButtonBackgroundColor,
      this._line.properties().cancelButtonBackgroundTransparency
    );
  }

  setCancelButtonBackgroundColor(color) {
    getColorFromProperties(
      color,
      this._line.properties().cancelButtonBackgroundColor,
      this._line.properties().cancelButtonBackgroundTransparency
    );
    return this;
  }

  getCancelButtonIconColor() {
    var properties = this._line.properties();
    if (this._direction === "buy") {
      return this._active
        ? properties.cancelButtonIconActiveBuyColor.value()
        : properties.cancelButtonIconInactiveBuyColor.value();
    }
    return this._active
      ? properties.cancelButtonIconActiveSellColor.value()
      : properties.cancelButtonIconInactiveSellColor.value();
  }

  setCancelButtonIconColor(color) {
    if (this._direction === "buy") {
      this._active
        ? this.setCancelButtonIconActiveBuyColor(color)
        : this.setCancelButtonIconInactiveBuyColor(color);
    } else {
      this._active
        ? this.setCancelButtonIconActiveSellColor(color)
        : this.setCancelButtonIconInactiveSellColor(color);
    }
    return this;
  }

  setCancelButtonIconActiveBuyColor(color) {
    this._line.properties().cancelButtonIconActiveBuyColor.setValue(color);
    return this;
  }

  setCancelButtonIconInactiveBuyColor(color) {
    this._line.properties().cancelButtonIconInactiveBuyColor.setValue(color);
    return this;
  }

  setCancelButtonIconActiveSellColor(color) {
    this._line.properties().cancelButtonIconActiveSellColor.setValue(color);
    return this;
  }

  setCancelButtonIconInactiveSellColor(color) {
    this._line.properties().cancelButtonIconInactiveSellColor.setValue(color);
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

  getBlocked() {
    return this._blocked;
  }

  isFunction(callback) {
    return typeof callback === "function";
  }

  onCancel(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onCancelData = data;
        this._onCancelCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onCancelCallback = data;
    }
    return this;
  }

  callOnCancel() {
    if (this.isFunction(this._onCancelCallback)) {
      this._onCancelCallback.call(this, this._onCancelData);
    }
  }

  isOnCancelCallbackPresent() {
    return this.isFunction(this._onCancelCallback);
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

  onMove(data, callback) {
    if (callback) {
      if (this.isFunction(callback)) {
        this._onMoveData = data;
        this._onMoveCallback = callback;
      }
    } else if (this.isFunction(data)) {
      this._onMoveCallback = data;
    }
    return this;
  }

  callOnMove() {
    if (this.isFunction(this._onMoveCallback)) {
      this._onMoveCallback.call(this, this._onMoveData);
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
}

class LineToolOrder extends LineToolTrading {
  constructor() {
    super();
    this._source = new LineDataSource();
    this._adapter = new Adapter(this);
    this._adapter.setMode("limit");
    this._adapter.setDirection("buy");
  }

  applyEventProperties() {
    const properties = this.properties();
    this._adapter
      .setText(properties.text.value())
      .setTooltip(properties.tooltip.value())
      .setModifyTooltip(properties.modifyTooltip.value())
      .setCancelTooltip(properties.cancelTooltip.value())
      .setQuantity(properties.quantityText.value())
      .setExtendLeft(properties.extendLeft.value())
      .setLineLength(properties.lineLength.value())
      .setLineColor(properties.lineColor.value())
      .setLineStyle(properties.lineStyle.value())
      .setLineWidth(properties.lineWidth.value())
      .setBodyBorderColor(properties.bodyBorderColor.value())
      .setBodyBackgroundColor(properties.bodyBackgroundColor.value())
      .setBodyTextColor(properties.bodyTextColor.value())
      .setBodyFont(properties.bodyFont.value())
      .setQuantityBorderColor(properties.quantityBorderColor.value())
      .setQuantityBackgroundColor(properties.quantityBackgroundColor.value())
      .setQuantityTextColor(properties.quantityTextColor.value())
      .setQuantityFont(properties.quantityFont.value())
      .setCancelButtonBorderColor(properties.cancelButtonBorderColor.value())
      .setCancelButtonBackgroundColor(
        properties.cancelButtonBackgroundColor.value()
      )
      .setCancelButtonIconColor(properties.cancelButtonIconColor.value());

    if (properties.editable.hasChanged()) {
      this._adapter.setEditable(properties.editable.value());
    }

    if (properties.cancellable.hasChanged()) {
      this._adapter.setCancellable(properties.cancellable.value());
    }

    if (properties.active.hasChanged()) {
      this._adapter.setActive(properties.active.value());
    }
  }

  setMoveProperties(properties) {
    if (properties.y && properties.y instanceof Date) {
      this._adapter.setPrice(properties.y.getTime() / 1e3);
    }
    super.setMoveProperties(properties);
  }

  setPoint(point, index) {
    if (index === 0) {
      this._adapter.setPrice(point.price);
    }
    super.setPoint(point, index);
  }

  addPoint(point) {
    if (this._points.length > 0) {
      var p = this._points[0];
      p.price = point.price;
      this.setPoint(p, 0);
    }
    super.addPoint(point);
  }

  prepareDrawingData() {
    const data = super.prepareDrawingData();
    data.text = this._adapter.getText();
    data.quantity = this._adapter.getQuantity();
    data.editable = this._adapter.getEditable();
    data.cancellable = this._adapter.getCancellable();
    data.bodyBackgroundColor = this._adapter.getBodyBackgroundColor();
    data.bodyBorderColor = this._adapter.getBodyBorderColor();
    data.bodyTextColor = this._adapter.getBodyTextColor();
    data.bodyFont = this._adapter.getBodyFont();
    data.quantityBorderColor = this._adapter.getQuantityBorderColor();
    data.quantityBackgroundColor = this._adapter.getQuantityBackgroundColor();
    data.quantityTextColor = this._adapter.getQuantityTextColor();
    data.quantityFont = this._adapter.getQuantityFont();
    data.cancelButtonBorderColor = this._adapter.getCancelButtonBorderColor();
    data.cancelButtonBackgroundColor =
      this._adapter.getCancelButtonBackgroundColor();
    data.cancelButtonIconColor = this._adapter.getCancelButtonIconColor();
    return data;
  }

  update() {
    super.update();
    this.updateAllViews();
  }

  adapter() {
    return this._adapter;
  }

  setMode(mode) {
    this._adapter.setMode(mode);
    this.update();
  }

  setDirection(direction) {
    this._adapter.setDirection(direction);
    this.update();
  }

  setActive(active) {
    this._adapter.setActive(active);
    this.update();
  }

  setEditable(editable) {
    this._adapter.setEditable(editable);
    this.update();
  }

  setCancellable(cancellable) {
    this._adapter.setCancellable(cancellable);
    this.update();
  }

  hasMoveCallback() {
    return this._adapter.hasMoveCallback();
  }

  hasModifyCallback() {
    return this._adapter.hasModifyCallback();
  }

  getPrice() {
    return this._adapter.getPrice();
  }

  setPrice(price) {
    this._adapter.setPrice(price);
    this.update();
  }

  getText() {
    return this._adapter.getText();
  }

  setText(text) {
    this._adapter.setText(text);
    this.update();
  }

  setTooltip(tooltip) {
    this._adapter.setTooltip(tooltip);
    this.update();
  }

  getTooltip() {
    return this._adapter.getTooltip();
  }

  setModifyTooltip(tooltip) {
    this._adapter.setModifyTooltip(tooltip);
    this.update();
  }

  getModifyTooltip() {
    return this._adapter.getModifyTooltip();
  }

  setCancelTooltip(tooltip) {
    this._adapter.setCancelTooltip(tooltip);
    this.update();
  }

  getCancelTooltip() {
    return this._adapter.getCancelTooltip();
  }

  getQuantity() {
    return this._adapter.getQuantity();
  }

  setQuantity(quantity) {
    this._adapter.setQuantity(quantity);
    this.update();
  }

  getExtendLeft() {
    return this._adapter.getExtendLeft();
  }

  setExtendLeft(extendLeft) {
    this._adapter.setExtendLeft(extendLeft);
    this.update();
  }

  getLineLength() {
    return this._adapter.getLineLength();
  }

  setLineLength(lineLength) {
    this._adapter.setLineLength(lineLength);
    this.update();
  }

  getLineColor() {
    return this._adapter.getLineColor();
  }

  setLineColor(color) {
    this._adapter.setLineColor(color);
    this.update();
  }

  setLineActiveBuyColor(color) {
    this._adapter.setLineActiveBuyColor(color);
    this.update();
  }

  setLineInactiveBuyColor(color) {
    this._adapter.setLineInactiveBuyColor(color);
    this.update();
  }

  setLineActiveSellColor(color) {
    this._adapter.setLineActiveSellColor(color);
    this.update();
  }

  setLineInactiveSellColor(color) {
    this._adapter.setLineInactiveSellColor(color);
    this.update();
  }

  getLineStyle() {
    return this._adapter.getLineStyle();
  }

  setLineStyle(style) {
    this._adapter.setLineStyle(style);
    this.update();
  }

  getLineWidth() {
    return this._adapter.getLineWidth();
  }

  setLineWidth(width) {
    this._adapter.setLineWidth(width);
    this.update();
  }

  getBodyBorderColor() {
    return this._adapter.getBodyBorderColor();
  }

  setBodyBorderColor(color) {
    this._adapter.setBodyBorderColor(color);
    this.update();
  }

  setBodyBorderActiveBuyColor(color) {
    this._adapter.setBodyBorderActiveBuyColor(color);
    this.update();
  }

  setBodyBorderInactiveBuyColor(color) {
    this._adapter.setBodyBorderInactiveBuyColor(color);
    this.update();
  }

  setBodyBorderActiveSellColor(color) {
    this._adapter.setBodyBorderActiveSellColor(color);
    this.update();
  }

  setBodyBorderInactiveSellColor(color) {
    this._adapter.setBodyBorderInactiveSellColor(color);
    this.update();
  }

  getBodyBackgroundColor() {
    return this._adapter.getBodyBackgroundColor();
  }

  setBodyBackgroundColor(color) {
    this._adapter.setBodyBackgroundColor(color);
    this.update();
  }

  getBodyTextColor() {
    return this._adapter.getBodyTextColor();
  }

  setBodyTextColor(color) {
    this._adapter.setBodyTextColor(color);
    this.update();
  }

  setBodyTextActiveLimitColor(color) {
    this._adapter.setBodyTextActiveLimitColor(color);
    this.update();
  }

  setBodyTextInactiveLimitColor(color) {
    this._adapter.setBodyTextInactiveLimitColor(color);
    this.update();
  }

  setBodyTextActiveStopColor(color) {
    this._adapter.setBodyTextActiveStopColor(color);
    this.update();
  }

  setBodyTextInactiveStopColor(color) {
    this._adapter.setBodyTextInactiveStopColor(color);
    this.update();
  }

  setBodyTextActiveBuyColor(color) {
    this._adapter.setBodyTextActiveBuyColor(color);
    this.update();
  }

  setBodyTextInactiveBuyColor(color) {
    this._adapter.setBodyTextInactiveBuyColor(color);
    this.update();
  }

  setBodyTextActiveSellColor(color) {
    this._adapter.setBodyTextActiveSellColor(color);
    this.update();
  }

  setBodyTextInactiveSellColor(color) {
    this._adapter.setBodyTextInactiveSellColor(color);
    this.update();
  }

  getBodyFont() {
    return this._adapter.getBodyFont();
  }

  setBodyFont(font) {
    this._adapter.setBodyFont(font);
    this.update();
  }

  getQuantityBorderColor() {
    return this._adapter.getQuantityBorderColor();
  }

  setQuantityBorderColor(color) {
    this._adapter.setQuantityBorderColor(color);
    this.update();
  }

  setQuantityBorderActiveBuyColor(color) {
    this._adapter.setQuantityBorderActiveBuyColor(color);
    this.update();
  }

  setQuantityBorderInactiveBuyColor(color) {
    this._adapter.setQuantityBorderInactiveBuyColor(color);
    this.update();
  }

  setQuantityBorderActiveSellColor(color) {
    this._adapter.setQuantityBorderActiveSellColor(color);
    this.update();
  }

  setQuantityBorderInactiveSellColor(color) {
    this._adapter.setQuantityBorderInactiveSellColor(color);
    this.update();
  }

  getQuantityBackgroundColor() {
    return this._adapter.getQuantityBackgroundColor();
  }

  setQuantityBackgroundColor(color) {
    this._adapter.setQuantityBackgroundColor(color);
    this.update();
  }

  getQuantityTextColor() {
    return this._adapter.getQuantityTextColor();
  }

  setQuantityTextColor(color) {
    this._adapter.setQuantityTextColor(color);
    this.update();
  }

  getQuantityFont() {
    return this._adapter.getQuantityFont();
  }

  setQuantityFont(font) {
    this._adapter.setQuantityFont(font);
    this.update();
  }

  getCancelButtonBorderColor() {
    return this._adapter.getCancelButtonBorderColor();
  }

  setCancelButtonBorderColor(color) {
    this._adapter.setCancelButtonBorderColor(color);
    this.update();
  }

  setCancelButtonBorderActiveBuyColor(color) {
    this._adapter.setCancelButtonBorderActiveBuyColor(color);
    this.update();
  }

  setCancelButtonBorderInactiveBuyColor(color) {
    this._adapter.setCancelButtonBorderInactiveBuyColor(color);
    this.update();
  }

  setCancelButtonBorderActiveSellColor(color) {
    this._adapter.setCancelButtonBorderActiveSellColor(color);
    this.update();
  }

  setCancelButtonBorderInactiveSellColor(color) {
    this._adapter.setCancelButtonBorderInactiveSellColor(color);
    this.update();
  }

  getCancelButtonBackgroundColor() {
    return this._adapter.getCancelButtonBackgroundColor();
  }

  setCancelButtonBackgroundColor(color) {
    this._adapter.setCancelButtonBackgroundColor(color);
    this.update();
  }

  getCancelButtonIconColor() {
    return this._adapter.getCancelButtonIconColor();
  }

  setCancelButtonIconColor(color) {
    this._adapter.setCancelButtonIconColor(color);
    this.update();
  }

  block() {
    this._adapter.block();
    this.update();
  }

  unblock() {
    this._adapter.unblock();
    this.update();
  }

  getBlocked() {
    return this._adapter.getBlocked();
  }

  onCancel(callback) {
    this._adapter.onCancel(callback);
    this.update();
  }

  callOnCancel() {
    this._adapter.callOnCancel();
    this.update();
  }

  isOnCancelCallbackPresent() {
    return this._adapter.isOnCancelCallbackPresent();
  }

  onModify(callback) {
    this._adapter.onModify(callback);
    this.update();
  }

  callOnModify() {
    this._adapter.callOnModify();
    this.update();
  }

  isOnModifyCallbackPresent() {
    return this._adapter.isOnModifyCallbackPresent();
  }

  onMove(callback) {
    this._adapter.onMove(callback);
    this.update();
  }

  callOnMove() {
    this._adapter.callOnMove();
    this.update();
  }

  isOnMoveCallbackPresent() {
    return this._adapter.isOnMoveCallbackPresent();
  }

  onContextMenu(callback) {
    this._adapter.onContextMenu(callback);
    this.update();
  }

  callOnContextMenu() {
    return this._adapter.callOnContextMenu();
  }

  shouldShowContextMenu() {
    return this._adapter.shouldShowContextMenu();
  }

  mouseDownEvent() {
    return this._adapter.mouseDownEvent();
  }

  mouseMoveEvent() {
    return this._adapter.mouseMoveEvent();
  }

  mouseClickEvent() {
    return this._adapter.mouseClickEvent();
  }

  mouseWheelEvent() {
    return this._adapter.mouseWheelEvent();
  }

  pressMouseMoveEvent() {
    return this._adapter.pressMouseMoveEvent();
  }

  releaseMouseMoveEvent() {
    return this._adapter.releaseMouseMoveEvent();
  }

  pressKeyEvent() {
    return this._adapter.pressKeyEvent();
  }

  releaseKeyEvent() {
    return this._adapter.releaseKeyEvent();
  }

  doubleClickEvent() {
    return this._adapter.doubleClickEvent();
  }

  getPointByPrice(price) {
    return this._adapter.getPointByPrice(price);
  }
}

LineToolOrder.prototype.TYPE = "Order";

import { observable } from "mobx";
import {
  MagnetMode,
  isLineToolName,
  isToolCreatingNow,
  isToolEditingNow,
  properties,
  saveDefaultProperties,
  tool,
  toolIsMeasure,
  activePointSelectionMode,
  SelectPointMode,
  isStudyEditingNow,
} from "./your-import-path";
import { modifierPressed, shiftPressed } from "./your-import-path";

const isMagnetEnabled = observable.box(false);
const magnetMode = observable.box(MagnetMode.WeakMagnet);

function updateMagnetState() {
  const isModifierPressed = modifierPressed.value();
  if (
    shiftPressed.value() &&
    (isToolEditingNow.value() || isToolCreatingNow.value())
  ) {
    isMagnetEnabled.set(false);
    return;
  }

  let isLineTool = false;
  let isMeasureTool = false;
  if (activePointSelectionMode.value() === SelectPointMode.Replay) {
    isLineTool = isMeasureTool = false;
  } else {
    const currentTool = tool.value();
    const isEditing = isToolEditingNow.value();
    const isStudyEditing = isStudyEditingNow.value();
    isLineTool =
      isModifierPressed &&
      (isLineToolName(currentTool) ||
        isEditing ||
        toolIsMeasure(currentTool) ||
        isStudyEditing);
    isMeasureTool = properties().childs().magnet.value();
  }

  const magnetModeValue = isMeasureTool
    ? MagnetMode.StrongMagnet
    : properties().childs().magnetMode.value();
  magnetMode.set(magnetModeValue);
  isMagnetEnabled.set(isLineTool ? !isMeasureTool : isMeasureTool);
}

export function magnetEnabled() {
  return isMagnetEnabled;
}

export function magnetMode() {
  return magnetMode;
}

export function setIsMagnetEnabled(enabled) {
  saveDefaultProperties(true);
  properties().childs().magnet.setValue(enabled);
  saveDefaultProperties(false);
}

export function setMagnetMode(mode) {
  saveDefaultProperties(true);
  properties().childs().magnetMode.setValue(mode);
  properties().childs().magnet.setValue(true);
  saveDefaultProperties(false);
}

runOnDrawingStateReady(() => {
  properties().childs().magnet.subscribe(null, updateMagnetState);
  properties().childs().magnetMode.subscribe(null, updateMagnetState);
  modifierPressed.subscribe(updateMagnetState);
  shiftPressed.subscribe(updateMagnetState);
  tool.subscribe(updateMagnetState);
  isToolEditingNow.subscribe(updateMagnetState);
  updateMagnetState();
});

import { enabled, ensureNotNull } from "your-import-path";
import {
  CompositeRenderer,
  PaneRendererColumns,
  Point,
  SelectionRenderer,
} from "your-import-path";
import { PlotRowSearchMode, SelectionIndexes } from "your-import-path";
import { default as isDefined } from "your-import-path";

class SeriesColumnsPaneView {
  constructor(source, model) {
    this._items = [];
    this._invalidated = true;
    this._isMarkersEnabled = enabled("source_selection_markers");
    this._selectionData = null;
    this._histogramBase = 0;
    this._source = source;
    this._model = model;
    this._selectionIndexer = new SelectionIndexes(model.timeScale());
  }

  update() {
    this._invalidated = true;
  }

  renderer() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }

    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();

    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) {
      return null;
    }

    const visibleBarsRange = timeScale.visibleBarsStrictRange();

    if (visibleBarsRange === null) {
      return null;
    }

    if (this._source.bars().size() === 0) {
      return null;
    }

    const firstIndex = this._source.nearestIndex(
      visibleBarsRange.firstBar(),
      PlotRowSearchMode.NearestRight
    );
    const lastIndex = this._source.nearestIndex(
      visibleBarsRange.lastBar(),
      PlotRowSearchMode.NearestLeft
    );

    if (firstIndex === undefined || lastIndex === undefined) {
      return null;
    }

    const bars = this._source.bars().range(firstIndex, lastIndex);

    const barColorer = this._source.barColorer();
    const precomputedBarStyles = {};
    const barFunction = this._source.barFunction();

    bars.forEach((bar, index) => {
      const value = barFunction(index);

      if (!isDefined(value)) {
        return;
      }

      const barStyle =
        precomputedBarStyles[index] ||
        barColorer.barStyle(bar, false, { value: index });
      precomputedBarStyles[index] = barStyle;

      const point = new Point(bar, value);
      point.style = barStyle;
      point.timePointIndex = bar;

      this._items.push(point);
    });

    return new CompositeRenderer([
      new PaneRendererColumns({
        barSpacing: timeScale.barSpacing(),
        items: this._items,
        lineColor: "",
        histogramBase: this._histogramBase,
      }),
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
        ? new SelectionRenderer(this._selectionData)
        : null,
    ]);
  }

  _updateImpl() {
    this._items = [];

    const timeScale = this._model.timeScale();
    const priceScale = this._source.priceScale();

    if (timeScale.isEmpty() || !priceScale || priceScale.isEmpty()) {
      return;
    }

    const visibleBarsRange = timeScale.visibleBarsStrictRange();

    if (visibleBarsRange === null) {
      return;
    }

    if (this._source.bars().size() === 0) {
      return;
    }

    const firstIndex = this._source.nearestIndex(
      visibleBarsRange.firstBar(),
      PlotRowSearchMode.NearestRight
    );
    const lastIndex = this._source.nearestIndex(
      visibleBarsRange.lastBar(),
      PlotRowSearchMode.NearestLeft
    );

    if (firstIndex === undefined || lastIndex === undefined) {
      return;
    }

    const bars = this._source.bars().range(firstIndex, lastIndex);
    const barColorer = this._source.barColorer();
    const precomputedBarStyles = {};
    const barFunction = this._source.barFunction();

    let previousValue = null;

    bars.forEach((bar, index) => {
      const value = barFunction(index);

      if (!isDefined(value)) {
        return;
      }

      const barStyle =
        precomputedBarStyles[index] ||
        barColorer.barStyle(bar, false, { value: index });
      precomputedBarStyles[index] = barStyle;

      const point = new Point(bar, value);
      point.style = barStyle;
      point.timePointIndex = bar;

      this._items.push(point);
      previousValue = value;
    });

    if (previousValue !== null) {
      priceScale.pointsArrayToCoordinates(this._items, previousValue);
      timeScale.timedValuesToCoordinates(this._items);

      this._histogramBase = priceScale.isInverted() ? 0 : priceScale.height();

      if (this._model.selection().isSelected(this._source)) {
        const indexes = this._selectionIndexer.indexes();
        const pane = ensureNotNull(this._model.paneForSource(this._source));
        const paneHeight = pane.height();

        this._selectionData = {
          points: [],
          bgColors: [],
          visible: true,
          barSpacing: timeScale.barSpacing(),
          hittestResult: HitTarget.Regular,
        };

        for (const index of indexes) {
          const bar = this._source.bars().valueAt(index);

          if (bar === null) {
            continue;
          }

          const value = barFunction(bar);
          const coordinate = timeScale.indexToCoordinate(index);
          const priceCoordinate = priceScale.priceToCoordinate(
            value,
            previousValue
          );

          this._selectionData.points.push(
            new Point(coordinate, priceCoordinate)
          );
          this._selectionData.bgColors.push(
            this._model.backgroundColorAtYPercentFromTop(
              priceCoordinate / paneHeight
            )
          );
        }
      } else {
        this._selectionIndexer.clear();
      }
    }
  }
}

export { SeriesColumnsPaneView };

import { getLogger, ensureDefined } from "your-import-path";
import {
  UndoStack,
  UndoMacroCommand,
  SetWatchedValueCommand,
} from "your-import-path";
import { createSignal } from "your-import-path";
import { default as c } from "your-import-path";

const logger = getLogger("Common.UndoHistory");

function createUndoHistory() {
  const commandStack = [];
  const undoStack = new UndoStack();
  const redoStack = new UndoStack();
  const onChangeSignal = createSignal();

  function pushCommand(command) {
    if (commandStack.length > 0) {
      commandStack[commandStack.length - 1].addCommand(command);
    } else {
      undoStack.clear();
      const previousCommand = undoStack.head();
      const previousText =
        previousCommand && previousCommand.text().originalText();
      if (previousCommand && previousCommand.canMerge(command)) {
        previousCommand.merge(command);
      } else {
        undoStack.push(command);
      }
      const currentText = command.text().originalText();
      if (currentText !== "" && currentText !== previousText) {
        logger.logNormal("DO: " + currentText);
      }
    }
    if (command.executeOnPush()) {
      command.redo();
    }
    if (commandStack.length === 0) {
      onChangeSignal.fire(getUndoHistoryState());
    }
  }

  function getUndoHistoryState() {
    const undoCommand = undoStack.head();
    const redoCommand = redoStack.head();
    const undoText = undoCommand
      ? undoCommand.text().translatedText()
      : undefined;
    const redoText = redoCommand
      ? redoCommand.text().translatedText()
      : undefined;
    return {
      enableUndo: !undoStack.isEmpty(),
      undoCommandCount: undoStack.size(),
      undoText: undoText !== undefined ? undoText : undoText,
      enableRedo: !redoStack.isEmpty(),
      redoCommandCount: redoStack.size(),
      redoText: redoText !== undefined ? redoText : redoText,
      originalUndoText: undoCommand
        ? undoCommand.text().originalText()
        : undefined,
      originalRedoText: redoCommand
        ? redoCommand.text().originalText()
        : undefined,
    };
  }

  return {
    beginUndoMacro: function (description) {
      const undoMacroCommand = new UndoMacroCommand(description);
      commandStack.push(undoMacroCommand);
      return undoMacroCommand;
    },
    clearStack: function () {
      undoStack.clear();
      redoStack.clear();
      onChangeSignal.fire(getUndoHistoryState());
    },
    createUndoCheckpoint: function () {
      return {
        lastActualCommand: undoStack.isEmpty() ? null : undoStack.head(),
      };
    },
    endUndoMacro: function () {
      const undoMacroCommand = ensureDefined(commandStack.pop());
      if (!undoMacroCommand.isEmpty()) {
        pushCommand(undoMacroCommand);
      }
    },
    pushUndoCommand: pushCommand,
    redo: function () {
      if (redoStack.isEmpty()) {
        return false;
      }
      const command = redoStack.pop();
      if (command) {
        command.redo();
        undoStack.push(command);
        logger.logNormal("REDO: " + command.text().originalText());
        onChangeSignal.fire(getUndoHistoryState());
        return true;
      }
      return false;
    },
    redoStack: function () {
      return redoStack;
    },
    setWatchedValue: function (watchedValue, newValue, customFlag, skipSave) {
      if (watchedValue.value() !== newValue) {
        const command = new SetWatchedValueCommand(
          watchedValue,
          newValue,
          customFlag
        );
        command.setCustomFlag("doesnt_affect_save", !!skipSave);
        pushCommand(command);
        command.redo();
      }
    },
    undo: function () {
      if (undoStack.isEmpty()) {
        return false;
      }
      const command = undoStack.pop();
      if (command) {
        command.undo();
        redoStack.push(command);
        logger.logNormal("UNDO: " + command.text().originalText());
        onChangeSignal.fire(getUndoHistoryState());
        return true;
      }
      return false;
    },
    undoStack: function () {
      return undoStack;
    },
    undoToCheckpoint: function (checkpoint) {
      while (
        !undoStack.isEmpty() &&
        checkpoint.lastActualCommand !== undoStack.head()
      ) {
        undoStack.pop().undo();
      }
      redoStack.clear();
      onChangeSignal.fire(getUndoHistoryState());
    },
    state: getUndoHistoryState,
    onChange: function () {
      return onChangeSignal;
    },
  };
}

export { createUndoHistory };

import { declareClassAsPureInterface } from "your-import-path";

function ChartApiInterface() {}

TradingView.WEB_SOCKET_WAS_CONNECTED = false;
ChartApiInterface.prototype.defaultResolutions = function () {};
ChartApiInterface.prototype.availableCurrencies = function () {};
ChartApiInterface.prototype.availableUnits = function () {};
ChartApiInterface.prototype.supportedSymbolsTypes = function () {};
ChartApiInterface.prototype.symbolsGrouping = function () {};
ChartApiInterface.prototype.quoteCreateSession = function (e) {};
ChartApiInterface.prototype.quoteDeleteSession = function (e) {};
ChartApiInterface.prototype.quoteSetFields = function (e, t) {};
ChartApiInterface.prototype.quoteAddSymbols = function (e, t) {};
ChartApiInterface.prototype.quoteRemoveSymbols = function (e, t) {};
ChartApiInterface.prototype.quoteFastSymbols = function (e, t) {};
ChartApiInterface.prototype.depthCreateSession = function (e, t, i) {};
ChartApiInterface.prototype.depthDeleteSession = function (e) {};
ChartApiInterface.prototype.depthSetSymbol = function (e, t) {};
ChartApiInterface.prototype.depthClearSymbol = function (e) {};
ChartApiInterface.prototype.depthSetScale = function (e, t) {};
ChartApiInterface.prototype.chartCreateSession = function (e, t) {};
ChartApiInterface.prototype.chartDeleteSession = function (e) {};
ChartApiInterface.prototype.createSession = function (e, t) {};
ChartApiInterface.prototype.removeSession = function (e) {};
ChartApiInterface.prototype.connected = function () {};
ChartApiInterface.prototype.connect = function () {};
ChartApiInterface.prototype.disconnect = function () {};
ChartApiInterface.prototype.switchTimezone = function (e, t) {};
ChartApiInterface.prototype.resolveSymbol = function (e, t, i, s) {};
ChartApiInterface.prototype.createSeries = function (e, t, i, s, r, n, o, a) {};
ChartApiInterface.prototype.removeSeries = function (e, t, i) {};
ChartApiInterface.prototype.modifySeries = function (e, t, i, s, r, n, o) {};
ChartApiInterface.prototype.requestMoreData = function (e, t, i, s) {};
ChartApiInterface.prototype.requestMetadata = function (e, t, i) {};
ChartApiInterface.prototype.canCreateStudy = function (e, t) {};
ChartApiInterface.prototype.createStudy = function (e, t, i, s, r, n, o) {};
ChartApiInterface.prototype.getStudyCounter = function () {};
ChartApiInterface.prototype.rebindStudy = function (e, t, i, s, r, n, o, a) {};
ChartApiInterface.prototype.removeStudy = function (e, t, i) {};
ChartApiInterface.prototype.modifyStudy = function (e, t, i, s, r) {};
ChartApiInterface.prototype.createPointset = function (e, t, i, s, r, n, o) {};
ChartApiInterface.prototype.modifyPointset = function (e, t, i, s, r) {};
ChartApiInterface.prototype.removePointset = function (e, t, i) {};
ChartApiInterface.prototype.requestMoreTickmarks = function (e, t, i, s) {};
ChartApiInterface.prototype.requestFirstBarTime = function (e, t, i, s) {};
ChartApiInterface.prototype._invokeHandler = function (e, t) {};
ChartApiInterface.prototype._sendRequest = function (e, t) {};
ChartApiInterface.prototype._onMessage = function (e) {};
ChartApiInterface.prototype._dispatchNotification = function (e) {};
ChartApiInterface.prototype._invokeNotificationHandler = function (e, t, i) {};
ChartApiInterface.prototype._notifySessions = function (e) {};
ChartApiInterface.prototype.unpack = function (e) {};
ChartApiInterface.prototype.searchSymbols = function (
  e,
  t,
  i,
  s,
  r,
  n,
  o,
  a,
  l,
  c
) {};
ChartApiInterface.prototype.serverTimeOffset = function () {};
ChartApiInterface.prototype.getMarks = function (e, t, i, s, r) {};
ChartApiInterface.prototype.getTimescaleMarks = function (e, t, i, s, r) {};

declareClassAsPureInterface(ChartApiInterface, "ChartApiInterface");

export { ChartApiInterface };

import { assert } from "your-import-path";

class Version {
  constructor(major, minor) {
    this._major = major;
    this._minor = minor;
  }

  major() {
    return this._major;
  }

  minor() {
    return this._minor;
  }

  isZero() {
    return this._major === 0 && this._minor === 0;
  }

  toString() {
    return `${this._major}.${this._minor}`;
  }

  compareTo(otherVersion) {
    if (this._major < otherVersion._major) {
      return -1;
    } else if (this._major > otherVersion._major) {
      return 1;
    } else if (this._minor < otherVersion._minor) {
      return -1;
    } else if (this._minor > otherVersion._minor) {
      return 1;
    } else {
      return 0;
    }
  }

  isLess(otherVersion) {
    return this.compareTo(otherVersion) < 0;
  }

  isLessOrEqual(otherVersion) {
    return this.compareTo(otherVersion) <= 0;
  }

  isEqual(otherVersion) {
    return this.compareTo(otherVersion) === 0;
  }

  isGreater(otherVersion) {
    return this.compareTo(otherVersion) > 0;
  }

  isGreaterOrEqual(otherVersion) {
    return this.compareTo(otherVersion) >= 0;
  }

  static parse(versionString) {
    if (versionString instanceof Version) {
      return new Version(versionString.major(), versionString.minor());
    } else if (typeof versionString === "number") {
      assert(
        Math.floor(versionString) === versionString,
        "Version should not be a float number"
      );
      return new Version(versionString, 0);
    } else if (typeof versionString === "string") {
      const versionParts = versionString.split(".");
      if (versionParts.length === 1) {
        const major = parseInt(versionParts[0], 10);
        assert(!isNaN(major), "Bad version string: " + versionString);
        return new Version(major, 0);
      } else if (versionParts.length === 2) {
        const major = parseInt(versionParts[0], 10);
        assert(!isNaN(major), "Bad version string: " + versionString);
        const minor = parseInt(versionParts[1], 10);
        assert(!isNaN(minor), "Bad version string: " + versionString);
        return new Version(major, minor);
      } else {
        throw new Error(
          "Bad version string (one dot expected): " + versionString
        );
      }
    } else {
      throw new Error("Bad version: " + versionString);
    }
  }
}

Version.ZERO = new Version(0, 0);

export { Version };

import { timeStamp } from "your-import-path";

function noop() {}

function addPerfMark(markName) {
  const timeStampFn = console.timeStamp
    ? console.timeStamp.bind(console)
    : noop;
  const markFn =
    window.performance && performance.mark
      ? performance.mark.bind(performance)
      : noop;

  timeStampFn(markName);
  markFn(markName);
}

export { addPerfMark };

import { getVolumeProfileResolutionForPeriod, Std } from "your-import-path";

class VolumeProfileBase {
  constructor(rowSize, type) {
    this._minTick = NaN;
    this._minPrice = NaN;
    this._maxPrice = NaN;
    this._low = NaN;
    this._high = NaN;
    this._startPrice = NaN;
    this._indexLowVbP = NaN;
    this._indexHighVbP = NaN;
    this._rowSize = rowSize;
    this._type = type;
  }

  init(minTick, minPrice, maxPrice, low, high) {
    this._minTick = minTick;
    this._minPrice = minPrice;
    this._maxPrice = maxPrice;
    this._low = low;
    this._high = high;
  }

  getStartPrice() {
    return this._startPrice;
  }

  setStartPrice(startPrice) {
    this._startPrice = startPrice;
  }

  getIndexLowVbP() {
    return this._indexLowVbP;
  }

  setIndexLowVbP(indexLowVbP) {
    this._indexLowVbP = indexLowVbP;
  }

  getIndexHighVbP() {
    return this._indexHighVbP;
  }

  setIndexHighVbP(indexHighVbP) {
    this._indexHighVbP = indexHighVbP;
  }

  type() {
    return this._type;
  }
}

class VolumeProfileByPrice extends VolumeProfileBase {
  constructor(rowSize) {
    super(rowSize, 0);
  }

  calculate() {
    this.setStartPrice(this._minPrice);
    const rowWidth = this.getRowWidth();
    let indexLowVbP = Math.floor((this._low - this._minPrice) / rowWidth);
    let indexHighVbP = Math.ceil((this._high - this._minPrice) / rowWidth) - 1;
    indexLowVbP = Math.max(indexLowVbP, 0);
    indexHighVbP = Math.max(indexHighVbP, 0);
    indexHighVbP = Math.min(indexHighVbP, this._rowSize - 1);
    indexLowVbP = Math.min(indexLowVbP, indexHighVbP);
    this.setIndexLowVbP(indexLowVbP);
    this.setIndexHighVbP(indexHighVbP);
  }

  getRowWidth() {
    return Math.max(
      (this._maxPrice - this._minPrice) / this._rowSize,
      this._minTick
    );
  }
}

class VolumeProfileByVolume extends VolumeProfileBase {
  constructor(rowSize) {
    super(rowSize, 1);
  }

  calculate() {
    this.setStartPrice(0);
    const rowWidth = this.getRowWidth();
    let indexLowVbP = Math.floor(this._low / rowWidth);
    const indexHighVbP = Math.ceil(this._high / rowWidth) - 1;
    indexLowVbP = Math.min(indexLowVbP, indexHighVbP);
    this.setIndexLowVbP(indexLowVbP);
    this.setIndexHighVbP(indexHighVbP);
  }

  getRowWidth() {
    return this._minTick * this._rowSize;
  }
}

function maxHHistItems() {
  return 6000;
}

function numOfSubHists(type) {
  switch (type) {
    case "Delta":
    case "Up/Down":
      return 2;
    case "Total":
      return 1;
    default:
      Std.error(`Invalid study argument value: ${type}`);
  }
}

class VolumeProfileBase {
  findBasicResolutionForFromTo(e, t, i, n) {
    const selectedResolution = getVolumeProfileResolutionForPeriod(
      e.value(),
      t,
      i,
      n
    );
    const parsedResolution = r.Interval.parse(selectedResolution);
    if (l.enabled("charting_library_debug_mode")) {
      console.log(
        `Selected resolution ${parsedResolution.value()} for (${e.value()}, ${t}, ${i})`
      );
    }
    return parsedResolution;
  }

  verifyRowSizeInput(rowSize, inputType) {
    if (inputType === "Number Of Rows" && rowSize > 6000) {
      Std.error('Histogram is too large, please reduce "Row Size" input.');
    }
  }

  _getRowsLayout(inputType, rowSize) {
    return inputType === "Number Of Rows"
      ? new VolumeProfileByPrice(rowSize)
      : new VolumeProfileByVolume(rowSize);
  }
}

export { VolumeProfileBase, maxHHistItems, numOfSubHists };

import { t } from "your-import-path";

class TimeSpanFormatter {
  format(time) {
    const isNegative = time < 0;
    time = Math.abs(time);
    const days = Math.floor(time / 86400);
    time -= 86400 * days;
    const hours = Math.floor(time / 3600);
    time -= 3600 * hours;
    const minutes = Math.floor(time / 60);
    time -= 60 * minutes;
    let formattedTime = "";

    if (days) {
      formattedTime += days + t(null, { context: "dates" }, "day") + " ";
    }

    if (hours) {
      formattedTime += hours + t(null, { context: "dates" }, "hour") + " ";
    }

    if (minutes) {
      formattedTime += minutes + t(null, { context: "dates" }, "minute") + " ";
    }

    if (time) {
      formattedTime += time + t(null, { context: "dates" }, "second") + " ";
    }

    if (isNegative) {
      formattedTime = "-" + formattedTime;
    }

    return formattedTime.trim();
  }
}

export { TimeSpanFormatter };
