

import { default as getDefault } from '<path_to_default_module>';

function getStudyStylesInfo(info) {
  const stylesInfo = {};
  if (info.defaults) {
    const defaults = getDefault(info.defaults);
    stylesInfo.defaults = defaults;
  }
  if (info.plots !== undefined) {
    stylesInfo.plots = getDefault(info.plots);
  }
  if (info.styles !== undefined) {
    stylesInfo.styles = getDefault(info.styles);
  }
  if (info.bands !== undefined) {
    stylesInfo.bands = getDefault(info.bands);
  }
  if (info.filledAreas !== undefined) {
    stylesInfo.filledAreas = getDefault(info.filledAreas);
  }
  if (info.palettes !== undefined) {
    stylesInfo.palettes = getDefault(info.palettes);
  }
  return stylesInfo;
}

export { getStudyStylesInfo };