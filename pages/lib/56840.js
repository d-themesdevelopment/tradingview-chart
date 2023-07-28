// import { nmd } from "some-module";
// import "some-other-module";
// import { fetch } from "fetch-module";
// import { regExpEscape } from "regexp-module";
import { TVXWindowEvents } from "window-events-module"; // ! not correct
import { TVLocalStorage } from "./TVLocalStorage";
import { enabled } from "./helpers";
import { onWidget, IS_DEMO_PAGE } from "parent-module"; // ! not correct

const allowedDomains = ["s.tradingview.com", "betacdn.tradingview.com"];
const useLocalStorage = enabled("use_localstorage_for_settings");

const TVSettings = function () {
  let isWidget = false;
  let storage = null;

  function isLocalStorageEnabled() {
    return !storage && useLocalStorage;
  }

  try {
    isWidget =
      !onWidget() && parent && parent !== window && !!parent.IS_DEMO_PAGE;
  } catch (error) {}

  if (isWidget) {
    const defaultSettings = {
      "widgetbar.layout-settings": {
        widgets: {},
        settings: {
          minimized: true,
        },
      },
      notShowMainWizard: true,
    };

    const getValue = (key, defaultValue) => {
      const value = defaultSettings[key];
      return value === undefined ? defaultValue : value;
    };

    const getJSON = getValue;
    const getBool = getValue;
    const getFloat = getValue;
    const getInt = getValue;
    const setValue = () => {};
    const setJSON = () => {};
    const remove = () => {};
    const keys = () => Object.keys(defaultSettings);
    const keysMask = () => [];
    const sync = () => {};
    const onSync = {
      subscribe: () => {},
    };

    return {
      loaded: false,
      loadedModel: false,
      getValue,
      getJSON,
      getBool,
      getFloat,
      getInt,
      setValue,
      setJSON,
      remove,
      keys,
      keysMask,
      sync,
      onSync,
    };
  }

  window.environment;

  const prefix = onWidget() ? "tradingview-widget" : "tradingview";
  const domainPrefix = `${prefix}.`;
  const settings = {};

  const getValue = (key, defaultValue) => {
    const value = settings[key];
    return value === undefined ? defaultValue : value;
  };

  const getJSON = (key, defaultValue) => {
    const value = getValue(key);
    if (value === undefined) return defaultValue;
    try {
      return JSON.parse(value);
    } catch (error) {
      remove(key);
      return defaultValue;
    }
  };

  const getBool = (key, defaultValue) => {
    const value = getValue(key);
    return value === null
      ? defaultValue
      : !!(value && value !== "false" && +value !== 0);
  };

  const getFloat = (key, defaultValue) => {
    const value = getValue(key);
    if (value === undefined) return defaultValue;
    const parsedValue = parseFloat(value);
    if (!isFinite(parsedValue)) {
      throw new TypeError(`"${value}" is not a float (key: "${key}")`);
    }
    return parsedValue;
  };

  const getInt = (key, defaultValue) => {
    const value = getValue(key);
    if (value === undefined) return defaultValue;
    const parsedValue = parseInt(value, 10);
    if (!isFinite(parsedValue)) {
      throw new TypeError(`"${value}" is not an int (key: "${key}")`);
    }
    return parsedValue;
  };

  const setValue = (key, value, options = {}) => {
    const stringValue = `${value}`;
    if (settings[key] !== stringValue) {
      settings[key] = stringValue;
      saveToStorage(key);
    }
    if (options.forceFlush && !flushTimeout) {
      flushTimeout = setTimeout(() => {
        flushTimeout = undefined;
        flushStorage();
      }, 10);
    }
    return TVSettings;
  };

  const setJSON = (key, value, options = {}) => {
    return setValue(key, JSON.stringify(value), options);
  };

  const remove = (key, options = {}) => {
    delete settings[key];
    saveToStorage(key);
    if (options.forceFlush) flushStorage();
    return TVSettings;
  };

  const saveToStorage = (key) => {
    if (storage) {
      settings[key]
        ? storage.setValue(key, settings[key])
        : storage.removeValue(key);
    } else if (isLocalStorageEnabled()) {
      try {
        settings[key]
          ? TVLocalStorage.setItem(`${domainPrefix}${key}`, settings[key])
          : TVLocalStorage.removeItem(`${domainPrefix}${key}`);
      } catch (error) {}
    }
  };

  const flushStorage = () => {
    if (storage) {
      for (const key of Object.keys(settings)) {
        settings[key]
          ? storage.setValue(key, settings[key])
          : storage.removeValue(key);
      }
    } else if (isLocalStorageEnabled()) {
      for (let i = TVLocalStorage.length; i--; ) {
        const key = TVLocalStorage.key(i);
        if (key && isKeyFromDomain(key)) {
          const newKey = key.replace(domainPrefix, prefix + ".");
          TVLocalStorage.setItem(newKey, TVLocalStorage.getItem(key));
          TVLocalStorage.removeItem(key);
        }
      }
    } else {
      // Do nothing
    }
    emitSettingsEvent();
  };

  // const emitSettingsEvent = (key) => {
  //   TVXWindowEvents.emit("settings", JSON.stringify({
  //     key,
  //     value: settings[key]
  //   }));
  // };

  const onSettingsEvent = (event) => {
    const { key, value } = JSON.parse(event);
    if (value === null) {
      delete settings[key];
    } else {
      settings[key] = value;
    }
  };

  const storageEventCallback = (event) => {
    if (event.key && isKeyFromDomain(event.key)) {
      const key = getKeyFromStorageKey(event.key);
      if (key && !isKeyBlacklisted(key)) {
        const value = event.newValue !== null ? event.newValue : undefined;
        settings[key] = value;
        emitSettingsEvent(key);
      }
    }
  };

  const isKeyFromDomain = (key) => {
    return key.startsWith(domainPrefix);
  };

  const getKeyFromStorageKey = (storageKey) => {
    return storageKey.substring(domainPrefix.length);
  };

  const isKeyBlacklisted = (key) => {
    for (const regex of blacklistedKeysRegex) {
      if (regex.exec(key)) {
        return true;
      }
    }
    return false;
  };

  const getSettingsKeys = () => Object.keys(settings);

  const matchesKeyMask = (key, mask) => {
    for (let i = 0; i < mask.length; i++) {
      if (mask[i].test(key)) {
        return true;
      }
      mask[i].lastIndex = 0;
    }
    return false;
  };

  const syncSettings = (initialSettings) => {
    if (initialSettings !== null) {
      if (storage) {
        applyInitialSettings(initialSettings || {});
      } else if (isLocalStorageEnabled()) {
        migrateLocalStorage();
        if (initialSettings) {
          applyInitialSettings(initialSettings);
        } else {
          syncFromLocalStorage();
        }
      } else {
        // Do nothing
      }
    }
  };

  const applyInitialSettings = (initialSettings) => {
    if (Object.keys(initialSettings).length === 0) {
      resetSettings();
    } else {
      settings = { ...initialSettings };
      syncToStorage();
    }
    TVXWindowEvents.fire();
  };

  const resetSettings = () => {
    settings = {};
    if (storage) {
      storage.reset();
    } else if (isLocalStorageEnabled()) {
      clearLocalStorage();
    } else {
      // Do nothing
    }
  };

  const syncToStorage = () => {
    if (storage) {
      for (const key of Object.keys(settings)) {
        settings[key]
          ? storage.setValue(key, settings[key])
          : storage.removeValue(key);
      }
    } else if (isLocalStorageEnabled()) {
      for (let i = 0; i < TVLocalStorage.length; i++) {
        const key = TVLocalStorage.key(i);
        if (key && isKeyFromDomain(key)) {
          const newKey = key.replace(domainPrefix, prefix + ".");
          TVLocalStorage.setItem(newKey, TVLocalStorage.getItem(key));
          TVLocalStorage.removeItem(key);
        }
      }
      syncFromLocalStorage();
    } else {
      // Do nothing
    }
  };

  const clearLocalStorage = () => {
    for (let i = TVLocalStorage.length; i--; ) {
      const key = TVLocalStorage.key(i);
      if (key && isKeyFromDomain(key)) {
        TVLocalStorage.removeItem(key);
      }
    }
  };

  const syncFromLocalStorage = () => {
    settings = {};
    for (let i = TVLocalStorage.length; i--; ) {
      const key = TVLocalStorage.key(i);
      if (key && isKeyFromDomain(key)) {
        const newKey = getKeyFromStorageKey(key);
        if (!isKeyBlacklisted(newKey)) {
          settings[newKey] = TVLocalStorage.getItem(key);
        }
      }
    }
  };

  const resetStorage = () => {
    settings = {};
    if (storage) {
      storage.reset();
    } else if (isLocalStorageEnabled()) {
      clearLocalStorage();
    } else {
      // Do nothing
    }
    emitSettingsEvent();
  };

  const blacklistedKeysRegex = [
    /^widgetbar\.widget\.watchlist.+/,
    /.+quicks$/,
    /^widgetbar\.layout-settings$/,
    /^ChartSideToolbarWidget\.visible$/,
    /^onwidget\.watchlist$/,
    /^chart\.favoriteDrawings$/,
    /^chart\.favoriteDrawingsPosition$/,
    /^chart\.favoriteLibraryIndicators$/,
    /^loadChartDialog.favorites$/,
    /^ChartFavoriteDrawingToolbarWidget\.visible/,
    /^trading\.chart\.proterty$/,
    /^trading_floating_toolbar\.position$/,
    /^trading\.orderWidgetMode\./,
    /^symbolWatermark$/,
    /^pinereference\.size$/,
    /^pinereference\.position$/,
    /^hint\.+/,
    /^ChartDrawingToolbarWidget\.visible/,
  ];

  let flushTimeout = undefined;

  const emitSettingsEvent = (key) => {
    TVXWindowEvents.emit(
      "settings",
      JSON.stringify({
        key,
        value: settings[key],
      })
    );
  };

  TVXWindowEvents.on("settings", onSettingsEvent);

  if (isWidget) {
    return {
      loaded: false,
      loadedModel: false,
      getValue,
      getJSON,
      getBool,
      getFloat,
      getInt,
      setValue,
      setJSON,
      remove,
      keys: getSettingsKeys,
      keysMask,
      sync: syncSettings,
      onSync,
    };
  }

  const L = new o();

  return {
    loaded: false,
    loadedModel: false,
    getValue,
    getJSON,
    getBool,
    getFloat,
    getInt,
    setValue,
    setJSON,
    remove,
    keys: getSettingsKeys,
    keysMask,
    sync: syncSettings,
    onSync: L,
    setSettingsAdapter: (adapter) => {
      storage = adapter;
    },
  };
};

if (e && e.exports) {
  e.exports = TVSettings;
}
