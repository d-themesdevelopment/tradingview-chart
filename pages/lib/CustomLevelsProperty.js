

import { isSameType } from './1722.js'; // Replace 'some-library' with the actual library you're using

function fillPropertiesObject(object, typecheck, tpl, names) {
  for (const key of Object.keys(object.levels)) {
    if (object.levels[key] && isSameType(object.levels[key], typecheck)) {
      let updatedLevels = tpl();
      names.forEach((name, index) => {
        updatedLevels = tpl.fill(`${index}`, name, object.levels[key], updatedLevels);
      });
      object.levels[key] = updatedLevels;
    }
  }
  return object;
}

class CustomLevelsProperty extends LevelsProperty {
  constructor(defaults, typecheck) {
    super(defaults, typecheck, false, {
      names: ['width', 'color', 'visible'],
    }, fillPropertiesObject);
  }
}

function createPropertiesObject(defaults, typecheck) {
  return new CustomLevelsProperty(defaults, typecheck);
}

export { createPropertiesObject };
