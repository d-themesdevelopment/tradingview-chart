
import { Observable, nullValue } from '<path_to_Observable_module>';
import { makeUniqueID } from '<path_to_makeUniqueID_module>';
import { instance, registerInstanceCreatedOnPartialSymbol } from '<path_to_Instance_module>';

const DEFAULT_STATUS_COLOR = '#9598a1';
const DEFAULT_STATUS_VISIBLE = false;
const DEFAULT_STATUS_TOOLTIP = null;
const DEFAULT_STATUS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"></svg>';

class CustomStatusModel {
  constructor() {
    this._symbolCustomStatuses = new Map();
  }

  getSymbolCustomStatus(symbol) {
    if (this._symbolCustomStatuses.has(symbol)) {
      return this._symbolCustomStatuses.get(symbol);
    }

    const customStatus = new CustomStatus(symbol);
    this._symbolCustomStatuses.set(symbol, customStatus);

    return customStatus;
  }

  hideAll() {
    for (const customStatus of this._symbolCustomStatuses.values()) {
      customStatus.visible().setValue(false);
    }
  }

  static getInstance() {
    if (this._instance === null) {
      this._instance = new CustomStatusModel();
    }

    return this._instance;
  }
}

class CustomStatus {
  constructor(symbol) {
    this._symbol = symbol;
    this._visible = new Observable(DEFAULT_STATUS_VISIBLE);
    this._tooltip = new Observable(DEFAULT_STATUS_TOOLTIP);
    this._icon = new Observable(DEFAULT_STATUS_ICON);
    this._color = new Observable(DEFAULT_STATUS_COLOR);
    this._tooltipContent = new Observable(nullValue);
  }

  symbol() {
    return this._symbol;
  }

  tooltip() {
    return this._tooltip;
  }

  icon() {
    return this._icon;
  }

  color() {
    return this._color;
  }

  visible() {
    return this._visible;
  }

  tooltipContent() {
    return this._tooltipContent;
  }
}

registerInstanceCreatedOnPartialSymbol(CustomStatus);

export { CustomStatusModel };