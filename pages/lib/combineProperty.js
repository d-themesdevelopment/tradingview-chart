

import { createPrimitiveProperty } from 'some-library'; // Replace 'some-library' with the actual library you're using

function combineProperty(combineFn, ...properties) {
  const initialValue = combineFn(...properties.map((property) => property.value()));
  const combinedProperty = createPrimitiveProperty(initialValue);
  const subscribers = {};

  const updateValue = () => {
    combinedProperty.setValue(combineFn(...properties.map((property) => property.value())));
  };

  for (const property of properties) {
    property.subscribe(subscribers, updateValue);
  }

  combinedProperty.destroy = () => {
    properties.forEach((property) => property.unsubscribeAll(subscribers));
  };

  return combinedProperty;
}

export { combineProperty };