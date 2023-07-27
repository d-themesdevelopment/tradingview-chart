

(e, t, i) => {
    "use strict";
    const Version = i(18923).Version;
    const getLogger = i(59224).getLogger("Chart.StudyMigration");
  
    function StudyMigration(studyId) {
      this._studyId = studyId;
      this._maxToVers = Version.ZERO;
      this._maxFromVers = Version.ZERO;
      this._migrs = [];
    }
  
    StudyMigration.prototype.addMigration = function (fromVersion, toVersion, rules) {
      const fromVers = Version.parse(fromVersion);
      const toVers = Version.parse(toVersion);
  
      if (fromVers.isGreater(this._maxFromVers)) {
        this._maxFromVers = fromVers;
      }
      if (toVers.isGreater(this._maxToVers)) {
        this._maxToVers = toVers;
      }
  
      this._migrs.push({
        fromVers,
        toVers,
        rules
      });
    };
  
    StudyMigration.prototype.updateInputs = function (fromVersion, toVersion, inputs) {
      if (!inputs) {
        return inputs;
      }
  
      let migratedInputs = TradingView.clone(inputs);
      let currentVersion = fromVersion;
  
      while (currentVersion.isLess(toVersion)) {
        const migration = this._findMigration(currentVersion);
  
        if (!migration) {
          break;
        }
  
        getLogger.logNormal(
          `Migrating study inputs from ${migration.fromVers} to ${migration.toVers} version, studyId: ${this._studyId}, migration: ${JSON.stringify(migration)}, inputs: ${JSON.stringify(inputs)}`
        );
  
        migratedInputs = this._applyMigration(migratedInputs, migration);
  
        if (!currentVersion.isLess(migration.toVers)) {
          throw new Error("Problems in study migration process... Possible infinite cycle has been detected and stopped.");
        }
  
        currentVersion = migration.toVers;
      }
  
      if (currentVersion > fromVersion) {
        getLogger.logNormal(`Study inputs migration is done, studyId: ${this._studyId}, inputs: ${JSON.stringify(migratedInputs)}`);
      }
  
      return migratedInputs;
    };
  
    StudyMigration.prototype._findMigration = function (currentVersion) {
      let migrationIndex = -1;
      let maxFromVersion = this._maxFromVers;
  
      for (let i = 0; i < this._migrs.length; i++) {
        const migration = this._migrs[i];
  
        if (migration.fromVers.isLess(currentVersion) || (migration.fromVers.isLessOrEqual(maxFromVersion) && migration.fromVers.isLess(currentVersion))) {
          maxFromVersion = migration.fromVers;
          migrationIndex = i;
        }
      }
  
      return migrationIndex < 0 ? null : this._migrs[migrationIndex];
    };
  
    StudyMigration.prototype._applyMigration = function (inputs, migration) {
      let migratedInputs = inputs;
  
      for (let i = 0; i < migration.rules.length; i++) {
        const rule = migration.rules[i];
        migratedInputs = this._getApplyRuleFun(rule.type)(migratedInputs, rule);
      }
  
      return migratedInputs;
    };
  
    StudyMigration.prototype._getApplyRuleFun = function (type) {
      if (type === "inputRemoved") {
        return StudyMigration._applyInputRemovedRule;
      }
      if (type === "inputChangedType") {
        return StudyMigration._applyInputChangedTypeRule;
      }
      if (type === "inputChangedMinMax") {
        return StudyMigration._applyInputChangedMinMaxRule;
      }
      if (type === "inputChangedOptions") {
        return StudyMigration._applyInputChangedOptionsRule;
      }
  
      throw new Error("Unknown migration rule type: " + type);
    };
  
    StudyMigration._applyInputRemovedRule = function (inputs, rule) {
      if (!(rule.inputId in inputs)) {
        return inputs;
      }
  
      if (rule.action !== "removeVal") {
        throw new Error("Unexpected rule.action=" + rule.action + " in rule.type=" + rule.type);
      }
  
      const removedValue = inputs[rule.inputId];
      delete inputs[rule.inputId];
  
      getLogger.logNormal(`Input ${rule.inputId}=${removedValue} removed`);
  
      return inputs;
    };
  
    StudyMigration._applyInputChangedTypeRule = function (inputs, rule) {
      const currentValue = inputs[rule.inputId];
  
      if (rule.action === "resetToDefVal") {
        inputs[rule.inputId] = rule.defVal;
        getLogger.logNormal(`Input ${rule.inputId}=${currentValue} reset to default value ${rule.defVal}`);
        return inputs;
      }
  
      if (rule.action === "convertVal") {
        if (currentValue === null) {
          return inputs;
        }
  
        if (rule.inputTypeFrom === "float" && rule.inputType === "integer") {
          inputs[rule.inputId] = Math.round(inputs[rule.inputId]);
          getLogger.logNormal(`Input ${rule.inputId}=${currentValue} converted to value ${inputs[rule.inputId]}`);
          return inputs;
        }
  
        if (rule.inputTypeFrom === "integer" && rule.inputType === "float") {
          return inputs;
        }
  
        if (rule.inputTypeFrom === "text" && rule.inputType === "source") {
          if (!StudyMigration._isValidSource(currentValue, rule.options)) {
            inputs[rule.inputId] = rule.defVal;
          }
  
          return inputs;
        }
  
        throw new Error(`Cannot convertVal from ${rule.inputTypeFrom} to ${rule.inputType}`);
      }
  
      throw new Error(`Unknown action ${rule.action} for rule with type ${rule.type}`);
    };
  
    StudyMigration._isValidSource = function (input, options) {
      return input.indexOf("$") >= 0 || options.indexOf(input) >= 0;
    };
  
    StudyMigration._applyInputChangedMinMaxRule = function (inputs, rule) {
      if (rule.action !== "adjustValIfNeeded") {
        throw new Error(`Unknown action ${rule.action} for rule with type ${rule.type}`);
      }
  
      const currentValue = inputs[rule.inputId];
  
      if (currentValue < rule.minVal) {
        inputs[rule.inputId] = rule.minVal;
      } else if (currentValue > rule.maxVal) {
        inputs[rule.inputId] = rule.maxVal;
      }
  
      getLogger.logNormal(`Input ${rule.inputId}=${currentValue} adjusted to value ${inputs[rule.inputId]}`);
  
      return inputs;
    };
  
    StudyMigration._applyInputChangedOptionsRule = function (inputs, rule) {
      if (!(["text"].indexOf(rule.inputType) >= 0 && rule.action === "resetToDefValIfNeeded")) {
        throw new Error(`Unexpected rule.inputType=${rule.inputType} in rule.action=${rule.action}`);
      }
  
      const currentValue = inputs[rule.inputId];
  
      if (rule.options.indexOf(currentValue) < 0) {
        inputs[rule.inputId] = rule.defVal;
        getLogger.logNormal(`Input ${rule.inputId}=${currentValue} reset to default value ${rule.defVal}`);
      }
  
      return inputs;
    };
  
    return StudyMigration;
  };
  