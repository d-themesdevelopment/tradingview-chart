
const logger = getLogger("Chart.Study.MetaInfo");
const applyOverridesToStudyDefaults = require(19386).applyOverridesToStudyDefaults;
const StudyMetaInfoBase = require(60762).StudyMetaInfoBase;
const defaultOverrides = {};

class StudyMetaInfo extends StudyMetaInfoBase {
  constructor(metaInfo) {
    super();
    TradingView.merge(this, {
      palettes: {},
      inputs: [],
      plots: [],
      graphics: {},
      defaults: {}
    });
    TradingView.merge(this, metaInfo);
    const idString = metaInfo.fullId || metaInfo.id;
    TradingView.merge(this, StudyMetaInfo.parseIdString(idString));
  }

  static versionOf(metaInfo) {
    const version = "_metainfoVersion" in metaInfo && isNumber(metaInfo._metainfoVersion) ? metaInfo._metainfoVersion : 0;
    if (version < 0) {
      logger.logError("Metainfo format version cannot be negative: " + version);
    }
    return version;
  }

  static parseIdString(idString) {
    const parsedId = {};
    if (idString.indexOf("@") === -1) {
      parsedId.shortId = idString;
      parsedId.packageId = "tv-basicstudies";
      parsedId.id = idString + "@" + parsedId.packageId;
      parsedId.version = 1;
    } else {
      const parts = idString.split("@");
      parsedId.shortId = parts[0];
      const packageParts = parts[1].split("-");
      if (packageParts.length === 3) {
        parsedId.packageId = packageParts.slice(0, 2).join("-");
        parsedId.id = parsedId.shortId + "@" + parsedId.packageId;
        parsedId.version = packageParts[2];
      } else if (packageParts.length === 1 && packageParts[0] === "decisionbar") {
        parsedId.packageId = "les-" + packageParts[0];
        parsedId.id = parsedId.shortId + "@" + parsedId.packageId;
        parsedId.version = 1;
      } else {
        if (packageParts.length !== 1) {
          throw new Error("Unexpected study id: " + idString);
        }
        parsedId.packageId = "tv-" + packageParts[0];
        parsedId.id = parsedId.shortId + "@" + parsedId.packageId;
        parsedId.version = 1;
      }
    }
    parsedId.fullId = parsedId.id + "-" + parsedId.version;

    if (parsedId.packageId === "tv-scripting") {
      const shortId = parsedId.shortId;
      if (shortId.indexOf("Script$") === 0 || shortId.indexOf("StrategyScript$") === 0) {
        const index = shortId.indexOf("_");
        parsedId.productId = index >= 0 ? shortId.substring(0, index) : parsedId.packageId;
      } else {
        parsedId.productId = parsedId.packageId;
      }
    } else {
      parsedId.productId = parsedId.packageId;
    }
    return parsedId;
  }

  static getPackageName(idString) {
    return (/^[^@]+@([^-]+-[^-]+)/.exec(idString || "") || [0, "tv-basicstudies"])[1];
  }

  static cutDollarHash(idString) {
    const dollarIndex = idString.indexOf("$");
    const atIndex = idString.indexOf("@");
    if (dollarIndex === -1) {
      return idString;
    }
    return idString.substring(0, dollarIndex) + (atIndex >= 0 ? idString.substring(atIndex) : "");
  }

  static hasUserIdSuffix(idString) {
    return /^USER;[\d\w]+;\d+$/.test(idString);
  }

  static hasPubSuffix(idString) {
    return /^PUB;.+$/.test(idString);
  }

  static hasStdSuffix(idString) {
    return /^STD;.+$/.test(idString);
  }

  static isStandardPine(idString) {
    return /^(Strategy)?Script\$STD;.*@tv-scripting$/.test(idString);
  }

  static getStudyIdWithLatestVersion(metaInfo) {
    const cutId = StudyMetaInfo.cutDollarHash(metaInfo.id);
    let idWithVersion = cutId;
    if (cutId.indexOf("@tv-scripting") >= 0) {
      idWithVersion += "-101!";
    } else if (cutId.endsWith("CP@tv-basicstudies")) {
      idWithVersion += "-" + Math.min(metaInfo.version, 207);
    } else if (cutId.endsWith("CP@tv-chartpatterns")) {
      idWithVersion += "-" + Math.min(metaInfo.version, 9);
    } else {
      idWithVersion += "-" + metaInfo.version;
    }
    return idWithVersion;
  }

  defaultInputs() {
    const defaultValues = [];
    for (let i = 0; i < this.inputs.length; i++) {
      defaultValues.push(this.inputs[i].defval);
    }
    return defaultValues;
  }

  state(includeVersion) {
    const state = {};
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        state[prop] = this[prop];
        if (prop === "id" && includeVersion !== true) {
          state[prop] += "-" + this.version;
        }
      }
    }
    return state;
  }

  symbolInputId() {
    const symbolInput = this.inputs.filter((input) => input.type === "symbol");
    return symbolInput.length > 0 ? symbolInput[0].id : null;
  }

  createDefaults() {
    if (this.defaults) {
      const defaults = TradingView.clone(this.defaults);
      defaults.precision = "default";
      const propertyRootName = StudyMetaInfo.getStudyPropertyRootName(this);
      defaults.create(propertyRootName, defaults);
    }
  }

  removeDefaults() {
    defaults.remove(StudyMetaInfo.getStudyPropertyRootName(this));
  }

  static findStudyMetaInfoByDescription(studiesMetaInfo, description) {
    if (studiesMetaInfo) {
      for (let i = 0; i < studiesMetaInfo.length; ++i) {
        if (studiesMetaInfo[i].description.toLowerCase() === description.toLowerCase()) {
          return studiesMetaInfo[i];
        }
      }
      throw new Error("Unexpected study id: " + description);
    }
    throw new Error("There is no studies metainfo");
  }

  static isParentSourceId(sourceId) {
    return typeof sourceId === "string" && /^[^\$]+\$\d+$/.test(sourceId);
  }

  static overrideDefaults(overrides) {
    if (overrides.length !== 0) {
      applyOverridesToStudyDefaults(defaultOverrides, overrides, (study) => TradingView.defaultProperties[StudyMetaInfo.getStudyPropertyRootName(study)] || null);
    }
  }

  static mergeDefaultsOverrides(overrides) {
    TradingView.merge(defaultOverrides, overrides);
  }

  static isScriptStrategy(metaInfo) {
    return false;
  }

  static getOrderedInputIds(metaInfo) {
    const inputIds = [];
    const inputs = metaInfo.inputs;
    for (let i = 0; i < inputs.length; ++i) {
      const input = inputs[i];
      inputIds.push(input.id);
    }
    return inputIds;
  }
}

StudyMetaInfo.VERSION_STUDY_ARG_SOURCE = 41;
StudyMetaInfo.METAINFO_FORMAT_VERSION_SOS_V2 = 42;
StudyMetaInfo.VERSION_PINE_PROTECT_TV_4164 = 43;
StudyMetaInfo.CURRENT_METAINFO_FORMAT_VERSION = 52;
StudyMetaInfo.VERSION_NEW_STUDY_PRECISION_FORMAT = 46;
StudyMetaInfo.FilledArea = {};
StudyMetaInfo.FilledArea.TYPE_PLOTS = "plot_plot";
StudyMetaInfo.FilledArea.TYPE_HLINES = "hline_hline";

module.exports = StudyMetaInfo;