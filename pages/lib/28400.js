import { generateColor } from "some-library"; // ! not correct
import { HitTestResult, HitTarget } from "./18807";
import { Point } from "some-library"; // ! not correct
import { distanceToSegment, intersectLineSegments } from "some-library"; // ! not correct
import { coordinateIsValid, interactionTolerance } from "./45197";
import { SeriesSingleLinePaneView, SelectionRenderer } from "./96476";

import { CompositeRenderer } from "./CompositeRenderer";
import { SelectionRenderer } from "./80101";

class BaselineCoordinatesPaneRenderer extends MediaCoordinatesPaneRenderer {
  constructor() {
    super();
    this._data = null;
  }

  setData(data) {
    this._data = data;
  }

  hitTest(point) {
    if (this._data === null) return null;

    const { items, topLineWidth, bottomLineWidth } = this._data;
    const tolerance =
      interactionTolerance().series + (topLineWidth + bottomLineWidth) / 4;
    const startIndex = lowerbound(items, point, (item, p) => item.x <= p.x);
    const endIndex = Math.min(items.length - 1, startIndex + 1);

    for (let i = startIndex; i <= endIndex; ++i) {
      const currentItem = items[i - 1];
      const nextItem = items[i];
      const { distance } = distanceToSegment(
        new Point(currentItem.x, currentItem.y),
        new Point(nextItem.x, nextItem.y),
        new Point(point.x, point.y)
      );

      if (distance <= tolerance) {
        return new HitTestResult(HitTarget.Regular);
      }
    }

    return null;
  }

  _drawImpl(context) {
    if (this._data === null) return;

    const {
      items,
      baseLevelCoordinate,
      bottom,
      bottomFillColor1,
      bottomFillColor2,
      topFillColor1,
      topFillColor2,
      topLineColor,
      bottomLineColor,
      topLineWidth,
      bottomLineWidth,
    } = this._data;

    if (
      !(function isValid(items) {
        if (items.length === 0) return false;
        const startIndex = items.findIndex((item) => coordinateIsValid(item.y));
        if (startIndex === -1) return false;
        let endIndex = items.length - 1;
        while (endIndex > startIndex && !coordinateIsValid(items[endIndex].y)) {
          endIndex--;
        }
        return !(startIndex > endIndex);
      })(items)
    ) {
      return;
    }

    const ctx = context.context;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw top area
    if (items.length > 0) {
      const { topItems, bottomItems } = generateTopAndBottomItems(
        items,
        baseLevelCoordinate
      );

      ctx.beginPath();
      ctx.moveTo(topItems[0].x, baseLevelCoordinate);
      makeLine(ctx, topItems, true, 0);
      ctx.closePath();
      ctx.fillStyle = makeLinearGradient(
        ctx,
        topFillColor1,
        topFillColor2,
        baseLevelCoordinate - bottom,
        baseLevelCoordinate
      );
      ctx.fill();

      ctx.beginPath();
      makeLine(ctx, topItems, false, 0);
      ctx.lineWidth = topLineWidth;
      ctx.strokeStyle = topLineColor;
      ctx.stroke();
    }

    // Draw bottom area
    if (bottomItems.length > 0) {
      ctx.beginPath();
      ctx.moveTo(bottomItems[0].x, baseLevelCoordinate);
      makeLine(ctx, bottomItems, true, 1);
      ctx.closePath();
      ctx.fillStyle = makeLinearGradient(
        ctx,
        bottomFillColor1,
        bottomFillColor2,
        baseLevelCoordinate,
        baseLevelCoordinate + bottom
      );
      ctx.fill();

      ctx.beginPath();
      makeLine(ctx, bottomItems, false, 1);
      ctx.lineWidth = bottomLineWidth;
      ctx.strokeStyle = bottomLineColor;
      ctx.stroke();
    }
  }

  makeLine(ctx, items, isFirst, areaIndex) {
    if (this._data === null) return;

    const startIndex = items.findIndex((item) => coordinateIsValid(item.y));
    if (startIndex === -1) return;

    const { barSpacing, baseLevelCoordinate } = this._data;
    const halfBarSpacing = 0.25 * barSpacing;

    let previousItem;
    const itemCount = items.length;

    for (let i = startIndex; i < itemCount; i++) {
      const currentItem = items[i];
      const nextItem = items[i + 1] || {};

      if (coordinateIsValid(currentItem.y)) {
        if (isFirst) {
          if (
            previousItem &&
            previousItem.y >= baseLevelCoordinate &&
            currentItem.y >= baseLevelCoordinate
          ) {
            ctx.moveTo(currentItem.x, currentItem.y);
            continue;
          }
        } else {
          if (
            previousItem &&
            previousItem.y <= baseLevelCoordinate &&
            currentItem.y <= baseLevelCoordinate
          ) {
            ctx.moveTo(currentItem.x, currentItem.y);
            continue;
          }
        }

        if (previousItem && coordinateIsValid(previousItem.y)) {
          ctx.lineTo(currentItem.x, currentItem.y);

          if (isFirst && !coordinateIsValid(nextItem.y)) {
            ctx.lineTo(currentItem.x, baseLevelCoordinate);
          }
        } else if (nextItem && coordinateIsValid(nextItem.y)) {
          if (isFirst) {
            if (i !== startIndex) {
              ctx.lineTo(currentItem.x, baseLevelCoordinate);
            }

            ctx.lineTo(currentItem.x, currentItem.y);
          } else {
            ctx.moveTo(currentItem.x, currentItem.y);
          }
        } else if (isFirst) {
          if (i === 0) continue;

          if (isFirst) {
            ctx.lineTo(currentItem.x - halfBarSpacing, baseLevelCoordinate);
            ctx.lineTo(currentItem.x - halfBarSpacing, currentItem.y);
            ctx.lineTo(currentItem.x + halfBarSpacing, currentItem.y);
            ctx.lineTo(currentItem.x + halfBarSpacing, baseLevelCoordinate);
          } else {
            ctx.moveTo(currentItem.x - halfBarSpacing, currentItem.y);
            ctx.lineTo(currentItem.x + halfBarSpacing, currentItem.y);
          }
        } else {
          ctx.moveTo(currentItem.x - halfBarSpacing, currentItem.y);
          ctx.lineTo(currentItem.x + halfBarSpacing, currentItem.y);
        }

        previousItem = currentItem;
      }
    }
  }

  makeLinearGradient(ctx, color1, color2, startY, endY) {
    const gradient = ctx.createLinearGradient(0, startY, 0, endY);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }
}

class SeriesBaselinePaneView extends SeriesSingleLinePaneView {
  constructor() {
    super();
    this._renderer = new BaselineCoordinatesPaneRenderer();
    this._topFillColor1 = "";
    this._topFillColor2 = "";
    this._bottomFillColor1 = "";
    this._bottomFillColor2 = "";
    this._topLineColor = "";
    this._bottomLineColor = "";
    this._topLineWidth = 0;
    this._bottomLineWidth = 0;
    this._barSpacing = 0;
    this._bottom = 0;
    this._baseLevelCoordinate = 0;
  }

  renderer() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }

    this._renderer.setData({
      items: this._items,
      topFillColor1: this._topFillColor1,
      topFillColor2: this._topFillColor2,
      bottomFillColor1: this._bottomFillColor1,
      bottomFillColor2: this._bottomFillColor2,
      topLineColor: this._topLineColor,
      bottomLineColor: this._bottomLineColor,
      topLineWidth: this._topLineWidth,
      bottomLineWidth: this._bottomLineWidth,
      barSpacing: this._barSpacing,
      baseLevelCoordinate: this._baseLevelCoordinate,
      bottom: this._bottom,
    });

    const renderer = new CompositeRenderer();
    renderer.append(this._renderer);

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      renderer.append(new SelectionRenderer(this._selectionData));
    }

    return renderer;
  }

  _updateImpl() {
    super._updateImpl();
    const priceScale = this._source.priceScale();

    if (!priceScale) return;

    const baselineStyle = this._source
      .properties()
      .childs()
      .baselineStyle.childs();
    const transparency = baselineStyle.transparency.value();

    this._topFillColor1 = generateColor(
      baselineStyle.topFillColor1.value(),
      transparency
    );
    this._topFillColor2 = generateColor(
      baselineStyle.topFillColor2.value(),
      transparency
    );
    this._bottomFillColor1 = generateColor(
      baselineStyle.bottomFillColor1.value(),
      transparency
    );
    this._bottomFillColor2 = generateColor(
      baselineStyle.bottomFillColor2.value(),
      transparency
    );
    this._topLineColor = baselineStyle.topLineColor.value();
    this._bottomLineColor = baselineStyle.bottomLineColor.value();
    this._topLineWidth = baselineStyle.topLineWidth.value();
    this._bottomLineWidth = baselineStyle.bottomLineWidth.value();
    this._barSpacing = this._model.timeScale().barSpacing();
    this._bottom = priceScale.height();
    this._baseLevelCoordinate = Math.round(
      this._bottom *
        (Math.abs(100 - baselineStyle.baseLevelPercentage.value()) / 100)
    );
  }
}
