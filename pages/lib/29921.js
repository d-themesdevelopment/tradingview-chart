import { ensureNotNull } from "./assertions";
import chartTradingUtils from "./47043";
// import {
//   getColorFromProperties,
//   setColorToProperties,
//   getFontFromProperties,
//   setFontToProperties,
// } from "some-import-path";
import {
  LineDataSource,
  //  createProperties
} from "./13087";

// import { ExecutionPaneView } from "some-import-path";
import { fontHeight } from "some-import-path"; // ! not correct
import { sourceChangeEvent } from "./28558";

import { sortSourcesPreOrdered } from "./98517";

const sortSourcesPreOrderedLineToolExecution =
  sortSourcesPreOrdered.LineToolExecution;

class ExecutionsPositionController {
  constructor(pane) {
    this._pane = pane;
  }

  getXYCoordinate(line, timeScale, barIndex) {
    let yOffset = 0;
    const direction = line.getDirection();
    const isBuy = direction === "buy";
    const mainSeries = this._pane.model().mainSeries();

    if (mainSeries.bars) {
      const yOffsetMultiplier = isBuy ? 10 : -10;
      const nearestBar = mainSeries
        .bars()
        .search(barIndex, PlotRowSearchMode.NearestLeft);

      if (nearestBar !== null) {
        barIndex = nearestBar.index;
        const price = isBuy ? nearestBar.value[3] : nearestBar.value[2];
        const priceScale = mainSeries.priceScale();
        const firstValue = ensureNotNull(mainSeries.firstValue());
        yOffset =
          priceScale.priceToCoordinate(price, firstValue) + yOffsetMultiplier;
      }
    }

    line.setAlignedTimePointIndex(barIndex);
    const visibleBars = timeScale.visibleBarsStrictRange();

    if (
      !isFinite(barIndex) ||
      visibleBars === null ||
      barIndex > visibleBars.lastBar() ||
      barIndex < visibleBars.firstBar()
    ) {
      return {
        x: -1,
        y: -1,
      };
    }

    const cachedExecutions =
      ExecutionsPositionController._cachedByBarIndexOrderedExecutions[
        barIndex
      ] || this._pane.sourcesByGroup().all();

    for (let i = cachedExecutions.length - 1; i >= 0; --i) {
      const execution = cachedExecutions[i];

      if (
        !(execution instanceof LineToolExecution) ||
        execution.adapter().alignedTimePointIndex() !== barIndex ||
        execution.adapter().getDirection() !== direction
      ) {
        continue;
      }

      if (execution === line) {
        break;
      }

      const executionHeight = execution.adapter().height();
      yOffset = isBuy ? yOffset + executionHeight : yOffset - executionHeight;
    }

    return {
      x: timeScale.indexToCoordinate(barIndex),
      y: yOffset,
    };
  }

  static recreateOrderedByBarsSourcesCache(lineTool) {
    this.clearOrderedByBarsSourcesCache();
    const allSources = lineTool.sourcesByGroup().all();

    for (const source of allSources) {
      if (!(source instanceof LineToolExecution)) {
        continue;
      }

      const alignedTimePointIndex = source.adapter().alignedTimePointIndex();

      if (alignedTimePointIndex === undefined) {
        continue;
      }

      const cachedExecutions =
        ExecutionsPositionController._cachedByBarIndexOrderedExecutions[
          alignedTimePointIndex
        ] || [];
      ExecutionsPositionController._cachedByBarIndexOrderedExecutions[
        alignedTimePointIndex
      ] = cachedExecutions;
      cachedExecutions.push(source);
    }
  }

  static clearOrderedByBarsSourcesCache() {
    ExecutionsPositionController._cachedByBarIndexOrderedExecutions = {};
  }
}

ExecutionsPositionController._cachedByBarIndexOrderedExecutions = {};

class LineToolExecution extends LineDataSource {
  constructor(model, line, serialization, options) {
    super(
      model,
      null != line ? line : LineToolExecution.createProperties(),
      serialization,
      options
    );
    this._adapter = new ExecutionAdapter(this, model);
    this.customization.forcePriceAxisLabel = false;
    this.customization.disableErasing = true;
    this.setSelectionEnabled(false);
    import("some-import-path").then((module) => {
      const ExecutionPaneView = module.ExecutionPaneView;
      this._setPaneViews([new ExecutionPaneView(this, this._model)]);
    });
  }

  adapter() {
    return this._adapter;
  }

  zorder() {
    return sortSourcesPreOrderedLineToolExecution;
  }

  isSpeciallyZOrderedSource() {
    return true;
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Execution";
  }

  hasContextMenu() {
    return false;
  }

  state() {
    return {};
  }

  updateAllViews(dataUpdate) {
    if (this._isVisible()) {
      return super.updateAllViews(dataUpdate);
    }
  }

  priceAxisViews(priceScale, width) {
    return this._isVisible() ? super.priceAxisViews(priceScale, width) : null;
  }

  paneViews() {
    return window.TradingView.printing &&
      !SnapshotTradingDrawings.enabled("snapshot_trading_drawings")
      ? null
      : this._isVisible()
      ? super.paneViews()
      : null;
  }

  userEditEnabled() {
    return false;
  }

  showInObjectTree() {
    return false;
  }

  cloneable() {
    return false;
  }

  copiable() {
    return false;
  }

  isSynchronizable() {
    return false;
  }

  static createProperties(lineToolProps) {
    const properties = new DefaultProperty(
      "linetoolexecution",
      lineToolProps,
      false,
      false
    );
    this._configureProperties(properties);
    return properties;
  }

  _isVisible() {
    return this._model
      .properties()
      .childs()
      .tradingProperties.childs()
      .showExecutions.value();
  }
}

class ExecutionAdapter {
  constructor(lineTool, model) {
    this._unixtime = NaN;
    this._line = lineTool;
    this._model = model;
  }

  alignedTimePointIndex() {
    return this._alignedTimePointIndex;
  }

  setAlignedTimePointIndex(index) {
    this._alignedTimePointIndex = index;
  }

  line() {
    return this._line;
  }

  getIndex() {
    return this._model.timeScale().baseIndex() - this._line.points()[0].index;
  }

  setIndex(index) {
    const newBaseIndex = this._model.timeScale().baseIndex() - Math.abs(index);
    this._line.startMoving({
      logical: this._line.points()[0],
    });

    const newLogicalPoint = {
      ...this._line.points()[0],
    };
    newLogicalPoint.index = newBaseIndex;
    this._line.move({
      logical: newLogicalPoint,
    });
    this._line.endMoving(false);
    return this;
  }

  getTime() {
    return this._unixtime;
  }

  setTime(unixtime) {
    this._unixtime = unixtime;
    this._line.restorePoints(
      [
        {
          offset: 0,
          price: this.getPrice(),
          time_t: this._unixtime,
        },
      ],
      []
    );
    this._line.createServerPoints();
    return this;
  }

  getPrice() {
    if (this._line.points().length > 0) {
      return this._line.points()[0].price;
    }

    if (this._line.normalizedPoints().length > 0) {
      return this._line.normalizedPoints()[0].price;
    }

    return NaN;
  }

  setPrice(price) {
    if (this._line.points().length > 0) {
      this._line.points()[0].price = price;
    }

    if (this._line.normalizedPoints().length > 0) {
      this._line.normalizedPoints()[0].price = price;
    }

    return this;
  }

  getText() {
    return this._line.properties().childs().text.value();
  }

  setText(text) {
    this._line
      .properties()
      .childs()
      .text.setValue(text || "");
    this._line.updateAllViewsAndRedraw(sourceChangeEvent(this._line.id()));
    return this;
  }

  getArrowHeight() {
    return this._line.properties().childs().arrowHeight.value();
  }

  setArrowHeight(height) {
    this._line
      .properties()
      .childs()
      .arrowHeight.setValue(height || 5);
    return this;
  }

  getArrowSpacing() {
    return this._line.properties().childs().arrowSpacing.value();
  }

  setArrowSpacing(spacing) {
    this._line
      .properties()
      .childs()
      .arrowSpacing.setValue(spacing || 1);
    return this;
  }

  getDirection() {
    return this._line.properties().childs().direction.value();
  }

  setDirection(direction) {
    this._line
      .properties()
      .childs()
      .direction.setValue(direction || "buy");
    return this;
  }

  getArrowColor() {
    const properties = this._line.properties().childs();
    return this.getDirection() === "buy"
      ? properties.arrowBuyColor.value()
      : properties.arrowSellColor.value();
  }

  setArrowColor(color) {
    if (this.getDirection() === "buy") {
      this.setArrowBuyColor(color);
    } else {
      this.setArrowSellColor(color);
    }
    return this;
  }

  setArrowBuyColor(color) {
    this._line.properties().childs().arrowBuyColor.setValue(color);
    return this;
  }

  setArrowSellColor(color) {
    this._line.properties().childs().arrowSellColor.setValue(color);
    return this;
  }

  getTextColor() {
    const properties = this._line.properties().childs();
    return new chartTradingUtils.getColorFromProperties(
      properties.textColor,
      properties.textTransparency
    );
  }

  setTextColor(color) {
    const properties = this._line.properties().childs();
    new chartTradingUtils.setColorToProperties(
      color,
      properties.textColor,
      properties.textTransparency
    );
    return this;
  }

  getFont() {
    const properties = this._line.properties().childs();
    return new chartTradingUtils.getFontFromProperties(
      properties.fontFamily,
      properties.fontSize,
      properties.fontBold,
      properties.fontItalic
    );
  }

  setFont(font) {
    const properties = this._line.properties().childs();
    new chartTradingUtils.setFontToProperties(
      font,
      properties.fontFamily,
      properties.fontSize,
      properties.fontBold,
      properties.fontItalic
    );
    return this;
  }

  setTooltip(tooltip) {
    if (tooltip === null) {
      tooltip = "";
    } else {
      tooltip += "";
    }

    this._line.properties().childs().tooltip.setValue(tooltip);
    return this;
  }

  getTooltip() {
    return this._line.properties().childs().tooltip.value();
  }

  remove() {
    this._model.removeSource(this._line);
  }

  getPoints() {
    return this._line.points();
  }

  height() {
    const arrowHeight = this.getArrowHeight();
    const arrowSpacing = this.getArrowSpacing();
    let textHeight = 0;

    if (this.getText()) {
      textHeight = fontHeight(this.getFont());
    }

    return arrowHeight + arrowSpacing + textHeight + 10;
  }
}

export { ExecutionsPositionController, LineToolExecution };
