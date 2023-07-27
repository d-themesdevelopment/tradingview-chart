"use strict";

// Import dependencies
import { getValue, setValue, remove, onSync } from "./56840.js";
import { createPrimitiveProperty } from "./createPrimitiveProperty.js";
import { defaultDateFormat } from ("./15879.js");

const dateFormatKey = "date_format";

function getDateFormatProperty() {
  return getValue(dateFormatKey, defaultDateFormat());
}

export const dateFormatProperty = createPrimitiveProperty(
  getDateFormatProperty()
);

function restoreDateFormatSettingsValue() {
  dateFormatProperty.setValue(defaultDateFormat());
  remove(dateFormatKey);
}

onSync.subscribe(null, () => {
  dateFormatProperty.setValue(getDateFormatProperty());
});

dateFormatProperty.subscribe(null, () => {
  setValue(dateFormatKey, dateFormatProperty.value());
});

export { restoreDateFormatSettingsValue };
