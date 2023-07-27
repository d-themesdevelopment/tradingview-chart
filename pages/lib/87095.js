import {
  rgbaToString,
  rgba,
  parseRgb,
  normalizeAlphaComponent,
  parseRgba,
  rgbToBlackWhiteString,
  tryParseRgba,
} from "path/to/s";

function generateColor(color, transparency, useAlpha) {
  if (transparency === undefined) {
    transparency = 0;
  }
  if (!isHexColor(color)) {
    return useAlpha
      ? rgbaToString(
          rgba(
            parseRgb(color),
            normalizeAlphaComponent(transparencyToAlpha(transparency))
          )
        )
      : color;
  }
  const [r, g, b] = parseRgb(color);
  const alpha = normalizeAlphaComponent(transparencyToAlpha(transparency));
  return rgbaToString([r, g, b, alpha]);
}

function applyAlpha(color, alpha) {
  return generateColor(color, transparencyFromAlpha(alpha), true);
}

function transparencyFromAlpha(alpha) {
  return 100 * (1 - alpha);
}

function transparencyToAlpha(transparency) {
  if (transparency < 0 || transparency > 100) {
    throw new Error("Invalid transparency");
  }
  return 1 - transparency / 100;
}

function applyTransparency(color, transparency) {
  if (color === "transparent") {
    return color;
  }
  const rgba = parseRgba(color);
  const originalAlpha = rgba[3];
  const modifiedAlpha = transparencyToAlpha(transparency) * originalAlpha;
  return rgbaToString(rgba(r, g, b, modifiedAlpha));
}

export function resetTransparency(color) {
  if (color === "transparent" || isHexColor(color)) {
    return color;
  }
  return rgbaToString(rgba(parseRgb(color), normalizeAlphaComponent(1)));
}

function getLuminance(color) {
  const rgb = parseRgb(color).map((value) =>
    value / 255 <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  );
  return Number(
    (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3)
  );
}

function isHexColor(color) {
  return color.startsWith("#");
}

function colorFromBackground(background) {
  return rgbToBlackWhiteString(parseRgb(background), 150) === "black"
    ? "#ffffff"
    : "#000000";
}

function gradientColorAtPercent(startColor, endColor, percent) {
  const [r1, g1, b1, a1] = parseRgba(startColor);
  const [r2, g2, b2, a2] = parseRgba(endColor);
  const interpolatedColor = rgba(
    Math.round(r1 + percent * (r2 - r1)),
    Math.round(g1 + percent * (g2 - g1)),
    Math.round(b1 + percent * (b2 - b1)),
    a1 + percent * (a2 - a1)
  );
  return rgbaToString(interpolatedColor);
}

function isColorDark(color) {
  return getLuminance(resetTransparency(color)) < 0.5;
}

function rgbaFromInteger(value) {
  const b = value % 256;
  value -= b;
  const g = (value /= 256) % 256;
  value -= g;
  const r = (value /= 256) % 256;
  value -= r;
  const a = value / 256 / 255;
  return `rgba(${r},${g},${b},${a})`;
}

function rgbaToInteger(rgba) {
  const alpha = Math.round(255 * rgba[3]);
  return rgba[0] + 256 * rgba[1] + 65536 * rgba[2] + 16777216 * alpha;
}

function colorToInteger(color) {
  const rgba = tryParseRgba(color);
  return rgba === null ? 0 : rgbaToInteger(rgba);
}

export {
  generateColor,
  applyAlpha,
  transparencyFromAlpha,
  transparencyToAlpha,
  applyTransparency,
  resetTransparency,
  getLuminance,
  isHexColor,
  colorFromBackground,
  gradientColorAtPercent,
  isColorDark,
  rgbaFromInteger,
  rgbaToInteger,
  colorToInteger,
};
