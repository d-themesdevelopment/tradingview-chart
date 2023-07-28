"use strict";

export function deepExtend(target, ...sources) {
  if (target && typeof target === "object") {
    if (sources.length === 0) {
      return target;
    }
    sources.forEach((source) => {
      if (source !== null && typeof source === "object") {
        Object.keys(source).forEach((key) => {
          const currentValue = target[key];
          const newValue = source[key];
          if (newValue === target) {
            return;
          }
          const isArray = Array.isArray(newValue);
          if (newValue && (isPlainObject(newValue) || isArray)) {
            let mergedValue;
            if (isArray) {
              mergedValue =
                currentValue && Array.isArray(currentValue) ? currentValue : [];
            } else {
              mergedValue =
                currentValue && isPlainObject(currentValue) ? currentValue : {};
            }
            target[key] = deepExtend(mergedValue, newValue);
          } else if (newValue !== undefined) {
            target[key] = newValue;
          }
        });
      }
    });
  }
  return target;
}

function isPlainObject(value) {
  if (!value || Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (!prototype) {
    return true;
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasConstructor =
    prototype.hasOwnProperty("constructor") && prototype.constructor;
  return (
    typeof hasConstructor === "function" &&
    Object.prototype.toString.call(hasConstructor) ===
      Object.prototype.toString.call(Object) &&
    hasOwnProperty.call(prototype, "isPrototypeOf")
  );
}
