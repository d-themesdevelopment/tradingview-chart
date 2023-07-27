import { createPrimitiveProperty } from "./createPrimitiveProperty";
import { t } from "some-import-path"; // ! not correct

function getVisibilityMode(mode) {
  return mode === "alwaysOn" || mode === "alwaysOff"
    ? mode
    : "visibleOnMouseOver";
}

function createVisibilityController(primaryProperty, secondaryProperty) {
  let primaryProp, secondaryProp;

  function getPrimaryProperty() {
    if (!primaryProp) {
      primaryProp = createPrimitiveProperty();
      let value = secondaryProperty.getValue(primaryProperty);
      if (value === undefined && secondaryProperty !== undefined) {
        value = secondaryProperty.getValue();
      }
      primaryProp.setValue(getVisibilityMode(value));
      primaryProp.subscribe(primaryProp, (newValue) => {
        secondaryProperty.setValue(getVisibilityMode(newValue.value()));
      });
    }
    return primaryProp;
  }

  return {
    property: getPrimaryProperty,
    availableValues: function () {
      return [
        {
          id: "visibleOnMouseOver",
          value: "visibleOnMouseOver",
          title: t(null, undefined, "Visible on Mouse Over"),
        },
        {
          id: "alwaysOn",
          value: "alwaysOn",
          title: t(null, undefined, "Always On"),
        },
        {
          id: "alwaysOff",
          value: "alwaysOff",
          title: t(null, undefined, "Always Off"),
        },
      ];
    },
    actualBehavior: function () {
      if (!secondaryProp) {
        secondaryProp = createPrimitiveProperty();
        const primary = getPrimaryProperty();
        const updateValue = () => {
          let value = primary.value();
          if (value !== "alwaysOn" && value !== "alwaysOff") {
            value = r.mobiletouch ? "alwaysOn" : "visibleOnMouseOver";
          }
          secondaryProp && secondaryProp.setValue(value);
        };
        primary.subscribe(secondaryProp, updateValue);
        updateValue();
      }
      return secondaryProp;
    },
  };
}

export { createVisibilityController };
