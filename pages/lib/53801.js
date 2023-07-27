import { isSameType } from 'type-check-module';
import { DefaultProperty, saveDefaults } from 'default-property-module';

const defaultConfig = {
  prefixes: [""],
  range: [0, 0],
  names: ["coeff", "color", "visible", "linestyle", "linewidth"],
  typecheck: {
    pack: () => Object(),
    unpack: () => []
  }
};

function unpackValuesFromObject(obj, index, targetArray) {
  return targetArray.push(obj[index]), targetArray;
}

function packValuesToObject(obj, index, sourceArray) {
  return obj[index] = sourceArray, obj;
}

function createEmptyArray() {
  return [];
}

function createEmptyObject() {
  return {};
}

function fillLevels(config, iterator, targetObject) {
  return config.prefixes.forEach((prefix) => {
    const levelPrefix = prefix + "level";
    for (let level = config.range[0]; level <= config.range[1]; level++) {
      if (targetObject[levelPrefix + level] && isSameType(targetObject[levelPrefix + level], iterator.typecheck())) {
        let newObj = iterator.tpl();
        config.names.forEach((name, index) => {
          newObj = iterator.fill("" + index, name, targetObject[levelPrefix + level], newObj);
        });
        targetObject[levelPrefix + level] = newObj;
      }
    }
  });
}

function applyIteratorToObject(obj, iterator, config) {
  return iterator(obj, {
    tpl: createEmptyObject,
    fill: packValuesToObject,
    typecheck: config.typecheck.unpack
  }, config);
}

class LevelsProperty extends DefaultProperty {
  constructor(name, value, isUserPreference, exclusions, levelsIterator) {
    const config = {
      ...defaultConfig,
      ...(isUserPreference != null ? isUserPreference : {})
    };
    super(name, value ? applyIteratorToObject(value, config, levelsIterator) : value, exclusions);
    this._map = config;
    this._levelsIterator = levelsIterator;
  }

  state(exclusions, useUserPreferences) {
    const state = super.state(exclusions);
    return useUserPreferences ? state : applyIteratorToObject(state, {
      tpl: createEmptyArray,
      fill: unpackValuesFromObject,
      typecheck: this._map.typecheck.pack
    }, this._map);
  }

  saveDefaults() {
    if (this._useUserPreferences) {
      saveDefaults(this._defaultName, this.state(this._exclusions, true));
    }
  }

  clone() {
    const currentState = this.state();
    const clonedProperty = new LevelsProperty(this._defaultName, currentState);
    for (let i = 0; i < this._exclusions.length; ++i) {
      clonedProperty.addExclusion(this._exclusions[i]);
    }
    return clonedProperty;
  }

  merge(value, overwriteExclusions) {
    return super.merge(applyIteratorToObject(value, this._map, this._levelsIterator), overwriteExclusions);
  }
}

export { LevelsProperty };