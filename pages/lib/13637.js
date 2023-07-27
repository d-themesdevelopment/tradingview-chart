"use strict";

var s = require("./58121");
var r = require(99094);
var n = require(16230);
var o = require(98279);
var a = require(38651);
var l = require(50151);
var c = require(56840);
var h = require(22767);
var d = require(45345);
var u = require(26843);
var p = require(59452);
var _ = require.n(p);
var m = require(85804);
var g = require(57898);
var f = require.n(g);

const getLogger = (0, i(59224).getLogger)("ThemedDefaults"); // ! not correct

function extractAllPropertiesKeys(obj) {
  const result = [];
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    const value = obj[key];
    if (o.default(value)) {
      extractAllPropertiesKeys(value).forEach((nestedKey) =>
        result.push(`${key}.${nestedKey}`)
      );
    } else {
      result.push(key);
    }
  });

  return result;
}

function extractState(obj, keys, prefix = "") {
  const state = {};

  keys.forEach((key) => {
    const keyParts = key.split(".");
    const firstPart = keyParts[0];
    const value = obj[firstPart];
    const currentKey = prefix === "" ? firstPart : `${prefix}.${firstPart}`;
    if (obj.hasOwnProperty(firstPart)) {
      if (keyParts.length > 1) {
        if (!o.default(value)) {
          getLogger.logError(
            `path ${currentKey} must be an object, but it is a primitive`
          );
          return;
        }
        const nestedKeys = keys
          .filter((nestedKey) => nestedKey.startsWith(`${firstPart}.`))
          .map((nestedKey) => nestedKey.split(".").slice(1).join("."));
        state[firstPart] = extractState(value, nestedKeys, currentKey);
      } else {
        if (o.default(value)) {
          getLogger.logError(
            `path ${currentKey} must be a primitive, but it is an object`
          );
          return;
        }
        state[firstPart] = value;
      }
    }
  });

  return state;
}

function factoryDefaultsForCurrentTheme(defaults, theme) {
  const currentTheme =
    null !== theme && void 0 !== theme ? theme : u.StdTheme.Light;
  const copiedDefaults = h.deepCopy(defaults);
  return (
    (0, s.default)(copiedDefaults, (0, l.ensureDefined)(c.get(currentTheme))),
    copiedDefaults
  );
}

function mergeDefaults(current, incoming) {
  const merged = (0, r.default)(
    current,
    (e, currentVal, key) => {
      if (void 0 === incoming[key]) {
        return currentVal;
      }
      if (!n.default(currentVal, incoming[key])) {
        if (o.default(currentVal) && o.default(incoming[key])) {
          const mergedValue = mergeDefaults(currentVal, incoming[key]);
          if (void 0 !== mergedValue) {
            e[key] = mergedValue;
          }
        } else {
          e[key] = currentVal;
        }
      }
      return e;
    },
    {}
  );
  return (0, a.default)(merged) ? void 0 : merged;
}

class ThemedDefaultProperty extends _() {
  constructor(
    name,
    defaultsSupplier,
    notThemedDefaultsKeys,
    themedDefaultsKeys,
    allStateKeys,
    allDefaultsKeys
  ) {
    super(
      (function (name, defaultsSupplier, allStateKeys, allDefaultsKeys) {
        const defaults = defaultsSupplier();
        const currentState = extractState(
          h.deepCopy(null !== defaults ? defaults : {}),
          allStateKeys
        );
        const merged = (0, s.default)(
          currentState,
          extractState(null != defaults ? defaults : {}, allStateKeys)
        );
        (0, s.default)(
          merged,
          extractState(null != defaults ? defaults : {}, allDefaultsKeys)
        );
        return merged;
      })(name, defaultsSupplier, allStateKeys, allDefaultsKeys)
    );
    this._applyingThemeInProcess = false;
    this._restoreFactoryDefaultsEvent = new (f())();
    this._defaultName = name;
    this._defaultsSupplier = defaultsSupplier;
    this._notThemedDefaultsKeys = notThemedDefaultsKeys;
    this._themedDefaultsKeys = themedDefaultsKeys;
    this._allStateKeys = allStateKeys;
    this._allDefaultsKeys = [...notThemedDefaultsKeys, ...themedDefaultsKeys];
  }

  restoreFactoryDefaults() {
    const defaults = this._defaultsSupplier();
    this.mergeAndFire(defaults);
    this.saveDefaults();
    this._restoreFactoryDefaultsEvent.fire();
  }

  addExclusion() {}

  state() {
    return extractState(super.state(), this._allStateKeys);
  }

  mergePreferences(preferences) {
    this.mergeAndFire(extractState(preferences, this._allStateKeys));
  }

  childChanged(child) {
    super.childChanged(child);
    if (!this._applyingThemeInProcess) {
      this.saveDefaults();
    }
  }

  saveDefaults() {
    const currentState = this.state();
    const defaults = this._defaultsSupplier();
    let nonThemedDefaults = mergeDefaults(
      extractState(currentState, this._notThemedDefaultsKeys),
      extractState(defaults, this._notThemedDefaultsKeys)
    );
    const themedDefaults = extractState(defaults, this._themedDefaultsKeys);
    const themedState = extractState(currentState, this._themedDefaultsKeys);
    const mergedState = mergeDefaults(themedState, themedDefaults);
    if (!(0, a.default)(mergedState)) {
      nonThemedDefaults = null != nonThemedDefaults ? nonThemedDefaults : {};
      (0, s.default)(nonThemedDefaults, themedState);
    }
    (0, m.saveDefaults)(this._defaultName, nonThemedDefaults);
  }
}

export {
  ThemedDefaultProperty,
  extractAllPropertiesKeys,
  extractState,
  factoryDefaultsForCurrentTheme,
};
