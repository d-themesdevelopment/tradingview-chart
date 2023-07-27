import { translatedIntervalString } from "./translatedIntervalString";
import { getTranslatedSymbolDescription } from "./getTranslatedSymbolDescription";
import { CHART_FONT_FAMILY } from "./46501";

import { restoreWatermarkPropertyDefaults } from "./65632";
import { drawScaled } from "./74359";

import {
  watermarkProperty,
  applyDefaultsOverrides,
  applyPropertiesOverrides,
} from "./74359"; // ! not correct

const WATERMARK_TYPE = "symbolWatermark";

class Watermark {
  constructor(chartWidget, symbolInfoProvider) {
    const properties = {};
    const watermarkProperties = watermarkProperty();

    function measureTextWidth(ctx, font, text) {
      if (!properties.hasOwnProperty(font)) {
        properties[font] = {};
      }
      if (!properties[font].hasOwnProperty(text)) {
        properties[font][text] = ctx.measureText(text).width;
      }
      return properties[font][text];
    }

    applyDefaultsOverrides(
      watermarkProperties,
      undefined,
      false,
      WATERMARK_TYPE
    );

    watermarkProperties.listeners().subscribe(this, () => {
      chartWidget.updateSource(this);
    });

    this.destroy = function () {
      watermarkProperties.listeners().unsubscribeAll(this);
    };

    this.properties = function () {
      return watermarkProperties;
    };

    this.restorePropertiesDefaults = function () {
      restoreWatermarkPropertyDefaults();
    };

    this.applyOverrides = function (overrides) {
      applyPropertiesOverrides(
        watermarkProperties,
        undefined,
        false,
        overrides,
        WATERMARK_TYPE
      );
    };

    const renderer = {
      draw: function (ctx, pixelRatio) {
        return {
          draw: function (width, height) {
            drawScaled(ctx, pixelRatio, pixelRatio, function () {
              const symbol = symbolInfoProvider.symbolInfo();
              ctx.fillStyle = watermarkProperties.color.value();
              let displayName = symbol.name;

              // Check for QUANDL exchange and display only the last part of the name
              if (/QUANDL/.test(symbol.exchange)) {
                const nameParts = displayName.split(/\//);
                if (nameParts.length) {
                  displayName = nameParts[nameParts.length - 1];
                }
              }

              const symbolDescription = {
                description: symbol.description,
                short_description: symbol.short_description,
                pro_name: symbol.pro_name,
                short_name: symbol.name,
                local_description: symbol.local_description,
                language: symbol.language,
              };

              const watermarkContentProvider =
                chartWidget.watermarkContentProvider();
              const customContent = watermarkContentProvider
                ? watermarkContentProvider({
                    symbolInfo: symbol,
                    interval: symbolInfoProvider.interval(),
                  })
                : null;

              const lines = (customContent
                ? customContent.map((content) => ({
                    text: content.text,
                    font: `${content.fontSize}px ${CHART_FONT_FAMILY}`,
                    lineHeight: content.lineHeight,
                    vertOffset: content.vertOffset,
                  }))
                : null) || [
                {
                  text: displayName
                    ? displayName +
                      ", " +
                      translatedIntervalString(symbolInfoProvider.interval())
                    : "",
                  font: `96px ${CHART_FONT_FAMILY}`,
                  lineHeight: 117,
                  vertOffset: 0,
                },
                {
                  text: getTranslatedSymbolDescription(symbolDescription) || "",
                  font: `48px ${CHART_FONT_FAMILY}`,
                  lineHeight: 58,
                  vertOffset: 5,
                },
              ];

              let yOffset = 0;
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.text) {
                  ctx.font = line.font;
                  const zoom =
                    measureTextWidth(ctx, line.font, line.text) > width
                      ? width / measureTextWidth(ctx, line.font, line.text)
                      : 1;
                  yOffset += line.lineHeight * zoom;
                }
              }

              const y = Math.max((height - yOffset) / 2, 0);

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.text) {
                  ctx.save();
                  ctx.translate(width / 2, y);
                  ctx.textBaseline = "top";
                  ctx.textAlign = "center";
                  ctx.font = line.font;
                  ctx.scale(line.zoom, line.zoom);
                  ctx.fillText(line.text, 0, line.vertOffset);
                  ctx.restore();
                  y += line.lineHeight * line.zoom;
                }
              }
            });
          },
        };
      },
      update: function () {},
    };

    this.paneViews = function () {
      return symbolInfoProvider.symbolInfo() &&
        watermarkProperties.visibility.value()
        ? [renderer]
        : [];
    };
  }
}

export { Watermark };
