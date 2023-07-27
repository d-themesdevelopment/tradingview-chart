
import { LineToolCollectedProperty } from '<path_to_LineToolCollectedProperty_module>';
import { LineToolColorsProperty } from '<path_to_LineToolColorsProperty_module>';
import { LineToolMultiplePropertyBaseImpl } from '<path_to_LineToolMultiplePropertyBaseImpl_module>';
import { LineToolWidthsProperty } from '<path_to_LineToolWidthsProperty_module>';
import { MultipleLineColorsProperty } from '<path_to_MultipleLineColorsProperty_module>';
import { MultipleLineWidthsProperty } from '<path_to_MultipleLineWidthsProperty_module>';
import { getLogger } from '<path_to_getLogger_module>';

const logger = getLogger("Chart.LineToolCollectedProperty");

class LineToolCollectedProperty {
  applyValue(property, value) {
    property.setValue(value);
  }
}

class LineToolMultiplePropertyBaseImpl extends LineToolCollectedProperty {
  constructor(properties, showIfProperty) {
    super();
    this._onChange = new LineToolMultiplePropertyBaseImpl();
    this._properties = properties;
    properties.forEach((property) => {
      property.subscribe(this, () => {
        this._onChange.fire(this);
      });
    });
    this._showIfProperty = showIfProperty;
  }

  visible() {
    return !this._showIfProperty || this._showIfProperty.value();
  }

  value() {
    if (this._properties.length === 0) {
      logger.logError("Incorrect call, should not request value of 0 properties");
      return "mixed";
    }

    const firstValue = this._properties[0].value();
    if (this._properties.length === 1 || this._properties.every((property) => property.value() === firstValue)) {
      return firstValue;
    }

    return "mixed";
  }

  state() {}

  merge() {}

  destroy() {
    this._properties.forEach((property) => property.unsubscribeAll(this));
  }

  subscribe(handler, callback) {
    this._onChange.subscribe(handler, callback);
  }

  unsubscribe(handler, callback) {
    this._onChange.unsubscribe(handler, callback);
  }

  unsubscribeAll(handler) {
    this._onChange.unsubscribeAll(handler);
  }

  storeStateIfUndefined() {
    return true;
  }
}

class LineToolColorsProperty extends LineToolMultiplePropertyBaseImpl {}

class LineToolWidthsProperty extends LineToolMultiplePropertyBaseImpl {}

class MultipleLineColorsProperty extends LineToolColorsProperty {
  firstColor() {
    return this._properties[0].value();
  }
}

class MultipleLineWidthsProperty extends LineToolWidthsProperty {}

export {
  LineToolCollectedProperty,
  LineToolColorsProperty,
  LineToolMultiplePropertyBaseImpl,
  LineToolWidthsProperty,
  MultipleLineColorsProperty,
  MultipleLineWidthsProperty,
};