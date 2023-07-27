
"use strict";

function encodeSymbol(obj) {
  return "=" + JSON.stringify(sortKeys(obj));
}

function sortKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      if (Object.prototype.toString.call(obj[key]) === "[object Object]") {
        result[key] = sortKeys(obj[key]);
      } else {
        result[key] = obj[key];
      }
      return result;
    }, {});
}

function isStudySymbol(obj) {
  return Boolean(obj.inputs);
}

function encodeExtendedSymbolOrGetSimpleSymbolString(obj) {
  return encodeSymbol(obj);
}

function isEncodedExtendedSymbol(str) {
  return str[0] === "=";
}

function decodeExtendedSymbol(str) {
  if (!isEncodedExtendedSymbol(str)) {
    return { symbol: str };
  }
  try {
    return JSON.parse(str.slice(1));
  } catch (error) {
    return { symbol: str };
  }
}

function unwrapSimpleSymbol(obj) {
  return typeof obj === "string" ? obj : unwrapSimpleSymbol(obj.symbol);
}

const extendedSymbolUtils = {
  decodeExtendedSymbol,
  encodeExtendedSymbolOrGetSimpleSymbolString,
  isEncodedExtendedSymbol,
  isStudySymbol,
  unwrapSimpleSymbol,
};
