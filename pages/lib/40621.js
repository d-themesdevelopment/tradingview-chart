import { lowerbound } from "./78071";
import { point, drawRoundRect } from "./78071"; // ! not correct
import { BitmapCoordinatesPaneRenderer } from "./BitmapCoordinatesPaneRenderer";
import { HitTestResult, HitTarget } from "./18807";
import { applyTransparency } from "./87095";
import { ensureDefined } from "./assertions";

class StepLineDecoration {
  constructor() {
    this._lineWidth = 1;
  }

  initialize(style, rendererParams, itemParams) {
    const { context, horizontalPixelRatio } = rendererParams;
    this.applyColor(
      context,
      ensureDefined(itemParams.style.color, style.lineColor)
    );
    this._lineWidth = Math.max(
      Math.floor(
        ensureDefined(
          itemParams.style.width,
          style.lineWidth * horizontalPixelRatio
        )
      )
    );
  }

  finishFragment(context) {
    context.fill();
  }

  drawItem(rendererParams, from, to, isContinuation) {
    if (isContinuation && to && !Number.isNaN(to.y)) {
      const { context } = rendererParams;
      context.save();
      context.translate(to.x, to.y);
      context.rotate(Math.PI / 4);
      const scale = this._scaleByLineWidth(this._lineWidth);
      context.scale(scale, scale);
      this._drawItemRotatedAndTranslated(rendererParams);
      context.restore();
    }
  }

  applyLineWidth(context, width) {
    this._lineWidth = width;
  }

  hitTest(rendererParams, pixelRatio, itemParams, startPoint, endPoint) {
    if (!itemParams.valIsNotSameAsPrev) {
      return false;
    }

    const centerX = Math.round((itemParams.x + startPoint.x) / 2);
    const centerPoint = point(centerX, startPoint.y);
    const offset = endPoint.subtract(centerPoint);
    const scaledLineWidth = Math.max(
      Math.floor(
        ensureDefined(
          itemParams.style.width,
          rendererParams.lineWidth * pixelRatio
        )
      )
    );

    return this._hitTestTranslated(offset, scaledLineWidth);
  }

  _scaleByLineWidth(width) {
    return Math.sqrt(width);
  }
}

class StepLineDecorationDiamonds extends StepLineDecoration {
  applyColor(context, color) {
    context.fillStyle = applyTransparency(color, 85);
  }

  _hitTestTranslated(offset, lineWidth) {
    return (
      Math.abs(offset.x) + Math.abs(offset.y) <
      (21 * this._scaleByLineWidth(lineWidth)) / 2
    );
  }

  _drawItemRotatedAndTranslated(rendererParams) {
    drawRoundRect(rendererParams.context, -10.5, -10.5, 21, 21, 5, true);
  }
}

class PaneRendererStepLine extends BitmapCoordinatesPaneRenderer {
  constructor(data, extendLineToLastConfirmedBar) {
    super();
    this._data = data || null;
    this._extendLineToLastConfirmedBar = Boolean(extendLineToLastConfirmedBar);
  }

  setData(data) {
    this._data = data;
  }

  hitTest(hitTestData) {
    const data = this._data;
    if (data === null || data.items.length === 0) {
      return null;
    }

    const {
      items,
      items: { length },
      lastConfirmedSeriesBarCoordinate: lastConfirmedBar,
      visibleItemsRange: { startItemIndex = 0, endItemIndex = length } = {
        startItemIndex: 0,
        endItemIndex: length,
      },
    } = data;
    const decorations =
      data.decoration === "Diamonds"
        ? [new StepLineDecoration(), new StepLineDecorationDiamonds()]
        : [new StepLineDecoration()];
    const index = lowerbound(
      items,
      hitTestData,
      (item, test) => item.x <= test.x,
      startItemIndex,
      endItemIndex
    );
    const startIndex = Math.max(0, index - 1);
    const endIndex = Math.min(length, index + 1);

    for (let i = startIndex; i < endIndex; i++) {
      const currentItem = items[i];
      const nextItem = items[i + 1];

      if (nextItem) {
        if (
          decorations.some((decoration) =>
            decoration.hitTest(
              data,
              hitTestData,
              currentItem,
              nextItem,
              hitTestData
            )
          )
        ) {
          return new HitTestResult(HitTarget.Regular);
        }
      } else if (
        this._extendLineToLastConfirmedBar &&
        lastConfirmedBar !== undefined &&
        endIndex === length &&
        currentItem.x < hitTestData.cssWidth &&
        currentItem.x < lastConfirmedBar
      ) {
        const endPoint = point(lastConfirmedBar, currentItem.y);
        if (
          StepLineDecoration.hitTest(
            data,
            hitTestData,
            currentItem,
            endPoint,
            hitTestData
          )
        ) {
          return new HitTestResult(HitTarget.Regular);
        }
      }
    }

    return null;
  }

  _drawImpl(rendererParams) {
    if (this._data === null || this._data.items.length === 0) {
      return;
    }

    const { lineWidth, lineColor, items } = this._data;
    const { context, horizontalPixelRatio, verticalPixelRatio, bitmapSize } =
      rendererParams;
    let lineWidthScaled = Math.max(
      Math.floor(
        ensureDefined(items[0].style.width, lineWidth * horizontalPixelRatio)
      )
    );
    const lineWidthOffset = lineWidthScaled % 2 ? 0.5 : 0;

    this._data.decoration === "Diamonds"
      ? [new StepLineDecoration(), new StepLineDecorationDiamonds()]
      : [new StepLineDecoration()].forEach((decoration) => {
          decoration.initialize(this._data, rendererParams, items[0]);
          const startItemIndex = ensureDefined(
            this._data.visibleItemsRange?.startItemIndex,
            0
          );
          const endItemIndex = ensureDefined(
            this._data.visibleItemsRange?.endItemIndex,
            items.length
          );

          context.beginPath();
          decoration.applyColor(
            context,
            ensureDefined(items[startItemIndex].style.color, lineColor)
          );

          for (let i = startItemIndex; i < endItemIndex; i++) {
            const currentItem = items[i];
            const nextItem = i === endItemIndex - 1 ? null : items[i + 1];
            let offset = 0;

            if (this._data.extendToBarsEndings) {
              i === startItemIndex && (offset = -this._data.barSpacing / 2);
              i === endItemIndex - 1 && (offset = this._data.barSpacing / 2);
            }

            const x =
              Math.round((currentItem.x + offset) * horizontalPixelRatio) +
              lineWidthOffset;
            const y =
              Math.round(currentItem.y * verticalPixelRatio) + lineWidthOffset;

            if (!nextItem) {
              if (decoration.drawItem(rendererParams, point(x, y))) {
                continue;
              }

              if (
                this._extendLineToLastConfirmedBar &&
                this._data.lastConfirmedSeriesBarCoordinate !== undefined &&
                x < bitmapSize.width &&
                currentItem.x < this._data.lastConfirmedSeriesBarCoordinate
              ) {
                const xEnd =
                  Math.round(
                    (this._data.lastConfirmedSeriesBarCoordinate + offset) *
                      horizontalPixelRatio
                  ) + lineWidthOffset;
                x < xEnd &&
                  decoration.drawItem(
                    rendererParams,
                    point(Math.min(bitmapSize.width, xEnd), y),
                    undefined,
                    true
                  );
              }

              continue;
            }

            const isNotSameAsPrev = currentItem.valIsNotSameAsPrev;
            const xNext =
              Math.round(
                (nextItem.x - this._data.barSpacing / 2) * horizontalPixelRatio
              ) + lineWidthOffset;
            const yNext =
              Math.round(nextItem.y * verticalPixelRatio) + lineWidthOffset;

            if (
              decoration.drawItem(
                rendererParams,
                point(x, y),
                point(xNext, yNext),
                isNotSameAsPrev
              )
            ) {
              continue;
            }

            const colorStart = ensureDefined(
              currentItem.style.color,
              lineColor
            );
            const widthStart = ensureDefined(
              currentItem.style.width,
              lineWidth
            );
            const colorEnd = ensureDefined(nextItem.style.color, lineColor);
            const widthEnd = ensureDefined(nextItem.style.width, lineWidth);

            const isColorChanged = colorStart !== colorEnd;
            const isWidthChanged = widthStart !== widthEnd;

            if (isColorChanged || isWidthChanged || isNaN(nextItem.y)) {
              decoration.finishFragment(context);
              if (isColorChanged) {
                decoration.applyColor(context, colorEnd);
              }
              if (isWidthChanged) {
                lineWidthScaled = Math.max(
                  1,
                  Math.floor(widthEnd * horizontalPixelRatio)
                );
                lineWidthOffset = lineWidthScaled % 2 ? 0.5 : 0;
                decoration.applyLineWidth(context, lineWidthScaled);
              }
              context.beginPath();
              context.moveTo(xNext, yNext);
            }
          }

          decoration.finishFragment(context);
        });
  }
}

export { PaneRendererStepLine, StepLineDecoration };
