const createVisibilityController = require(29542).createVisibilityController;
const storage = require(56840);
const storageInstance = storage.n();
const {
  property: currencyUnitVisibilityProperty,
  availableValues: currencyUnitVisibilityOptions,
} = createVisibilityController("PriceAxisCurrencyAndUnit.visibility");
let hasMigrated = false;

function migrateShowCurrencyAndShowUnitProperties(showCurrency, showUnit) {
  if (!hasMigrated) {
    hasMigrated = true;

    if (
      typeof storageInstance.getValue("PriceAxisCurrencyAndUnit.visibility") ===
      "undefined"
    ) {
      currencyUnitVisibilityProperty().setValue(
        showCurrency || showUnit ? "alwaysOn" : "alwaysOff"
      );
    }
  }
}

function restoreCurrencyUnitVisibilitySettingsValue() {
  currencyUnitVisibilityProperty().setValue("visibleOnMouseOver");
  storageInstance.remove("PriceAxisCurrencyAndUnit.visibility");
}

module.exports = {
  currencyUnitVisibilityOptions,
  currencyUnitVisibilityProperty,
  migrateShowCurrencyAndShowUnitProperties,
  restoreCurrencyUnitVisibilitySettingsValue,
};
