import {
  ensureNotNull,
  size,
  bindCanvasElementBitmapSizeTo,
} from "util-module";
import { isRtl } from "direction-module";
import { isMac } from "platform-module";

function getCanvasDevicePixelRatio(element) {
  const { ownerDocument } = element;
  const { defaultView } = ownerDocument || {};
  return Math.max(1, defaultView?.devicePixelRatio || 1);
}

function getBindingPixelRatio(element) {
  return getCanvasDevicePixelRatio(element.canvasElement);
}

function getContext2D(element) {
  const ctx = ensureNotNull(element.getContext("2d"));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx;
}

function getPrescaledContext2D(element) {
  const ctx = ensureNotNull(element.getContext("2d"));
  const pixelRatio = getCanvasDevicePixelRatio(element);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return ctx;
}

function getPretransformedContext2D(element, translateHalfPixel = true) {
  const ctx = ensureNotNull(element.canvasElement.getContext("2d"));
  const pixelRatio = getBindingPixelRatio(element);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  if (translateHalfPixel) {
    ctx.translate(0.5, 0.5);
  }
  return ctx;
}

function fillRect(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.translate(-0.5, -0.5);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function clearRect(ctx, x, y, width, height, color) {
  ctx.save();
  ctx.translate(-0.5, -0.5);
  ctx.globalCompositeOperation = "copy";
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

export function drawScaled(ctx, scaleX, scaleY, renderCallback) {
  ctx.save();
  ctx.scale(scaleX, scaleY);
  renderCallback();
  ctx.restore();
}

function createDisconnectedCanvas(e, t) {
  const n = createCanvasElement();
  return y(n), (n.width = e.width * t), (n.height = e.height * t), n;
}

function createDisconnectedBoundCanvas(e, t) {
  const n = createCanvasElement();
  e.appendChild(n);
  const o = bindCanvasElementBitmapSizeTo(n, {
    type: "device-pixel-content-box",
    transform: (e, t) => ({
      width: Math.max(e.width, t.width),
      height: Math.max(e.height, t.height),
    }),
  });
  return o.resizeCanvasElement(t), o;
}

function createBoundCanvas(element, dimensions) {
  const canvasElement = createCanvasElement();
  element.appendChild(canvasElement);
  const binding = bindCanvasElementBitmapSizeTo(canvasElement, {
    type: "device-pixel-content-box",
    transform: (size, contentBoxSize) => ({
      width: Math.max(size.width, contentBoxSize.width),
      height: Math.max(size.height, contentBoxSize.height),
    }),
  });
  binding.resizeCanvasElement(dimensions);
  return binding;
}

function disableSelection(element) {
  element.style.userSelect = "none";
  element.style.webkitUserSelect = "none";
  element.style.msUserSelect = "none";
  element.style.MozUserSelect = "none";
  element.style.webkitTapHighlightColor = "transparent";
}

function calcTextHorizontalShift(e, t) {
  if (e.textAlign === "center") {
    return 0;
  }

  if (isRtl()) {
    return e.textAlign === "start" || e.textAlign === "right" ? t : 0;
  }

  return e.textAlign === "start" || e.textAlign === "left" ? 0 : t;
}

function addExclusionAreaByScope(context, scope) {
  const {
    context: ctx,
    horizontalPixelRatio: hRatio,
    verticalPixelRatio: vRatio,
    bitmapSize,
  } = context;
  ctx.beginPath();
  ctx.rect(0, 0, bitmapSize.width, bitmapSize.height);
  for (let i = 0; i < scope.length; i++) {
    const { x, y } = scope[i];
    const xScaled = x * hRatio;
    const yScaled = y * vRatio;
    if (i !== 0) {
      ctx.lineTo(xScaled, yScaled);
    } else {
      ctx.moveTo(xScaled, yScaled);
    }
  }
  ctx.closePath();
  ctx.clip("evenodd");
}

function addExclusionArea(context, rendererOptions) {
  addExclusionAreaByScope(context, rendererOptions.exclusionScope);
}

let textMeasurementContext;

function measureText(text, font) {
  if (!textMeasurementContext) {
    const canvas = document.createElement("canvas");
    canvas.width = 0;
    canvas.height = 0;
    if (isMac()) {
      canvas.style.display = "none";
      document.body.append(canvas);
    }
    textMeasurementContext = ensureNotNull(canvas.getContext("2d"));
    textMeasurementContext.textBaseline = "alphabetic";
    textMeasurementContext.textAlign = "center";
  }
  textMeasurementContext.font = font;
  return textMeasurementContext.measureText(text);
}

export {
  addExclusionArea,
  addExclusionAreaByScope,
  calcTextHorizontalShift,
  clearRect,
  createBoundCanvas,
  createDisconnectedBoundCanvas,
  createDisconnectedCanvas,
  disableSelection,
  drawScaled,
  fillRect,
  getBindingPixelRatio,
  getCanvasDevicePixelRatio,
  getContext2D,
  getPrescaledContext2D,
  getPretransformedContext2D,
  measureText,
};
