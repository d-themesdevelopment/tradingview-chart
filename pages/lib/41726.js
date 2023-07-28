import { clearStyle, createEmptyStyle } from "path/to/clearStyle";
import { ensureDefined } from "path/to/ensureDefined";
import {
  // isColorerPlot,
  isOhlcColorerPlot,
  // isTextColorerPlot,
  isBgColorerPlot,
  // isCandleBorderColorerPlot,
  // isCandleWickColorerPlot,
  // isUpColorerPlot,
  // isDownColorerPlot,
} from "path/to/plotUtils";
import { rgbaFromInteger } from "path/to/rgbaFromInteger";

const plotStyleMap = new Map([
  [0, "color"],
  [2, "textColor"],
  [3, "borderColor"],
  [4, "wickColor"],
  [5, "colorup"],
  [6, "colordown"],
]);

class PlotColorProvider {
  constructor(plotStyle) {
    this._plotStyle = plotStyle;
  }

  getPlotPointStyle(values, style) {
    const pointStyle = style ? clearStyle(style) : createEmptyStyle();

    plotStyleMap.forEach((styleProp, plotIndex) => {
      if (this._plotStyle[styleProp]) {
        pointStyle.colors[plotIndex] = this._plotStyle[styleProp].value();
      }
    });

    pointStyle.lineWidth = this._plotStyle.linewidth
      ? this._plotStyle.linewidth.value()
      : undefined;
    pointStyle.lineStyle = this._plotStyle.linestyle
      ? this._plotStyle.linestyle.value()
      : undefined;

    return pointStyle;
  }

  isColorDefined() {
    return true;
  }

  singleColor() {
    return true;
  }

  getDefaultPlotPointStyle() {
    return null;
  }
}

const paletteIndexes = [0, 1, 2, 3, 4, 5, 6];

class PalettePlotColorProvider {
  constructor(chartStyle, palettes, plotIndex, indexes) {
    this._palettesColors = new Map();
    this._defaultPlotColors = new Map();
    this._indexes = indexes;

    const plotStyle = chartStyle.styles[plotIndex];
    if (plotStyle) {
      for (const [plotIndex, styleProp] of plotStyleMap) {
        this._defaultPlotColors.set(plotIndex, plotStyle[styleProp]);
      }
    }

    const chartPalettes = ensureDefined(chartStyle.palettes);
    const chartPlots = chartStyle.plots;

    indexes.forEach((index, plotIndex) => {
      const plot = chartPlots[index];
      if (plot && "palette" in plot) {
        const palette = chartPalettes[plot.palette];
        const paletteStyle = palettes[plot.palette];
        if (palette && paletteStyle) {
          const { valToIndex } = palette;
          const { colors } = paletteStyle;
          const indexedColors = { ...colors };

          if (valToIndex) {
            Object.keys(valToIndex).forEach((value) => {
              const index = valToIndex[value];
              if (index !== undefined) {
                indexedColors[value] = colors[index];
              }
            });
          }

          this._palettesColors.set(plotIndex, indexedColors);
        }
      }
    });
  }

  getPlotPointStyle(values, style) {
    const pointStyle = style ? clearStyle(style) : createEmptyStyle();

    paletteIndexes.forEach((plotIndex) => {
      if (this._palettesColors.has(plotIndex)) {
        const value = values[this._indexes.get(plotIndex) + 1];
        if (typeof value === "number") {
          const color = this._palettesColors.get(plotIndex)[value];
          if (plotIndex === 0 && color) {
            pointStyle.lineWidth = color.width.value();
            pointStyle.lineStyle = color.style.value();
          }
          pointStyle.colors[plotIndex] = color?.color.value();
        } else {
          pointStyle.colors[plotIndex] = "transparent";
        }
      } else {
        pointStyle.colors[plotIndex] = this._defaultPlotColors
          .get(plotIndex)
          ?.value();
      }
    });

    return pointStyle;
  }

  getDefaultPlotPointStyle() {
    const defaultColor = this._palettesColors.get(0)?.[0];
    if (defaultColor !== undefined) {
      return {
        colors: [
          defaultColor.color.value(),
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        lineStyle: undefined,
        lineWidth: defaultColor.width.value(),
      };
    }

    return null;
  }

  isColorDefined() {
    return !!this._palettesColors.size;
  }

  singleColor() {
    return false;
  }
}

class IntegerPlotColorProvider {
  constructor(indexes) {
    this._indexes = indexes;
  }

  getPlotPointStyle(values, style) {
    const pointStyle = style ? clearStyle(style) : createEmptyStyle();

    this._indexes.forEach((index, plotIndex) => {
      const value = values[index + 1];
      if (value !== null && value !== undefined) {
        const color = rgbaFromInteger(value);
        pointStyle.colors[plotIndex] = color;
      } else {
        pointStyle.colors[plotIndex] = "transparent";
      }
    });

    return pointStyle;
  }

  isColorDefined() {
    return true;
  }

  singleColor() {
    return false;
  }

  getDefaultPlotPointStyle() {
    return null;
  }
}

const colorerFunctions = new Map([
  [
    0,
    (target, plot) => {
      const isColorerPlot = isColorerPlot(plot) || isOhlcColorerPlot(plot);
      return "target" in plot && plot.target === target && isColorerPlot;
    },
  ],
  [
    2,
    (target, plot) => {
      const isTextColorerPlot = isTextColorerPlot(plot);
      return "target" in plot && plot.target === target && isTextColorerPlot;
    },
  ],
  [
    1,
    (target, plot) => {
      return isBgColorerPlot(plot) && plot.id === target;
    },
  ],
  [
    3,
    (target, plot) => {
      const isCandleBorderColorerPlot = isCandleBorderColorerPlot(plot);
      return (
        "target" in plot && plot.target === target && isCandleBorderColorerPlot
      );
    },
  ],
  [
    4,
    (target, plot) => {
      const isCandleWickColorerPlot = isCandleWickColorerPlot(plot);
      return (
        "target" in plot && plot.target === target && isCandleWickColorerPlot
      );
    },
  ],
  [
    5,
    (target, plot) => {
      const isUpColorerPlot = isUpColorerPlot(plot);
      return "target" in plot && plot.target === target && isUpColorerPlot;
    },
  ],
  [
    6,
    (target, plot) => {
      const isDownColorerPlot = isDownColorerPlot(plot);
      return "target" in plot && plot.target === target && isDownColorerPlot;
    },
  ],
]);

function createStudyPlotColorProvider(chartStyle, palettes, plotIndex) {
  const { plotIndex: index, colorers } = (function findPlotIndex(
    chartStyle,
    plotId
  ) {
    const plots = chartStyle.plots;
    const plotIndex = plots.findIndex((plot) => plot.id === plotId);
    const colorers = new Map();
    plots.forEach((plot, index) => {
      colorerFunctions.forEach((func, colorerIndex) => {
        if (func(plotId, plot)) {
          colorers.set(colorerIndex, index);
        }
      });
    });
    return {
      plotIndex: index === -1 ? null : index,
      colorers: colorers,
    };
  })(chartStyle, plotIndex);

  if (colorers.size) {
    return chartStyle.isRGB
      ? new IntegerPlotColorProvider(colorers)
      : new PalettePlotColorProvider(chartStyle, palettes, plotIndex, colorers);
  } else {
    const ohlcPlots = chartStyle.ohlcPlots;
    if (ohlcPlots && ohlcPlots[plotIndex]) {
      return new PlotColorProvider(ohlcPlots[plotIndex]);
    }
    const plotStyle = chartStyle.styles[plotIndex];
    return new PlotColorProvider(plotStyle);
  }
}

export { createStudyPlotColorProvider };
