function isArray(value) {
  return (
    Array.isArray(value) ||
    Object.prototype.toString.call(value) === "[object Array]"
  );
}

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

function isFunction(value) {
  return (
    typeof value === "function" ||
    Object.prototype.toString.call(value) === "[object Function]"
  );
}

function isInherited(child, parent) {
  if (typeof child !== "function" || typeof parent !== "function") {
    throw new TypeError(
      "isInherited: child and parent should be constructor functions"
    );
  }
  return (
    child.prototype instanceof parent || child.prototype === parent.prototype
  );
}

function cloneObject(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  var clonedObj = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      clonedObj[key] = isObject(value) ? cloneObject(value) : value;
    }
  }
  return clonedObj;
}

function deepEquals(obj1, obj2, path = "") {
  if (obj1 === obj2) {
    return [true, path];
  }
  if (isObject(obj1) && (obj1 = undefined)) {
    return [false, path];
  }
  if (isObject(obj2) && (obj2 = undefined)) {
    return [false, path];
  }
  if (obj1 === null && obj2 !== null) {
    return [false, path];
  }
  if (obj2 === null && obj1 !== null) {
    return [false, path];
  }
  if (typeof obj1 !== "object" && typeof obj2 !== "object") {
    return [obj1 === obj2, path];
  }
  if (isArray(obj1) && isArray(obj2)) {
    var length = obj1.length;
    if (length !== obj2.length) {
      return [false, path];
    }
    for (var i = 0; i < length; i++) {
      var subPath = path + "[" + i + "]";
      if (!deepEquals(obj1[i], obj2[i], subPath)[0]) {
        return [false, subPath];
      }
    }
    return [true, path];
  }
  if (isFunction(obj1) || isFunction(obj2)) {
    return [false, path];
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return [false, path];
  }
  for (var prop in obj1) {
    var subPath = path + "[" + prop + "]";
    if (!deepEquals(obj1[prop], obj2[prop], subPath)[0]) {
      return [false, subPath];
    }
  }
  return [true, path];
}

function merge(target, source) {
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      var sourceValue = source[prop];
      if (isObject(sourceValue) && isObject(target[prop])) {
        merge(target[prop], sourceValue);
      } else {
        target[prop] = sourceValue;
      }
    }
  }
  return target;
}

// More functions below...

// Usage example:
// var obj1 = { a: 1, b: { c: 2 } };
// var obj2 = { b: { d: 3 }, e: 4 };
// var mergedObj = merge(obj1, obj2);
// console.log(mergedObj); // Output: { a: 1, b: { d: 3 }, e: 4 }

// Rest of the functions

function isHashObject(value) {
  return (
    isObject(value) &&
    value.constructor &&
    value.constructor.toString().indexOf("function Object") !== -1
  );
}

function isPromise(value) {
  return isObject(value) && typeof value.then === "function";
}

function isNaN(value) {
  return !(value <= 0 || value > 0);
}

function isAbsent(value) {
  return value == null;
}

function isExistent(value) {
  return value != null;
}

function isSameType(value1, value2) {
  if (isNaN(value1) || isNaN(value2)) {
    return isNaN(value1) === isNaN(value2);
  }
  return (
    Object.prototype.toString.call(value1) ===
    Object.prototype.toString.call(value2)
  );
}

export function isInteger(value) {
  return typeof value === "number" && value % 1 === 0;
}

function isString(value) {
  return isExistent(value) && value.constructor === String;
}

function parseBool(value) {
  return value === true || (isString(value) && value.toLowerCase() === "true");
}

function notNull(value) {
  return value !== null;
}

function notUndefined(value) {
  return value !== undefined;
}

function isEven(value) {
  return value % 2 === 0;
}

function declareClassAsPureInterface(classConstructor, interfaceName) {
  for (var prop in classConstructor.prototype) {
    if (
      typeof classConstructor.prototype[prop] === "function" &&
      classConstructor.prototype.hasOwnProperty(prop)
    ) {
      classConstructor.prototype[prop] = function () {
        throw new Error(
          interfaceName +
            "::" +
            prop +
            " is an interface member declaration and must be overloaded in order to be called"
        );
      };
    }
  }
}

function requireFullInterfaceImplementation(
  constructor,
  interfaceConstructor,
  interfaceName
) {
  for (var prop in interfaceConstructor.prototype) {
    if (
      typeof interfaceConstructor.prototype[prop] === "function" &&
      !constructor.prototype[prop]
    ) {
      throw new Error(
        "Interface implementation assertion failed: " +
          constructor.name +
          " does not implement " +
          interfaceName +
          "::" +
          prop +
          " function"
      );
    }
  }
}

// Usage example:
// class MyInterface {
//     method1() {}
//     method2() {}
// }
// class MyClass {
//     method1() {
//         console.log("Method 1 implementation");
//     }
// }
// declareClassAsPureInterface(MyInterface, "MyInterface");
// requireFullInterfaceImplementation(MyClass, MyInterface, "MyInterface");
// var obj = new MyClass();
// obj.method1(); // Output: Error: MyInterface::method2 is an interface member declaration and must be overloaded in order to be called
