import {
  assert as _assert,
  ensureDefined as _ensureDefined,
} from "./assertions";
import { LineStudyPlotStyle } from "./72877";

const getLogger = require("59224").getLogger; // ! not correct
const logger = getLogger("Chart.Model.StudyPropertiesOverrider");

function applyOverridesToStudy(study, overrides) {
  const properties = study.properties();
  const state = properties.state();

  for (const key in overrides) {
    if (overrides.hasOwnProperty(key)) {
      applyOverride(study.metaInfo(), state, key, overrides[key]);
    }
  }

  properties.mergeAndFire(state);
}

function applyOverridesToStudyDefaults(overrides, getStudyMetaInfo) {
  for (const key in overrides) {
    if (!overrides.hasOwnProperty(key)) continue;

    const dotIndex = key.indexOf(".");
    if (dotIndex === -1) continue;

    const studyName = key.substring(0, dotIndex);
    const metaInfo = getStudyMetaInfo(studyName);

    if (metaInfo === null) {
      logger.logWarn(`There is no such study ${studyName}`);
      continue;
    }

    const state = getStudyDefaults(metaInfo);
    const subKey = key.substring(dotIndex + 1);

    if (state !== null) {
      applyOverride(metaInfo, state, subKey, overrides[key]);
    } else {
      logger.logWarn(`Cannot apply overrides for study ${studyName}`);
    }
  }
}

function applyOverride(studyMetaInfo, state, key, value) {
  const path = key.split(".");
  if (path.length === 0 || path[0].length === 0) return;

  const { name, type } = parseProperty(path[0]);
  const propName = name;
  const propType = type !== null ? type : "input";
  const isBand = !type || type === "band";
  const isArea = !type || type === "area";
  const isInput = !type || type === "input";
  const isPlot = !type || type === "plot";
  const plotId = isPlot ? getPlotIdByTitle(studyMetaInfo, name) : null;
  const bandIndex = isBand ? getBandIndexByName(studyMetaInfo, name) : null;
  const areaId = isArea ? getFilledAreaIdByTitle(studyMetaInfo, name) : null;
  const inputId = isInput ? getInputByName(studyMetaInfo, name) : null;
  const hasProp = state.hasOwnProperty(name);

  if (
    (plotId !== null ? 1 : 0) +
      (bandIndex !== null ? 1 : 0) +
      (areaId !== null ? 1 : 0) +
      (inputId !== null ? 1 : 0) +
      (hasProp ? 1 : 0) >
    1
  ) {
    logger.logWarn(
      `Study '${studyMetaInfo.description}' has ambiguous identifier '${name}'`
    );
    return;
  }

  const subProp = path[1];

  if (plotId !== null) {
    if (path.length === 1) {
      logger.logWarn(
        `Path of sub-property of '${name}' plot for study '${studyMetaInfo.description}' must be not empty`
      );
      return;
    }

    const subPath = path.slice(1);
    applyPlotProperty(studyMetaInfo, state, plotId, subPath, value);
  } else if (inputId !== null) {
    applyInputValue(state, inputId, value);
  } else if (bandIndex !== null) {
    if (typeof subProp === "undefined") {
      logger.logWarn(
        `Property name of '${name}' band for study '${studyMetaInfo.description}' must be set`
      );
      return;
    }
    applyBandProperty(state, bandIndex, subProp, value);
  } else if (areaId !== null) {
    if (typeof subProp === "undefined") {
      logger.logWarn(
        `Property name of '${name}' area for study '${studyMetaInfo.description}' must be set`
      );
      return;
    }
    applyFilledAreaProperty(state, areaId, subProp, value);
  } else if (hasProp) {
    setRootProperty(state, path, value);
  } else {
    logger.logWarn(
      `Study '${studyMetaInfo.description}' has no plot or input '${name}'`
    );
  }
}

function parseProperty(str) {
  const parts = str.split(":");
  return {
    name: parts[0],
    type: parts.length === 2 ? parts[1] : null,
  };
}

function applyPlotProperty(studyMetaInfo, state, plotId, path, value) {
  if (typeof state.styles === "undefined") {
    logger.logWarn("Study does not have styles");
    return;
  }

  const propName = path[0];

  if (propName === "color") {
    const palette = getPaletteColorerPlot(studyMetaInfo, state, plotId);

    setColor(
      state.styles,
      palette,
      plotId,
      path.length > 1 ? parseInt(path[1]) : NaN,
      value
    );
  } else {
    const style = state.styles[plotId];

    if (typeof style !== "undefined" && style.hasOwnProperty(propName)) {
      if (propName === "plottype") {
        const plotType = LineStudyPlotStyle[value];
        if (typeof plotType === "undefined") {
          logger.logWarn(`Unsupported plot type for plot: ${value}`);
          return;
        }
        value = plotType;
      }
      style[propName] = value;
    } else {
      logger.logWarn(`Study plot does not have property '${propName}'`);
    }
  }
}

function applyBandProperty(studyMetaInfo, state, bandIndex, propName, value) {
  if (typeof state.bands === "undefined") {
    logger.logWarn("Study does not have bands");
    return;
  }

  const band = state.bands[bandIndex];

  if (typeof band !== "undefined" && band.hasOwnProperty(propName)) {
    if (propName === "plottype") {
      const plotType = LineStudyPlotStyle[value];
      if (typeof plotType === "undefined") {
        logger.logWarn(`Unsupported plot type for band: ${value}`);
        return;
      }
      value = plotType;
    }
    band[propName] = value;
  } else {
    logger.logWarn(`Study band does not have property '${propName}'`);
  }
}

function applyFilledAreaProperty(
  studyMetaInfo,
  state,
  areaId,
  propName,
  value
) {
  if (typeof state.filledAreasStyle === "undefined") {
    logger.logWarn("Study does not have areas");
    return;
  }

  const areaStyle = state.filledAreasStyle[areaId];
  if (typeof areaStyle !== "undefined" && areaStyle.hasOwnProperty(propName)) {
    areaStyle[propName] = value;
  } else {
    logger.logWarn(`Study area does not have property '${propName}'`);
  }
}

function applyInputValue(state, inputId, value) {
  if (
    typeof state.inputs !== "undefined" &&
    state.inputs.hasOwnProperty(inputId)
  ) {
    state.inputs[inputId] = value;
  } else {
    logger.logWarn(`Study does not have input '${inputId}'`);
  }
}

function setRootProperty(state, path, value) {
  if (path.length === 0) return;

  let obj = state;

  for (const key of path.slice(0, -1)) {
    if (obj === null || !obj.hasOwnProperty(key)) break;
    obj = obj[key];
  }

  const propName = path[path.length - 1];

  if (obj !== null && obj.hasOwnProperty(propName)) {
    obj[propName] = value;
  } else {
    logger.logWarn(`Study does not have property ${path.join(".")}`);
  }
}

function getPaletteColorerPlot(studyMetaInfo, state, plotId) {
  if (typeof state.styles === "undefined") return null;

  for (const plot of state.plots) {
    if (!isPaletteColorerPlot(plot) || typeof state.palettes === "undefined")
      continue;

    const palette = state.palettes[plot.palette];
    if (plot.target === plotId && typeof palette !== "undefined")
      return palette;
  }

  return null;
}

function getColor(style, palette, plotId, colorIndex, color) {
  if (typeof style !== "undefined") {
    if (palette === null && !isNaN(colorIndex) && colorIndex > 0) {
      logger.logWarn(`Study plot does not have color #${colorIndex}`);
    } else if (palette !== null && typeof palette.colors !== "undefined") {
      style[colorIndex === 0 || isNaN(colorIndex) ? 0 : colorIndex].color =
        String(color);
    }
  } else {
    logger.logWarn("Study does not have styles");
  }
}

function getPlotIdByTitle(studyMetaInfo, title) {
  if (typeof studyMetaInfo.styles === "undefined") return null;

  title = title.toLowerCase();

  for (const plotId in studyMetaInfo.styles) {
    const style = studyMetaInfo.styles[plotId];
    const plotTitle = (
      style && style.title ? style.title : plotId
    ).toLowerCase();

    if (plotTitle === title) return plotId;
  }

  return null;
}

function getFilledAreaIdByTitle(studyMetaInfo, title) {
  if (typeof studyMetaInfo.filledAreas === "undefined") return null;

  title = title.toLowerCase();

  for (const filledArea of studyMetaInfo.filledAreas) {
    if (filledArea.title.toLowerCase() === title) return filledArea.id;
  }

  return null;
}

function getBandIndexByName(studyMetaInfo, name) {
  if (typeof studyMetaInfo.bands === "undefined") return null;

  name = name.toLowerCase();

  for (let i = 0; i < studyMetaInfo.bands.length; ++i) {
    if (studyMetaInfo.bands[i].name.toLowerCase() === name) return i;
  }

  return null;
}

function getInputByName(studyMetaInfo, name) {
  if (typeof studyMetaInfo.inputs === "undefined") return null;

  name = name.toLowerCase();

  for (const input of studyMetaInfo.inputs) {
    if (input.name.toLowerCase() === name) return input.id;
  }

  return null;
}

function getStudyDefaults(studyMetaInfo) {
  if (typeof studyMetaInfo.defaults === "undefined") return null;
  return studyMetaInfo.defaults;
}

export { applyOverridesToStudy, applyOverridesToStudyDefaults };
