import { getValue, setValue } from "value-module"; // !
import { t } from "translation-module"; // !
import { getHexColorByName } from "./48891";
import { watchedTheme, setTheme } from "./45345";
import { applyDefaultsOverrides } from "defaults-module"; // ! not correct

import {
  StdTheme,
  getStdChartTheme,
  getStdThemeNames,
  isStdTheme,
} from "./26843";

import {
  loadTheme,
  loadThemes,
  saveTheme,
  removeTheme,
  isThemeExist,
} from "theme-functions-module"; // ! not correct

function getCurrentThemeName() {
  return getValue("current_theme.name") || null;
}

const DEFAULT_THEME = "light";

const themes = {
  [StdTheme.Light]: {
    name: StdTheme.Light,
    label: () => t(null, { context: "colorThemeName" }, "Light"),
    order: 2,
    getThemedColor: (color) => getHexColorByName(color),
  },

  [StdTheme.Dark]: {
    name: StdTheme.Dark,
    label: () => t(null, { context: "colorThemeName" }, "Dark"),
    order: 1,
    getThemedColor: (color) => {
      const themedColor = u[color] || color;
      return getHexColorByName(themedColor);
    },
  },
};

function isPublicTheme(theme) {
  return !theme.isPrivate;
}

function getCurrentTheme() {
  return themes[watchedTheme.value()] || themes[DEFAULT_THEME];
}

function getThemedColor(color) {
  return getCurrentTheme().getThemedColor(color);
}

async function loadThemeWithOptions(chartModel, options) {
  const {
    themeName,
    standardTheme,
    syncState = true,
    noUndo = false,
    applyOverrides = false,
    onlyActiveChart = false,
  } = options;

  const theme = await (standardTheme
    ? Promise.resolve(getStdChartTheme(themeName))
    : loadTheme(themeName));
  const restoreNonThemeDefaults = !standardTheme || onlyActiveChart;

  if (typeof theme.content !== "undefined") {
    const applyOverridesToChartProperties = !standardTheme || onlyActiveChart;
    const applyOverridesToMainSourceProperties =
      applyOverrides &&
      typeof theme.content.mainSourceProperties !== "undefined";

    if (applyOverridesToChartProperties) {
      applyDefaultsOverrides(
        chartModel.properties().childs().paneProperties.state()
      );
      applyDefaultsOverrides(
        chartModel.properties().childs().scalesProperties.state()
      );
    }

    if (applyOverridesToMainSourceProperties) {
      applyDefaultsOverrides(
        chartModel.mainSeries().properties().state(),
        undefined,
        true,
        "mainSeriesProperties"
      );
    }

    await chartModel.applyTheme({
      theme: theme.content,
      onlyActiveChart,
      restoreNonThemeDefaults,
      themeName,
      standardTheme,
      syncState,
      noUndo,
    });
  }

  return theme;
}

function restoreTheme() {
  setTheme(getCurrentThemeName() || DEFAULT_THEME);
}

function savedThemeName() {
  return getCurrentThemeName();
}

function syncTheme() {
  const currentThemeName = getCurrentTheme().name;
  setValue("current_theme.name", currentThemeName, { forceFlush: true });
}

function getTheme(themeName) {
  return loadTheme(themeName);
}

function getThemeNames() {
  return loadThemes();
}

function getStdThemeNames() {
  return getStdThemeNames();
}

function isStdThemeName(themeName) {
  return getStdThemeNames().includes(themeName);
}

function getStdTheme(themeName) {
  return getStdChartTheme(themeName) || { content: undefined };
}

function getStdThemedValue(path, color, themeName) {
  const stdTheme = getStdChartTheme(themeName);
  const propertyPath = path.split(".");

  if (stdTheme && stdTheme.content && propertyPath) {
    return propertyPath.reduce((acc, key) => acc[key], stdTheme.content);
  }

  return null;
}

function isStdThemedDefaultValue(path, color, themeName) {
  const themedColor = getStdThemedValue(path, themeName);
  return (
    themedColor !== null &&
    areEqualRgba(parseRgba(themedColor), parseRgba(String(color)))
  );
}

function saveThemeWithOptions(theme, options) {
  return saveTheme(theme, options);
}

function removeThemeByName(themeName) {
  return removeTheme(themeName);
}

function isThemeExistByName(themeName) {
  return isThemeExist(themeName);
}

export {
  DEFAULT_THEME,
  extractThemeFromModel,
  getCurrentTheme,
  getStdTheme,
  getStdThemeNames,
  getStdThemedValue,
  getTheme,
  getThemeNames,
  getThemedColor,
  isPublicTheme,
  isStdTheme,
  isStdThemeName,
  isStdThemedDefaultValue,
  isThemeExist,
  loadTheme,
  removeTheme,
  restoreTheme,
  saveTheme,
  savedThemeName,
  syncTheme,
  themes,
  translateStdThemeName,
};
