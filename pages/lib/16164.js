const { getValue, remove, onSync, setValue } = require("./56840.js"); // ! not correct
const { createPrimitiveProperty } = require("./createPrimitiveProperty.js");

export const timeHoursFormatProperty = createPrimitiveProperty(
  getValue("time_hours_format", "24-hours")
);

export function restoreTimeHoursFormatSettingsValue() {
  timeHoursFormatProperty.setValue("24-hours");
  remove("time_hours_format");
}

onSync.subscribe(null, () =>
  timeHoursFormatProperty.setValue(getValue("time_hours_format", "24-hours"))
);

timeHoursFormatProperty.subscribe(null, () =>
  setValue("time_hours_format", timeHoursFormatProperty.value())
);
