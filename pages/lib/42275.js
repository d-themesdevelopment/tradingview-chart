import { box, Point } from "path2d"; // ! not cocrrect
import { colorFromBackground } from "./87095";
import { lastMouseOrTouchEventInfo } from "./38325";

class PriceAxisView {
  constructor(renderer) {
    this.axisData = {
      text: "",
      visible: false,
      separatorVisible: false,
      borderVisible: false,
      ignoreAdditionalPaddingInner: false,
    };

    this.paneData = {
      text: "",
      visible: false,
      separatorVisible: true,
      borderVisible: false,
      ignoreAdditionalPaddingInner: true,
    };

    this.invalidated = true;

    this.axisRenderer = new PriceAxisRenderer(
      this.axisData,
      this.commonRendererData
    );
    this.paneRenderer = new PriceAxisRenderer(
      this.paneData,
      this.commonRendererData
    );
  }

  getText() {
    this.updateRendererDataIfNeeded();
    return this.axisData.text;
  }

  getSecondLineText() {
    this.updateRendererDataIfNeeded();
    return this.axisData.secondLine;
  }

  getThirdLineText() {
    this.updateRendererDataIfNeeded();
    return this.axisData.thirdLine;
  }

  getBackground() {
    this.updateRendererDataIfNeeded();
    return this.commonRendererData.background;
  }

  getColor() {
    this.updateRendererDataIfNeeded();
    return this.generateTextColor(this.getBackground());
  }

  generateTextColor(background) {
    return colorFromBackground(background);
  }

  getCoordinate() {
    this.updateRendererDataIfNeeded();
    return this.commonRendererData.coordinate;
  }

  getFloatCoordinate() {
    this.updateRendererDataIfNeeded();
    return (
      this.commonRendererData.floatCoordinate ??
      this.commonRendererData.coordinate
    );
  }

  update(data) {
    this.invalidated = true;
  }

  topBottomTotalHeight(options) {
    this.updateRendererDataIfNeeded();

    const axisHeight = this.axisRenderer.topBottomTotalHeight(options);
    const paneHeight = this.paneRenderer.topBottomTotalHeight(options);

    return {
      top: Math.max(axisHeight.top, paneHeight.top),
      bottom: Math.max(axisHeight.bottom, paneHeight.bottom),
      total: Math.max(axisHeight.total, paneHeight.total),
    };
  }

  getFixedCoordinate() {
    return this.commonRendererData.fixedCoordinate ?? 0;
  }

  setFixedCoordinate(coordinate) {
    this.commonRendererData.fixedCoordinate = coordinate;
  }

  isVisible() {
    this.updateRendererDataIfNeeded();
    return this.axisData.visible || this.paneData.visible;
  }

  isAxisLabelVisible() {
    this.updateRendererDataIfNeeded();
    return this.axisData.visible;
  }

  isPaneLabelVisible() {
    this.updateRendererDataIfNeeded();
    return this.paneData.visible;
  }

  renderer() {
    this.updateRendererDataIfNeeded();
    return this.axisRenderer;
  }

  paneRenderer() {
    this.updateRendererDataIfNeeded();
    return this.paneRenderer;
  }

  setPaneRendererLabelIcon(labelIcon) {
    this.paneData.labelIcon = labelIcon;
  }

  setPaneLabelVisible(visible) {
    this.paneData.visible = visible;
    this.invalidated = true;
  }

  ignoreAlignment() {
    return false;
  }

  updateRendererDataIfNeeded() {
    if (this.invalidated) {
      this.commonRendererData.fixedCoordinate = undefined;
      this.updateRendererData(
        this.axisData,
        this.paneData,
        this.commonRendererData
      );
      this.invalidated = false;
    }
  }
}

class PriceAxisRenderer {
  constructor(data, commonData) {
    this.data = data;
    this.commonData = commonData;
  }

  setData(data, commonData) {
    this.data = data;
    this.commonData = commonData;
  }

  draw(
    context,
    options,
    coordinateConverter,
    pixelRatio,
    minVisible,
    maxVisible,
    logicalRange
  ) {
    const data = this.data;
    if (!data.visible || this.isOutOfScreen(options, minVisible, maxVisible))
      return;

    const commonData = this.commonData;
    const isIconVisible = data.labelIcon !== undefined;

    const borderSize = options.borderSize;
    const paddingTop = options.paddingTop + commonData.additionalPaddingTop;
    const paddingBottom =
      options.paddingBottom + commonData.additionalPaddingBottom;
    const paddingInner = options.paddingInner;
    const additionalPaddingInner = data.ignoreAdditionalPaddingInner
      ? 0
      : options.additionalPaddingInner;
    const paddingOuter = options.paddingOuter;
    const fontSize = options.fontSize;

    let text = data.text;
    let textColor = data.textColor ?? commonData.textColor;
    let secondLine = data.secondLine || "";
    let secondLineTextColor = commonData.secondLineTextColor ?? textColor;
    let thirdLine = data.thirdLine || "";
    let thirdLineTextColor = commonData.thirdLineTextColor ?? textColor;

    if (secondLine.length === 0) {
      secondLine = thirdLine;
      secondLineTextColor = thirdLineTextColor;
      thirdLine = "";
    }

    if (text.length === 0) {
      text = secondLine;
      textColor = secondLineTextColor;
      secondLine = thirdLine;
      secondLineTextColor = thirdLineTextColor;
      thirdLine = "";
    }

    context.save();
    context.font = options.font;

    const yMidCorrection =
      coordinateConverter.yMidCorrection(context, text) * pixelRatio;
    const textWidth = Math.ceil(coordinateConverter.measureText(context, text));
    const lineHeight = fontSize + paddingTop + paddingBottom;
    const hasSecondLine = Boolean(secondLine);
    const hasThirdLine = Boolean(thirdLine);
    const secondLineWidth = hasSecondLine
      ? Math.ceil(coordinateConverter.measureText(context, secondLine))
      : 0;
    const thirdLineWidth = hasThirdLine
      ? Math.ceil(coordinateConverter.measureText(context, thirdLine))
      : 0;

    const contentWidth = Math.max(
      borderSize +
        paddingInner +
        paddingOuter +
        textWidth +
        additionalPaddingInner,
      borderSize +
        paddingInner +
        paddingOuter +
        secondLineWidth +
        additionalPaddingInner,
      borderSize +
        paddingInner +
        paddingOuter +
        thirdLineWidth +
        additionalPaddingInner
    );

    const lineHeightRounded = Math.round(lineHeight * pixelRatio);
    const lineHeightHalfRounded =
      lineHeightRounded % 2 === 0
        ? lineHeightRounded / 2
        : (lineHeightRounded - 1) / 2;
    const lineHeightFloor = Math.floor(lineHeight * pixelRatio);

    let contentHeight = 0;
    if (text || isIconVisible) {
      contentHeight = hasThirdLine
        ? lineHeightRounded * 2
        : hasSecondLine
        ? lineHeightRounded
        : lineHeightRounded;
    }

    const borderWidth = data.borderVisible
      ? Math.floor(borderSize * pixelRatio)
      : 0;
    const separatorWidth = data.separatorVisible ? borderWidth : 0;

    const bounds = {
      min: new Point(minVisible.x - borderWidth, minVisible.y - borderWidth),
      max: new Point(maxVisible.x + borderWidth, maxVisible.y + borderWidth),
    };

    if (contentHeight === 0) {
      context.restore();
      return;
    }

    context.fillStyle = data.background ?? commonData.background;
    const lineSpacingScaled = Math.round(options.lineSpacing * pixelRatio);
    const paddingTopScaled = Math.round(paddingTop * pixelRatio);
    const paddingBottomScaled = Math.round(paddingBottom * pixelRatio);
    const paddingLeftRightScaled = Math.round(
      (paddingInner + paddingOuter) * pixelRatio
    );
    const contentWidthScaled = Math.round(contentWidth * pixelRatio);
    const additionalPaddingInnerScaled = Math.round(
      additionalPaddingInner * pixelRatio
    );
    const borderWidthScaled = Math.floor(borderSize * pixelRatio);
    const separatorWidthScaled = Math.floor(separatorWidth * pixelRatio);

    const logicalRangeDelta = logicalRange.max - logicalRange.min;
    const logicalRangeStep = logicalRangeDelta / logicalRange.count;

    let centerX = Math.round(
      coordinateConverter.logicToCoordinate(
        logicalRange.min + logicalRangeStep * data.xCoord
      ) * pixelRatio
    );

    const centerY =
      Math.round(
        coordinateConverter.logicToCoordinate(
          commonData.fixedCoordinate ?? commonData.coordinate
        ) * pixelRatio
      ) - lineHeightHalfRounded;

    const contentTop = Math.floor(centerY - contentHeight / 2);
    const contentBottom = contentTop + contentHeight;

    if (data.text || isIconVisible) {
      const borderColor = data.borderColor ?? data.background;
      const iconWidth =
        options.borderSize +
        options.paddingInner +
        options.paddingOuter +
        contentWidthScaled +
        additionalPaddingInnerScaled;
      const iconHeight = lineHeightFloor * pixelRatio;

      if (centerX - iconWidth / 2 !== Math.floor(centerX - iconWidth / 2)) {
        centerX += 1;
      }

      if (centerY - iconHeight / 2 !== Math.floor(centerY - iconHeight / 2)) {
        centerY += 1;
      }

      if (data.borderVisible) {
        if (options.alignLabels) {
          drawRoundRectWithInnerBorder(
            context,
            centerX - iconWidth / 2,
            contentTop,
            iconWidth,
            contentHeight,
            data.background,
            [lineHeightFloor, 0, 0, lineHeightFloor],
            borderWidthScaled,
            borderColor,
            commonData.borderStyle
          );
        } else {
          drawRoundRectWithInnerBorder(
            context,
            contentTop,
            centerX - iconWidth / 2,
            contentHeight,
            iconWidth,
            data.background,
            [0, lineHeightFloor, lineHeightFloor, 0],
            borderWidthScaled,
            borderColor,
            commonData.borderStyle
          );
        }
      }

      context.save();
      context.translate(centerY, centerX);
      drawScaled(context, pixelRatio, pixelRatio, () => {
        context.fillStyle = textColor;
        context.fillText(text, 0, 0);
      });
      context.restore();
    }

    if (hasSecondLine) {
      context.fillStyle = secondLineTextColor;
      context.save();
      context.translate(centerY, centerX + lineHeightFloor);
      drawScaled(context, pixelRatio, pixelRatio, () => {
        context.fillText(secondLine, 0, 0);
      });
      context.restore();
    }

    if (hasThirdLine) {
      context.fillStyle = thirdLineTextColor;
      context.save();
      context.translate(centerY, centerX + lineHeightFloor * 2);
      drawScaled(context, pixelRatio, pixelRatio, () => {
        context.fillText(thirdLine, 0, 0);
      });
      context.restore();
    }

    if (data.separatorVisible) {
      context.fillStyle = options.paneBackgroundColor;
      context.fillRect(
        options.alignLabels ? contentBottom - separatorWidthScaled : 0,
        contentTop,
        separatorWidthScaled,
        contentBottom - contentTop
      );
    }

    context.restore();
  }

  topBottomTotalHeight(options) {
    const lines = this.getVisibleLines();
    if (!this.data.visible || lines === 0) {
      return { top: 0, bottom: 0, total: 0 };
    }

    const fontSize = options.fontSize;
    const paddingTop =
      options.paddingTop + this.commonData.additionalPaddingTop;
    const paddingBottom =
      (lines - 0.5) * fontSize +
      (lines - 1) * options.lineSpacing +
      options.paddingBottom +
      this.commonData.additionalPaddingBottom;

    return {
      top: fontSize / 2 + paddingTop,
      bottom: paddingBottom,
      total: fontSize / 2 + paddingTop + paddingBottom,
    };
  }

  hitTest(point) {
    const hitTestData = this.data.hitTestData;
    if (hitTestData === undefined || !this.data.visible) {
      return null;
    }

    const isTouch = lastMouseOrTouchEventInfo().isTouch;
    const { itemBox, clickHandler, tooltip } = hitTestData;
    const padding = isTouch ? 10 : 0;

    const hitTestBox = box(
      new Point(itemBox.min.x - padding, itemBox.min.y - padding),
      new Point(itemBox.max.x + padding, itemBox.max.y + padding)
    );

    if (pointInBox(point, hitTestBox)) {
      return {
        hitTest: { hitTestData },
        cursor: "default",
        clickHandler: clickHandler ? clickHandler.bind(null, point) : undefined,
        tooltip,
      };
    }

    return null;
  }

  getVisibleLines() {
    const data = this.data;
    return (
      (data.text ? 1 : 0) + (data.secondLine ? 1 : 0) + (data.thirdLine ? 1 : 0)
    );
  }

  isOutOfScreen(options, minVisible, maxVisible) {
    const fixedCoordinate =
      this.commonData.fixedCoordinate ?? this.commonData.coordinate;
    const { total } = this.topBottomTotalHeight(options);
    const lineHeight = total / this.getVisibleLines();

    return (
      fixedCoordinate - lineHeight / 2 - 3 > maxVisible.y ||
      fixedCoordinate + (total - lineHeight / 2) + 3 < minVisible.y
    );
  }
}

const drawRoundRectWithInnerBorder = (
  context,
  x,
  y,
  width,
  height,
  backgroundColor,
  innerRadii,
  borderWidth,
  borderColor,
  borderStyle
) => {
  context.fillStyle = backgroundColor;
  const [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
    innerRadii;

  context.beginPath();
  context.moveTo(x + topLeftRadius, y);
  context.lineTo(x + width - topRightRadius, y);
  context.arc(
    x + width - topRightRadius,
    y + topRightRadius,
    topRightRadius,
    -Math.PI / 2,
    0
  );
  context.lineTo(x + width, y + height - bottomRightRadius);
  context.arc(
    x + width - bottomRightRadius,
    y + height - bottomRightRadius,
    bottomRightRadius,
    0,
    Math.PI / 2
  );
  context.lineTo(x + bottomLeftRadius, y + height);
  context.arc(
    x + bottomLeftRadius,
    y + height - bottomLeftRadius,
    bottomLeftRadius,
    Math.PI / 2,
    Math.PI
  );
  context.lineTo(x, y + topLeftRadius);
  context.arc(
    x + topLeftRadius,
    y + topLeftRadius,
    topLeftRadius,
    Math.PI,
    Math.PI + Math.PI / 2
  );
  context.closePath();
  context.fill();

  if (borderWidth > 0) {
    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.stroke();
  }
};

const drawScaled = (context, xScale, yScale, callback) => {
  context.save();
  context.scale(xScale, yScale);
  callback();
  context.restore();
};

export { PriceAxisView };
