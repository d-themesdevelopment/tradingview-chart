import { default as lodash, merge } from "lodash";
import { makeFont } from "fontUtils";
import { defaults, factoryDefaults, saveDefaults } from "propertyDefaults";
import { getLogger } from "logger";
import { createDefaultsState } from "stateUtils";

const logger = getLogger("Property.DefaultProperty");
let useUserPreferences = false;

function createPropertyObject(defaultsObj, path) {
  const clonedObj = lodash.cloneDeep(defaultsObj(path));
  return path.startsWith("study_")
    ? lodash.defaults({}, clonedObj, defaultsObj("study"))
    : clonedObj;
}

function createMergedPreferences(defaultsObj, name, exclusions) {
  const baseDefaults = defaultsObj(name, null);
  let preferences = createPropertyObject(baseDefaults, []);

  if (name.startsWith("study_")) {
    delete preferences.inputs.symbol;
  }

  if (name === "linetoolicon" && useUserPreferences) {
    preferences.icon = defaultsObj(name).icon;
  }

  if (name === "linetooemoji" && useUserPreferences) {
    preferences.emoji = defaultsObj(name).emoji;
  }

  if (name === "linetoolsticker" && useUserPreferences) {
    preferences.sticker = defaultsObj(name).sticker;
  }

  preferences = lodash.merge(preferences, createDefaultsState(exclusions));

  return merge({}, baseDefaults("study"), preferences);
}

let isAutoSaveEnabled = false;

export function saveDefaultProperties(autoSave) {
  isAutoSaveEnabled = autoSave;
}

class DefaultProperty extends makeFont(Property) {
  constructor(name, customDefaults, path, useUserPrefs) {
    const defaultsObj = useUserPrefs ? defaults : factoryDefaults;
    const baseDefaults = createPropertyObject(defaultsObj, name);
    let mergedDefaults = customDefaults
      ? lodash.merge({}, baseDefaults, customDefaults)
      : baseDefaults;
    mergedDefaults = createDefaultsState(mergedDefaults, path);

    super(mergedDefaults);

    this._exclusions = [];
    this._restoreFactoryDefaultsEvent = new Event();
    this._defaultName = name;
    this._useUserPreferences = useUserPrefs ?? true;
    this.listeners().subscribe(
      this,
      DefaultProperty.prototype.onPropertyChanged
    );
    this._restoreFactoryDefaultsEvent = new Event();
  }

  preferences() {
    return this.state(this._exclusions);
  }

  mergePreferences(prefs) {
    this.mergeAndFire(createDefaultsState(prefs, this._exclusions));
  }

  addExclusion(exclusion) {
    if (this._exclusions.indexOf(exclusion) < 0) {
      this._exclusions.push(exclusion);
    }
  }

  removeExclusion(exclusion) {
    const index = this._exclusions.indexOf(exclusion);
    if (index !== -1) {
      this._exclusions.splice(index, 1);
    }
  }

  restoreFactoryDefaults() {
    const defaultsObj = this._useUserPreferences ? defaults : factoryDefaults;
    const mergedDefaults = createMergedPreferences(
      defaultsObj,
      this._defaultName,
      this._exclusions
    );

    this.mergeAndFire(mergedDefaults);

    if (
      !(
        this._defaultName.startsWith("study_") &&
        !this._defaultName.startsWith("study_VbPFixed")
      )
    ) {
      saveDefaults(this._defaultName);
    }

    this._restoreFactoryDefaultsEvent.fire();
  }

  onRestoreFactoryDefaults() {
    return this._restoreFactoryDefaultsEvent;
  }

  onPropertyChanged() {
    if (
      isAutoSaveEnabled &&
      !(
        this._defaultName.startsWith("study_") &&
        !this._defaultName.startsWith("study_VbPFixed")
      )
    ) {
      this.saveDefaults();
    }
  }

  saveDefaults() {
    if (this._useUserPreferences) {
      saveDefaults(this._defaultName, this.preferences());
    }
  }

  clone(replaceByState) {
    const clonedProperty = new DefaultProperty(
      this._defaultName,
      this.state(),
      replaceByState,
      this._useUserPreferences
    );

    for (let i = 0; i < this._exclusions.length; ++i) {
      clonedProperty.addExclusion(this._exclusions[i]);
    }

    return clonedProperty;
  }
}

export { DefaultProperty, createDefaultsState, saveDefaultProperties };
