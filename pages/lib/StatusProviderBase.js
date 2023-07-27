"use strict";

class StatusProviderBase {
  constructor(colorProperty) {
    this._colorProperty = colorProperty;
  }

  size() {
    return "13px";
  }

  bold() {
    return false;
  }

  color() {
    return this._colorProperty.value();
  }
}

export { StatusProviderBase };
