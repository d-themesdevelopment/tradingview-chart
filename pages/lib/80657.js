import { Point, box } from "some-library"; // ! not correct
import { ensureNotNull, ensureDefined } from "./assertions";
// import { isString, isNumber, deepEquals } from 'another-library';
import { measureText, drawScaled } from "./74359";

import { drawRoundRect, setLineStyle } from "./68441";
import { LINESTYLE_DASHED } from "./79849";

import { HitTestResult, HitTarget, AreaName } from "./18807";

class TextRenderer {
  constructor(data, hitTestResult) {
    this._data = null;
    this._internalData = null;
    this._boxSize = null;
    this._polygonPoints = null;
    this._linesInfo = null;
    this._fontInfo = null;
    this._hittest =
      hitTestResult ||
      new HitTestResult(HitTarget.MovePoint, {
        areaName: AreaName.Text,
      });
    if (data !== undefined) {
      this.setData(data);
    }
  }

  setData(data) {
    if (data !== null) {
      if (!areDataEqual(this._data, data)) {
        this._data = data;
        this._internalData = null;
        this._boxSize = null;
        this._polygonPoints = null;
        this._linesInfo = null;
        this._fontInfo = null;
      }
    } else {
      this._data = null;
    }
  }

  hitTest(point) {
    if (
      this._data === null ||
      this._data.points === undefined ||
      this._data.points.length === 0
    ) {
      return null;
    }
    if (pointInPolygon(point, this.getPolygonPoints())) {
      return this._hittest;
    }
    return null;
  }

  doesIntersectWithBox(box) {
    if (
      this._data !== null &&
      this._data.points !== undefined &&
      this._data.points.length !== 0
    ) {
      if (pointInBox(this._data.points[0], box)) {
        return true;
      }
    }
    return false;
  }

  measure() {
    if (this._data === null) {
      return { width: 0, height: 0 };
    }
    const boxSize = this._getBoxSize();
    return {
      width: boxSize.boxWidth,
      height: boxSize.boxHeight,
    };
  }

  rect() {
    if (this._data === null) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    const internalData = this._getInternalData();
    return {
      x: internalData.boxLeft,
      y: internalData.boxTop,
      width: internalData.boxWidth,
      height: internalData.boxHeight,
    };
  }

  isOutOfScreen(screenWidth, screenHeight) {
    if (
      this._data === null ||
      this._data.points === undefined ||
      this._data.points.length === 0
    ) {
      return true;
    }
    const internalData = this._getInternalData();
    if (
      internalData.boxLeft + internalData.boxWidth < 0 ||
      internalData.boxLeft > screenWidth
    ) {
      const screenBox = box(
        new Point(0, 0),
        new Point(screenWidth, screenHeight)
      );
      return this.getPolygonPoints().every(
        (point) => !pointInBox(point, screenBox)
      );
    }
    return false;
  }

  setPoints(points, hitTestResult) {
    this._data.points = points;
    this._hittest = hitTestResult || new HitTestResult(HitTarget.MovePoint);
  }

  fontStyle() {
    if (this._data === null) {
      return "";
    }
    return this._getFontInfo().fontStyle;
  }

  wordWrap(text, font, maxWidth) {
    return wordWrap(
      text,
      maxWidth || this._data.wordWrapWidth,
      font || this.fontStyle()
    );
  }

  draw(context, renderingOptions) {
    if (
      this._data === null ||
      this._data.points === undefined ||
      this._data.points.length === 0
    ) {
      return;
    }
    if (
      this.isOutOfScreen(renderingOptions.cssWidth, renderingOptions.cssHeight)
    ) {
      return;
    }
    const pixelRatio = renderingOptions.pixelRatio;
    const internalData = this._getInternalData();
    const rotationPoint = this._getRotationPoint().scaled(pixelRatio);

    context.save();
    context.translate(rotationPoint.x, rotationPoint.y);
    context.rotate(this._data.angle || 0);
    context.translate(-rotationPoint.x, -rotationPoint.y);

    const fontSize = this._getFontInfo().fontSize;
    context.textBaseline = internalData.textBaseLine;
    context.textAlign = internalData.textAlign;
    context.font = this.fontStyle();

    const { scaledLeft, scaledRight, scaledTop, scaledBottom } = getScaledBox(
      internalData,
      pixelRatio
    );
    if (
      this._data.backgroundColor ||
      this._data.borderColor ||
      (this._data.highlightBorder && this._data.wordWrapWidth)
    ) {
      const borderWidth = this._data.borderWidth || Math.max(fontSize / 12, 1);
      const scaledBorderWidth = Math.round(borderWidth * pixelRatio);
      const halfBorderWidth = scaledBorderWidth / 2;
      let drawShadow = false;
      if (this._data.boxShadow) {
        context.save();
        const {
          shadowColor,
          shadowBlur,
          shadowOffsetX = 0,
          shadowOffsetY = 0,
        } = this._data.boxShadow;
        context.shadowColor = shadowColor;
        context.shadowBlur = shadowBlur;
        context.shadowOffsetX = shadowOffsetX;
        context.shadowOffsetY = shadowOffsetY;
        drawShadow = true;
      }
      if (this._data.backgroundRoundRect) {
        if (this._data.backgroundColor) {
          drawRoundRect(
            context,
            scaledLeft,
            scaledTop,
            scaledRight - scaledLeft,
            scaledBottom - scaledTop,
            this._data.backgroundRoundRect * pixelRatio
          );
          context.fillStyle = this._data.backgroundColor;
          context.fill();
          if (drawShadow) {
            context.restore();
            drawShadow = false;
          }
        }
        if (this._data.borderColor) {
          drawRoundRect(
            context,
            scaledLeft - halfBorderWidth,
            scaledTop - halfBorderWidth,
            scaledRight - scaledLeft + scaledBorderWidth,
            scaledBottom - scaledTop + scaledBorderWidth,
            this._data.backgroundRoundRect * pixelRatio + scaledBorderWidth
          );
          context.strokeStyle = this._data.borderColor;
          context.lineWidth = scaledBorderWidth;
          context.stroke();
          if (drawShadow) {
            context.restore();
            drawShadow = false;
          }
        }
      } else {
        if (this._data.backgroundColor) {
          context.fillStyle = this._data.backgroundColor;
          context.fillRect(
            scaledLeft,
            scaledTop,
            scaledRight - scaledLeft,
            scaledBottom - scaledTop
          );
          if (drawShadow) {
            context.restore();
            drawShadow = false;
          }
        } else if (this._data.borderColor || this._data.highlightBorder) {
          let lineWidth;
          if (this._data.borderColor) {
            context.strokeStyle = this._data.borderColor;
            lineWidth = scaledBorderWidth;
          } else {
            context.strokeStyle = this._data.color;
            setLineStyle(context, LINESTYLE_DASHED);
            lineWidth = Math.max(1, Math.floor(pixelRatio));
          }
          context.lineWidth = lineWidth;
          context.beginPath();
          context.moveTo(scaledLeft - lineWidth / 2, scaledTop - lineWidth / 2);
          context.lineTo(
            scaledLeft - lineWidth / 2,
            scaledBottom + lineWidth / 2
          );
          context.lineTo(
            scaledRight + lineWidth / 2,
            scaledBottom + lineWidth / 2
          );
          context.lineTo(
            scaledRight + lineWidth / 2,
            scaledTop - lineWidth / 2
          );
          context.lineTo(scaledLeft - lineWidth / 2, scaledTop - lineWidth / 2);
          context.stroke();
          if (drawShadow) {
            context.restore();
          }
        }
      }
    }

    context.fillStyle = this._data.color;
    const textStart =
      (scaledLeft + Math.round(internalData.textStart * pixelRatio)) /
      pixelRatio;
    const textTop =
      (scaledTop +
        Math.round((internalData.textTop + 0.05 * fontSize) * pixelRatio)) /
      pixelRatio;
    const padding = getPadding(this._data);
    const linesInfo = this.getLinesInfo();
    for (const line of linesInfo.lines) {
      drawScaled(context, pixelRatio, pixelRatio, () =>
        context.fillText(line, textStart, textTop)
      );
      textTop += fontSize + padding;
    }

    context.restore();
  }

  getPolygonPoints() {
    if (this._polygonPoints !== null) {
      return this._polygonPoints;
    }
    if (this._data === null) {
      return [];
    }
    const angle = this._data.angle || 0;
    const { boxLeft, boxTop, boxWidth, boxHeight } = this._getInternalData();
    const rotationPoint = this._getRotationPoint();
    this._polygonPoints = [
      rotatePoint(new Point(boxLeft, boxTop), rotationPoint, angle),
      rotatePoint(new Point(boxLeft + boxWidth, boxTop), rotationPoint, angle),
      rotatePoint(
        new Point(boxLeft + boxWidth, boxTop + boxHeight),
        rotationPoint,
        angle
      ),
      rotatePoint(new Point(boxLeft, boxTop + boxHeight), rotationPoint, angle),
    ];
    return this._polygonPoints;
  }

  getLinesInfo() {
    if (this._linesInfo === null) {
      const data = ensureNotNull(this._data);
      let wrappedText = this.wordWrap(data.text, data.font, data.wordWrapWidth);
      if (data.maxHeight !== undefined) {
        const maxLines = Math.floor(
          (ensureDefined(data.maxHeight) + getPadding(data)) /
            (getFontSize(data) + getPadding(data))
        );
        if (wrappedText.length > maxLines) {
          wrappedText = wrappedText.slice(0, maxLines);
        }
      }
      this._linesInfo = {
        linesMaxWidth: this._getLinesMaxWidth(wrappedText),
        lines: wrappedText,
      };
    }
    return this._linesInfo;
  }

  _getLinesMaxWidth(lines) {
    const fontStyle = this.fontStyle();
    if (
      this._data !== null &&
      this._data.wordWrapWidth &&
      !this._data.forceCalculateMaxLineWidth
    ) {
      return this._data.wordWrapWidth * getFontSize(this._data);
    }
    let maxWidth = 0;
    for (const line of lines) {
      maxWidth = Math.max(maxWidth, measureText(line, fontStyle).width);
    }
    return maxWidth;
  }

  _getInternalData() {
    if (this._internalData !== null) {
      return this._internalData;
    }
    const data = ensureNotNull(this._data);
    const boxSize = this._getBoxSize();
    const boxWidth = boxSize.boxWidth;
    const boxHeight = boxSize.boxHeight;
    const firstPoint = ensureDefined(data.points)[0];
    let topY = firstPoint.y;
    switch (data.vertAlign) {
      case "bottom":
        topY -= boxHeight + data.offsetY;
        break;
      case "middle":
        topY -= boxHeight / 2;
        break;
      case "top":
        topY += data.offsetY;
        break;
    }
    let leftX = firstPoint.x;
    const paddingHorz = getPaddingHorz(data);
    const paddingVert = getPaddingVert(data);
    const padding = getPadding(data);
    switch (data.horzAlign) {
      case "left":
        leftX += data.offsetX;
        break;
      case "center":
        leftX -= boxWidth / 2;
        break;
      case "right":
        leftX -= boxWidth + data.offsetX;
        break;
    }
    let textAlign;
    let textStart;
    const baseLineOffset = (paddingVert + getFontSize(data)) / 2;
    switch (ensureDefined(data.horzTextAlign)) {
      case "left":
        textAlign = "start";
        textStart = leftX + paddingHorz;
        if (isRtl()) {
          if (data.forceTextAlign) {
            textAlign = "left";
          } else {
            textStart = leftX + boxWidth - paddingHorz;
            textAlign = "right";
          }
        }
        break;
      case "center":
        textAlign = "center";
        textStart = leftX + boxWidth / 2;
        break;
      case "right":
        textAlign = "end";
        textStart = leftX + boxWidth - paddingHorz;
        if (isRtl() && data.forceTextAlign) {
          textAlign = "right";
        }
        break;
    }
    this._internalData = {
      boxLeft: leftX,
      boxTop: topY,
      boxWidth: boxWidth,
      boxHeight: boxHeight,
      textStart: textStart - leftX,
      textTop: baseLineOffset + topY,
      textAlign: textAlign,
      textBaseLine: "middle",
    };
    return this._internalData;
  }

  _getFontInfo() {
    if (this._fontInfo === null) {
      const data = ensureNotNull(this._data);
      const fontSize = getFontSize(data);
      const fontStyle =
        (data.bold ? "bold " : "") +
        (data.italic ? "italic " : "") +
        fontSize +
        "px " +
        data.font;
      this._fontInfo = {
        fontStyle: fontStyle,
        fontSize: fontSize,
      };
    }
    return this._fontInfo;
  }

  _getBoxSize() {
    if (this._boxSize === null) {
      const linesInfo = this.getLinesInfo();
      const data = ensureNotNull(this._data);
      this._boxSize = {
        boxWidth: calculateBoxWidth(data, linesInfo.linesMaxWidth),
        boxHeight: calculateBoxHeight(data, linesInfo.lines.length),
      };
    }
    return this._boxSize;
  }

  _getRotationPoint() {
    const { boxLeft, boxTop, boxWidth, boxHeight } = this._getInternalData();
    const { horzAlign, vertAlign } = ensureNotNull(this._data);
    let rotationPointX, rotationPointY;
    switch (horzAlign) {
      case "center":
        rotationPointX = boxLeft + boxWidth / 2;
        break;
      case "left":
        rotationPointX = boxLeft;
        break;
      case "right":
        rotationPointX = boxLeft + boxWidth;
        break;
    }
    switch (vertAlign) {
      case "middle":
        rotationPointY = boxTop + boxHeight / 2;
        break;
      case "top":
        rotationPointY = boxTop;
        break;
      case "bottom":
        rotationPointY = boxTop + boxHeight;
        break;
    }
    return new Point(rotationPointX, rotationPointY);
  }
}
