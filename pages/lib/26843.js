"use strict";

import { t } from "translation-module"; // ! not correct
import { parseRgba } from "rgba-module"; // ! not correct

const lightThemeContent = JSON.parse(
  '{"content":{"chartProperties":{"scalesProperties":{"textColor":"#131722","lineColor":"rgba(42, 46, 57, 0)","backgroundColor":"#ffffff"},"paneProperties":{"vertGridProperties":{"color":"rgba(42, 46, 57, 0.06)"},"horzGridProperties":{"color":"rgba(42, 46, 57, 0.06)"},"crossHairProperties":{"color":"#9598A1"},"background":"#ffffff","backgroundGradientStartColor":"#ffffff","backgroundGradientEndColor":"#ffffff","separatorColor":"#E0E3EB"}},"sessions":{"graphics":{"backgrounds":{"outOfSession":{"color":"#2962FF","transparency":92},"preMarket":{"color":"#FF9800","transparency":92},"postMarket":{"color":"#2962FF","transparency":92}},"vertlines":{"sessBreaks":{"color":"#4985e7","style":2,"width":1}}}},"mainSourceProperties":{"baseLineColor":"#B2B5BE","candleStyle":{"borderColor":"#378658","upColor":"#089981","wickColor":"#737375","wickUpColor":"#089981","wickDownColor":"#F23645","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645"},"haStyle":{"borderColor":"#378658","upColor":"#089981","wickColor":"#737375","wickUpColor":"#089981","wickDownColor":"#F23645","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645"},"barStyle":{"downColor":"#F23645","upColor":"#089981"},"pnfStyle":{"downColor":"#F23645","upColor":"#089981","upColorProjection":"#a9dcc3","downColorProjection":"#f5a6ae"},"baselineStyle":{"baselineColor":"#758696","topFillColor1":"rgba(8, 153, 129, 0.28)","topFillColor2":"rgba(8, 153, 129, 0.05)","bottomFillColor1":"rgba(242, 54, 69, 0.05)","bottomFillColor2":"rgba(242, 54, 69, 0.28)","topLineColor":"#089981","bottomLineColor":"#F23645"},"areaStyle":{"transparency":100,"color1":"rgba(41, 98, 255, 0.28)","color2":"#2962FF","linecolor":"#2962FF","linewidth":2,"linestyle":0},"hiloStyle":{"color":"#2962FF","borderColor":"#2962FF","labelColor":"#2962FF"},"columnStyle":{"upColor":"rgba(8, 153, 129, 0.5)","downColor":"rgba(242, 54, 69, 0.5)","priceSource":"close"},"renkoStyle":{"upColor":"#089981","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645","upColorProjection":"#a9dcc3","downColorProjection":"#f5a6ae","borderUpColorProjection":"#a9dcc3","borderDownColorProjection":"#f5a6ae","wickUpColor":"#089981","wickDownColor":"#F23645"},"lineStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"lineWithMarkersStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"steplineStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"kagiStyle":{"downColor":"#F23645","upColor":"#089981","upColorProjection":"#a9dcc3","downColorProjection":"#f5a6ae"},"pbStyle":{"upColor":"#089981","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645","upColorProjection":"#a9dcc3","downColorProjection":"#f5a6ae","borderUpColorProjection":"#a9dcc3","borderDownColorProjection":"#f5a6ae"},"rangeStyle":{"upColor":"#089981","downColor":"#F23645","upColorProjection":"#a9dcc3","downColorProjection":"#f5a6ae"}}}}'
);
const darkThemeContent = JSON.parse(
  '{"content":{"chartProperties":{"scalesProperties":{"textColor":"#B2B5BE","lineColor":"rgba(240, 243, 250, 0)","backgroundColor":"#ffffff"},"paneProperties":{"vertGridProperties":{"color":"rgba(240, 243, 250, 0.06)"},"horzGridProperties":{"color":"rgba(240, 243, 250, 0.06)"},"crossHairProperties":{"color":"#9598A1"},"background":"#131722","backgroundGradientStartColor":"#181C27","backgroundGradientEndColor":"#131722","backgroundType":"gradient","separatorColor":"#2A2E39"}},"sessions":{"graphics":{"backgrounds":{"outOfSession":{"color":"#2962FF","transparency":92},"preMarket":{"color":"#FF9800","transparency":92},"postMarket":{"color":"#2962FF","transparency":92}},"vertlines":{"sessBreaks":{"color":"#4985e7","style":2,"width":1}}}},"mainSourceProperties":{"baseLineColor":"#5d606b","candleStyle":{"borderColor":"#378658","upColor":"#089981","wickColor":"#B5B5B8","wickUpColor":"#089981","wickDownColor":"#F23645","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645"},"haStyle":{"borderColor":"#378658","upColor":"#089981","wickColor":"#B5B5B8","wickUpColor":"#089981","wickDownColor":"#F23645","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645"},"barStyle":{"downColor":"#F23645","upColor":"#089981"},"pnfStyle":{"downColor":"#F23645","upColor":"#089981","upColorProjection":"#336854","downColorProjection":"#7f323f"},"baselineStyle":{"baselineColor":"#758696","topFillColor1":"rgba(8, 153, 129, 0.28)","topFillColor2":"rgba(8, 153, 129, 0.05)","bottomFillColor1":"rgba(242, 54, 69, 0.05)","bottomFillColor2":"rgba(242, 54, 69, 0.28)","topLineColor":"#089981","bottomLineColor":"#F23645"},"areaStyle":{"transparency":100,"color1":"rgba(41, 98, 255, 0.28)","color2":"#2962FF","linecolor":"#2962FF","linewidth":2,"linestyle":0},"hiloStyle":{"color":"#2962FF","borderColor":"#2962FF","labelColor":"#2962FF"},"columnStyle":{"upColor":"rgba(8, 153, 129, 0.5)","downColor":"rgba(242, 54, 69, 0.5)","priceSource":"close"},"renkoStyle":{"upColor":"#089981","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645","upColorProjection":"#336854","downColorProjection":"#7f323f","borderUpColorProjection":"#336854","borderDownColorProjection":"#7f323f","wickUpColor":"#089981","wickDownColor":"#F23645"},"lineStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"lineWithMarkersStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"steplineStyle":{"color":"#2962FF","linewidth":2,"linestyle":0},"kagiStyle":{"downColor":"#F23645","upColor":"#089981","upColorProjection":"#336854","downColorProjection":"#7f323f"},"pbStyle":{"upColor":"#089981","downColor":"#F23645","borderUpColor":"#089981","borderDownColor":"#F23645","upColorProjection":"#336854","downColorProjection":"#7f323f","borderUpColorProjection":"#336854","borderDownColorProjection":"#7f323f"},"rangeStyle":{"upColor":"#089981","downColor":"#F23645","upColorProjection":"#336854","downColorProjection":"#7f323f"}}}}'
);

export const StdTheme = {
  Light: "light",
  Dark: "dark",
};

function getStdChartTheme(themeName) {
  const themes = {
    [StdTheme.Light]: JSON.parse(JSON.stringify(lightThemeContent)),
    [StdTheme.Dark]: JSON.parse(JSON.stringify(darkThemeContent)),
  };

  return themes[themeName];
}

function getStdThemeNames() {
  return [StdTheme.Light, StdTheme.Dark];
}

function translateThemeName(themeName) {
  const translations = {
    [StdTheme.Light]: t(
      null,
      { context: "colorThemeName" },
      "lightThemeNameTranslation"
    ),
    [StdTheme.Dark]: t(
      null,
      { context: "colorThemeName" },
      "darkThemeNameTranslation"
    ),
  };

  return translations[themeName] || themeName;
}

function isStdTheme(theme) {
  const themes = {
    [StdTheme.Light]: lightThemeContent,
    [StdTheme.Dark]: darkThemeContent,
  };

  return getStdThemeNames().some((name) => compareThemes(themes[name], theme));
}

function compareThemes(theme1, theme2) {
  let isEqual = theme1.content === theme2.content;

  function deepCompare(theme, target) {
    for (const key in theme) {
      if (theme.hasOwnProperty(key)) {
        const path = target.concat(key);
        if (typeof theme[key] === "object") {
          deepCompare(theme[key], path, target);
        } else if (target(path, theme[key])) {
          throw new Error("exit");
        }
      }
    }
  }

  deepCompare(theme1.content, (path, value) => {
    const targetValue = (function findTargetValue(obj, path = {}) {
      let target = path;
      for (let i = 0; i < obj.length; i++) {
        if (!target || typeof target !== "object") return;
        target = target[obj[i]];
      }
      if (typeof target === "string" || typeof target === "number")
        return target;
      return;
    })(path, theme2.content);

    isEqual = isEqual && !compareColors(value, targetValue);
  });

  return isEqual;
}

function compareColors(color1, color2) {
  if (color1 === color2) return true;
  if (typeof color1 !== "string" || typeof color2 !== "string") return false;
  try {
    return compareRgba(parseRgba(color1), parseRgba(color2));
  } catch (error) {
    return false;
  }
}

function compareRgba(rgba1, rgba2) {
  return (
    Math.hypot(
      rgba1[3] * rgba1[0] - rgba2[3] * rgba2[0],
      rgba1[3] * rgba1[1] - rgba2[3] * rgba2[1],
      rgba1[3] * rgba1[2] - rgba2[3] * rgba2[2],
      255 * rgba1[3] - 255 * rgba2[3]
    ) < 48
  );
}

export {
  StdTheme,
  getStdChartTheme,
  getStdThemeNames,
  isStdTheme,
  translateThemeName,
};
