"use strict";

// Import dependencies
const { getValue, setValue, remove, onSync } = i(56840);
const { createPrimitiveProperty } = i(59680);
const { defaultDateFormat } = i(15879);

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
