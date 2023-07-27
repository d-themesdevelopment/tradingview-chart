import { getLogger } from "utils/logger";

import {
  Version,
  TradingView,
  extractPineId,
  migrateMetaInfoAndPropState,
} from "utils/helpers";

import { assert, ensureNotNull } from "utils/assertions";
import {
  StudyMetaInfo,
  VersionedStudyMigration,
  MetaInfoFormatVersion,
  VERSION_NEW_STUDY_PRECISION_FORMAT,
  VERSION_PINE_PROTECT_TV_4164,
  METAINFO_FORMAT_VERSION_SOS_V2,
} from "charting_library/charting_library.min";

import {
  splitInputs,
  mergeInputsArrPart,
  mergeInputsObjPart,
  appendInputInfoToArr,
  findInputKeyById,
  getInputKeyById,
} from "utils/inputUtils";

const logger = getLogger("Chart.Study.Versioning");

class StudyVersioning {
  constructor(studiesMetaInfo, studiesMigrations) {
    if (!studiesMetaInfo) throw new Error("No studies metainfo");
    if (!studiesMigrations) throw new Error("No studies migrations");

    this._studiesMetainfo = studiesMetaInfo;
    this._studiesMigrations = studiesMigrations;

    this._migrations = {};

    for (let i = 0; i < this._studiesMigrations.length; i++) {
      const migration = this._studiesMigrations[i];
      const versionFrom = migration.versFrom;
      const versionTo = migration.versTo;

      for (let j = 0; j < migration.studyMigrations.length; j++) {
        const studyMigration = migration.studyMigrations[j];
        const studyId = studyMigration.studyId;

        if (studyMigration.rules.length === 0) {
          logger.logError(
            "Study Migration should have at least one conversion rule"
          );
          continue;
        }

        const migrationObject =
          studyId in this._migrations
            ? this._migrations[studyId]
            : new Version(studyId);
        migrationObject.addMigration(
          versionFrom,
          versionTo,
          studyMigration.rules
        );
        this._migrations[studyId] = migrationObject;
      }
    }

    this._clientMigrations = [
      (study, inputs) => {
        if (
          this._studiesMetainfo.length === 0 ||
          !study.isTVScript ||
          study.version >= 22
        ) {
          return inputs;
        }

        const migratedInputs = {};
        let newIndex = 0;
        let oldIndex = 0;
        let input = inputs[oldIndex];

        while (input !== undefined) {
          const migratedInput = inputs[input.id];
          if (input.isFake) {
            input.id = "in_" + newIndex++;
          }
          migratedInputs[oldIndex] = input;
          migratedInputs[input.id] = migratedInput;
          oldIndex++;
          input = inputs[oldIndex];
        }

        return migratedInputs;
      },
    ];
  }

  updateMetaInfo(studyMetaInfo) {
    if (!studyMetaInfo) return studyMetaInfo;
    assert(
      !studyMetaInfo.isTVScript,
      "This method should update only built-in java indicators metaInfo. For Pine indicators use updateMetaInfoAsync"
    );

    for (let i = 0; i < this._studiesMetainfo.length; i++) {
      if (this._studiesMetainfo[i].id === studyMetaInfo.id) {
        return TradingView.clone(this._studiesMetainfo[i]);
      }
    }

    return null;
  }

  updateMetaInfoAsync(studyMetaInfo) {
    if (!studyMetaInfo) {
      return {
        sync: false,
        result: Promise.reject("No old metaInfo was given"),
      };
    }

    new StudyMetaInfo(studyMetaInfo);
    MetaInfoFormatVersion.versionOf(studyMetaInfo);

    for (let i = 0; i < this._studiesMetainfo.length; i++) {
      if (this._studiesMetainfo[i].id === studyMetaInfo.id) {
        return {
          sync: true,
          result: TradingView.clone(this._studiesMetainfo[i]),
        };
      }
    }

    return {
      sync: true,
      result: null,
    };
  }

  lastVersionOfStudy(studyId) {
    return this._studiesMetainfo.find((metaInfo) => metaInfo.id === studyId)
      .version;
  }

  updateStudyInputs(studyId, fromVersion, toVersion, inputs, defaults) {
    let updatedInputs = TradingView.clone(inputs);

    if (studyId in this._migrations) {
      const currentVersion = Version.parse(fromVersion);
      let targetVersion;
      if (toVersion === "last") {
        const lastVersion = this.lastVersionOfStudy(studyId);
        targetVersion = Version.parse(lastVersion);
      } else {
        targetVersion = Version.parse(toVersion);
      }
      updatedInputs = this._migrations[studyId].updateInputs(
        currentVersion,
        targetVersion,
        updatedInputs
      );
    }

    if (defaults === null) {
      return updatedInputs;
    }

    for (const key in defaults) {
      if (!(key in updatedInputs)) {
        updatedInputs[key] = defaults[key];
      }
    }

    for (const key in updatedInputs) {
      if (!(key in defaults)) {
        const inputValue = updatedInputs[key];
        logger.logWarn(
          `Extra input detected, studyId=${studyId}, versionFrom=${fromVersion}, inputId=${key}, inputValue=${inputValue}, removing it and continue...`
        );
        delete updatedInputs[key];
      }
    }

    return updatedInputs;
  }

  updateStudyState(state, studyMetaInfo, newState) {
    if (state === null || studyMetaInfo === null || newState === null) {
      return state;
    }

    state = TradingView.clone(state);

    if (
      !studyMetaInfo.isTVScript &&
      studyMetaInfo.version !== newState.version
    ) {
      const defaultInputs = newState.defaults.inputs;
      const updatedInputs = this.updateStudyInputs(
        studyMetaInfo.id,
        studyMetaInfo.version,
        newState.version,
        state.inputs,
        defaultInputs
      );
      state.inputs = updatedInputs;
    }

    for (let i = 0; i < this._clientMigrations.length; ++i) {
      const migratedInputs = this._clientMigrations[i].call(
        this,
        studyMetaInfo,
        state.inputs
      );
      if (
        Object.keys(migratedInputs).length === Object.keys(state.inputs).length
      ) {
        state.inputs = migratedInputs;
      } else {
        logger.logWarn(
          "StudyVersioning._clientMigrations application returned bad result. Skipping it..."
        );
      }
    }

    const metaInfoVersion = StudyMetaInfo.versionOf(studyMetaInfo);
    if (
      studyMetaInfo.isTVScript &&
      studyMetaInfo.TVScriptSourceCode &&
      metaInfoVersion >= 12 &&
      metaInfoVersion <= 26
    ) {
      const styles = state.styles;
      state.styles = {};
      for (let i = 0; i < styles.length; ++i) {
        const id = "plot_" + i;
        state.styles[id] = styles[i];
      }
    }

    return state;
  }

  patchPointsBasedStudyState(state) {
    p._fixInputsMaxValue(state, state.metaInfo);
    return state;
  }

  patchPointsBasedStudyData(metaInfo, data) {
    if (!TradingView.isProd()) {
      return data;
    }
    if (!metaInfo || !data) {
      return data;
    }

    const patchedData = TradingView.clone(data);
    if (
      metaInfo.id === "VbPFixed@tv-volumebyprice" &&
      metaInfo.version &&
      metaInfo.version <= 4
    ) {
      p._patchOldVolumeProfiles(0, patchedData);
    }

    return patchedData;
  }

  patchStudyData(metaInfo, data, nsData, indexes) {
    if (!TradingView.isProd()) {
      return { data, nsData, indexes };
    }

    const patchedData = TradingView.clone(data);
    const patchedNsData = TradingView.clone(nsData);
    const patchedIndexes = TradingView.clone(indexes);

    if (
      metaInfo.id === "VbPVisible@tv-volumebyprice" &&
      metaInfo.version &&
      metaInfo.version <= 4
    ) {
      p._patchOldVolumeProfiles(0, patchedData.graphics);
    }

    if (
      metaInfo.id === "VbPSessions@tv-volumebyprice" &&
      metaInfo.version &&
      metaInfo.version <= 4
    ) {
      p._patchOldVolumeProfiles(0, patchedData.graphics);
    }

    const metaInfoVersion = StudyMetaInfo.versionOf(metaInfo);
    if (
      metaInfo.isTVScript &&
      metaInfo.TVScriptSourceCode &&
      metaInfoVersion >= 12 &&
      metaInfoVersion <= 26
    ) {
      const columns = patchedData.columns;
      patchedData.columns = [];
      for (let i = 0; i < columns.length; ++i) {
        const newId = "plot_" + i;
        patchedData.columns.push(newId);
      }
    }

    return {
      data: patchedData,
      nsData: patchedNsData,
      indexes: patchedIndexes,
    };
  }

  patchPropsStateAndMetaInfo(propsState, metaInfo, patchInfo) {
    if (metaInfo.productId !== "Script$BOOKER" || !patchInfo.alerts) {
      delete propsState.alerts;
    }

    p._fixInputsOrder(propsState, metaInfo);
    p._fixInputsMaxValue(propsState, metaInfo);

    const inputs = splitInputs(propsState.inputs);
    propsState.inputs = inputs.obj;

    const metaInfoVersion = StudyMetaInfo.versionOf(metaInfo);

    if (metaInfo.isTVScript && metaInfo.version < 60) {
      const earningsId = "Script$TV_EARNINGS@tv-scripting";
      const splitsId = "Script$TV_SPLITS@tv-scripting";
      const dividendsId = "Script$TV_DIVIDENDS@tv-scripting";

      if (metaInfo.id.startsWith("Script$" + earningsId)) {
        const earningsMetaInfo = {
          fullId: "ESD" + metaInfo.fullId.substring("Script$".length),
          id: "ESD" + metaInfo.id.substring("Script$".length),
          name: "ESD" + metaInfo.name.substring("Script$".length),
          shortId: "ESD" + metaInfo.shortId.substring("Script$".length),
          productId: "ESD" + metaInfo.productId.substring("Script$".length),
        };
        TradingView.merge(metaInfo, earningsMetaInfo);
        TradingView.merge(propsState, earningsMetaInfo);
      } else if (metaInfo.id.startsWith("Script$" + splitsId)) {
        const splitsMetaInfo = {
          fullId: "ESD" + metaInfo.fullId.substring("Script$".length),
          id: "ESD" + metaInfo.id.substring("Script$".length),
          name: "ESD" + metaInfo.name.substring("Script$".length),
          shortId: "ESD" + metaInfo.shortId.substring("Script$".length),
          productId: "ESD" + metaInfo.productId.substring("Script$".length),
        };
        TradingView.merge(metaInfo, splitsMetaInfo);
        TradingView.merge(propsState, splitsMetaInfo);
      } else if (metaInfo.id.startsWith("Script$" + dividendsId)) {
        const dividendsMetaInfo = {
          fullId: "ESD" + metaInfo.fullId.substring("Script$".length),
          id: "ESD" + metaInfo.id.substring("Script$".length),
          name: "ESD" + metaInfo.name.substring("Script$".length),
          shortId: "ESD" + metaInfo.shortId.substring("Script$".length),
          productId: "ESD" + metaInfo.productId.substring("Script$".length),
        };
        TradingView.merge(metaInfo, dividendsMetaInfo);
        TradingView.merge(propsState, dividendsMetaInfo);
      }
    }

    if (
      metaInfo.id in
      {
        "ESD$TV_EARNINGS@tv-scripting": true,
        "ESD$TV_SPLITS@tv-scripting": true,
        "ESD$TV_DIVIDENDS@tv-scripting": true,
      }
    ) {
      const pineId = metaInfo.shortId.slice(metaInfo.shortId.indexOf("$") + 1);
      const className = metaInfo.shortId.slice(
        0,
        metaInfo.shortId.indexOf("$")
      );
      const newShortId = className + "$" + pineId;

      const newIds = {
        scriptIdPart: pineId,
        fullId: metaInfo.fullId.replace(metaInfo.shortId, newShortId),
        id: metaInfo.id.replace(metaInfo.shortId, newShortId),
        name: metaInfo.name.replace(metaInfo.shortId, newShortId),
        shortId: newShortId,
      };

      TradingView.merge(metaInfo, newIds);
      TradingView.merge(propsState, newIds);
    }

    if (
      metaInfoVersion < METAINFO_FORMAT_VERSION_SOS_V2 &&
      metaInfo.isChildStudy
    ) {
      propsState.isChildStudy = metaInfo.isChildStudy;
    }

    if (metaInfo.isTVScript && metaInfo.version < 60) {
      if (
        [
          "Script$TV_EARNINGS@tv-scripting",
          "Script$TV_DIVIDENDS@tv-scripting",
          "Script$TV_SPLITS@tv-scripting",
        ].indexOf(metaInfo.id) !== -1
      ) {
        delete metaInfo.TVScriptSourceCode;
      }
    }

    if (metaInfo.id === "Volume" || metaInfo.id === "Volume@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 1000,
          },
        ];
        metaInfo.plots.push({
          id: "vol_ma",
          type: "line",
        });
      }
    }

    if (
      metaInfo.id === "Volume@tv-basicstudies" &&
      metaInfo.version &&
      metaInfo.version <= 46
    ) {
      if (propsState.styles.vol.transparency === undefined) {
        propsState.styles.vol.transparency = propsState.transparency || 87;
      }
    }

    if (metaInfo.id === "PivotPointsStandard@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "kind",
            type: "text",
            defval: "Traditional",
            options: [
              "Traditional",
              "Fibonacci",
              "Woodie",
              "Classic",
              "DeMark",
              "Camarilla",
            ],
          },
          {
            id: "showHistoricalPivots",
            type: "bool",
            defval: true,
          },
        ];
      } else if (metaInfo.inputs.length === 1) {
        metaInfo.inputs.push({
          id: "showHistoricalPivots",
          type: "bool",
          defval: true,
        });
      }

      if (propsState._hardCodedDefaultsVersion === undefined) {
        propsState._hardCodedDefaultsVersion = 1;
        const color = propsState.color;
        delete propsState.color;
        propsState.levelsStyle = {
          colors: {
            P: color,
            "S1/R1": color,
            "S2/R2": color,
            "S3/R3": color,
            "S4/R4": color,
            "S5/R5": color,
          },
        };
      }
    }

    if (metaInfo.id === "CMF" && metaInfo.inputs.length === 2) {
      metaInfo.inputs.push({
        id: "overboughtLevel",
        type: "integer",
        defval: 0,
        min: -100,
        max: 100,
      });
      metaInfo.inputs.push({
        id: "oversoldLevel",
        type: "integer",
        defval: 0,
        min: -100,
        max: 100,
      });
    }

    if (metaInfo.id === "DPO@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "DPO",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "MACD@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "short",
            type: "integer",
            defval: 12,
            min: 1,
            max: 100000,
          },
          {
            id: "long",
            type: "integer",
            defval: 26,
            min: 1,
            max: 100000,
          },
          {
            id: "signal",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "histogram",
          type: "histogram",
        });
        metaInfo.plots.push({
          id: "macd",
          type: "line",
        });
        metaInfo.plots.push({
          id: "signal",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "PZO@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "pzo",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ROC@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 12,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "roc",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "RSI@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "rsi",
          type: "line",
        });
        metaInfo.plots.push({
          id: "50",
          type: "line",
        });
        metaInfo.plots.push({
          id: "30",
          type: "line",
        });
        metaInfo.plots.push({
          id: "70",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "SMMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 10,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "SMMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "SMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "SMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "TSI@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "short",
            type: "integer",
            defval: 13,
            min: 1,
            max: 100000,
          },
          {
            id: "long",
            type: "integer",
            defval: 25,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "TSI",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "WMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "WMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ZLEMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ZLEMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ChandeMO@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ChandeMO",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ADX@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ADX",
          type: "line",
        });
        metaInfo.plots.push({
          id: "DIp",
          type: "line",
        });
        metaInfo.plots.push({
          id: "DIn",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "EMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "EMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "UltOsc@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length1",
            type: "integer",
            defval: 7,
            min: 1,
            max: 100000,
          },
          {
            id: "length2",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
          {
            id: "length3",
            type: "integer",
            defval: 28,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ultOsc",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "BollingerBandsR@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
          {
            id: "stdDev",
            type: "integer",
            defval: 2,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "BBp",
          type: "line",
        });
        metaInfo.plots.push({
          id: "BBb",
          type: "line",
        });
        metaInfo.plots.push({
          id: "BBb_top",
          type: "line",
        });
        metaInfo.plots.push({
          id: "BBb_bot",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "Momentum@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "momentum",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "WilliamsR@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "WilliamsR",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "CCI@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "CCI",
          type: "line",
        });
        metaInfo.plots.push({
          id: "100",
          type: "line",
        });
        metaInfo.plots.push({
          id: "-100",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ATR@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ATR",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "Fractals@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "leftBarsCount",
            type: "integer",
            defval: 2,
            min: 1,
            max: 100000,
          },
          {
            id: "rightBarsCount",
            type: "integer",
            defval: 2,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "FractalsUp",
          type: "arrow_up",
        });
        metaInfo.plots.push({
          id: "FractalsDown",
          type: "arrow_down",
        });
      }
    }

    if (metaInfo.id === "StochasticRSI@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
          {
            id: "smoothK",
            type: "integer",
            defval: 3,
            min: 1,
            max: 100000,
          },
          {
            id: "smoothD",
            type: "integer",
            defval: 3,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "StochasticRSI",
          type: "line",
        });
        metaInfo.plots.push({
          id: "50",
          type: "line",
        });
        metaInfo.plots.push({
          id: "20",
          type: "line",
        });
        metaInfo.plots.push({
          id: "80",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "Aroon@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "AroonUp",
          type: "line",
        });
        meta;

        Info.plots.push({
          id: "AroonDown",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "KDJ@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
          {
            id: "smoothK",
            type: "integer",
            defval: 3,
            min: 1,
            max: 100000,
          },
          {
            id: "smoothD",
            type: "integer",
            defval: 3,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "KDJ_K",
          type: "line",
        });
        metaInfo.plots.push({
          id: "KDJ_D",
          type: "line",
        });
        metaInfo.plots.push({
          id: "KDJ_J",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "IchimokuCloud@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "conversionLinePeriod",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
          {
            id: "baseLinePeriod",
            type: "integer",
            defval: 26,
            min: 1,
            max: 100000,
          },
          {
            id: "laggingSpan2Period",
            type: "integer",
            defval: 52,
            min: 1,
            max: 100000,
          },
          {
            id: "displacement",
            type: "integer",
            defval: 26,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "TenkanSen",
          type: "line",
        });
        metaInfo.plots.push({
          id: "KijunSen",
          type: "line",
        });
        metaInfo.plots.push({
          id: "SenkouSpanA",
          type: "line",
        });
        metaInfo.plots.push({
          id: "SenkouSpanB",
          type: "line",
        });
        metaInfo.plots.push({
          id: "ChikouSpan",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "FisherTransform@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "FisherTransform",
          type: "line",
        });
        metaInfo.plots.push({
          id: "zero",
          type: "line",
        });
        metaInfo.plots.push({
          id: "crossUp",
          type: "line",
        });
        metaInfo.plots.push({
          id: "crossDown",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "PriceVolumeTrend@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 12,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "PVT",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "Stochastic@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
          {
            id: "smoothD",
            type: "integer",
            defval: 3,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "Stochastic",
          type: "line",
        });
        metaInfo.plots.push({
          id: "StochasticD",
          type: "line",
        });
        metaInfo.plots.push({
          id: "80",
          type: "line",
        });
        metaInfo.plots.push({
          id: "20",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "BBP@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
          {
            id: "mult",
            type: "float",
            defval: 2,
            min: 0.001,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "BBP",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "VWAP@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "VWAP",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "KeltnerChannels@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
          {
            id: "mult",
            type: "float",
            defval: 2,
            min: 0.001,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "middle",
          type: "line",
        });
        metaInfo.plots.push({
          id: "top",
          type: "line",
        });
        metaInfo.plots.push({
          id: "bottom",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "MassIndex@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 9,
            min: 1,
            max: 100000,
          },
          {
            id: "range",
            type: "integer",
            defval: 25,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "MassIndex",
          type: "line",
        });
        metaInfo.plots.push({
          id: "trigger",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "SMMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 10,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "SMMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "VMA@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 20,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "VMA",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "Vortex@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 14,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "+VI",
          type: "line",
        });
        metaInfo.plots.push({
          id: "-VI",
          type: "line",
        });
        metaInfo.plots.push({
          id: "+VI_Mean",
          type: "line",
        });
        metaInfo.plots.push({
          id: "-VI_Mean",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "PivotPointsHighLow@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 5,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "PP",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R1",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S1",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R2",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S2",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R3",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S3",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "PivotPointsStandard@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "length",
            type: "integer",
            defval: 5,
            min: 1,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "PP",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R1",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S1",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R2",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S2",
          type: "line",
        });
        metaInfo.plots.push({
          id: "R3",
          type: "line",
        });
        metaInfo.plots.push({
          id: "S3",
          type: "line",
        });
      }
    }

    if (metaInfo.id === "ZigZag@tv-basicstudies") {
      if (metaInfo.inputs.length === 0) {
        metaInfo.inputs = [
          {
            id: "source",
            type: "Source",
            defval: "close",
          },
          {
            id: "length",
            type: "integer",
            defval: 12,
            min: 1,
            max: 100000,
          },
          {
            id: "deviation",
            type: "float",
            defval: 5,
            min: 0.001,
            max: 100000,
          },
        ];
        metaInfo.plots.push({
          id: "ZigZag",
          type: "line",
        });
      }
    }

    return applyOverrides(metaInfo);
    return metaInfo;
  }
}
