"use strict";

const { translateMessage } = require("./44352");
var { getIsoLanguageCodeFromLanguage } = require("./28865");
var { numberToStringWithLeadingZero } = require("./61146");

const dateFormatsMap = {
  1: () => translateMessage(null, void 0, i(95425)),
  2: () => translateMessage(null, void 0, i(35050)),
  3: () => translateMessage(null, void 0, i(51369)),
  4: () => translateMessage(null, void 0, i(42762)),
  5: () => translateMessage(null, { context: "short" }, i(27991)),
  6: () => translateMessage(null, void 0, i(15224)),
  7: () => translateMessage(null, void 0, i(6215)),
  8: () => translateMessage(null, void 0, i(38465)),
  9: () => translateMessage(null, void 0, i(57902)),
  10: () => translateMessage(null, void 0, i(73546)),
  11: () => translateMessage(null, void 0, i(71230)),
  12: () => translateMessage(null, void 0, i(92203)),
};

const getMonth = (date, isLocal) =>
  (isLocal ? date.getMonth() : date.getUTCMonth()) + 1;
const getYear = (date, isLocal) =>
  isLocal ? date.getFullYear() : date.getUTCFullYear();
const getWeekday = (date) =>
  date.toLocaleDateString(
    window.language ? getIsoLanguageCodeFromLanguage(window.language) : void 0,
    { weekday: "short", timeZone: "UTC" }
  );

const getDayWithLeadingZero = (date, isLocal) =>
  numberToStringWithLeadingZero(
    isLocal ? date.getDate() : date.getUTCDate(),
    2
  );

const getMonthWithLeadingZero = (date, isLocal) =>
  numberToStringWithLeadingZero(getMonth(date, isLocal), 2);

const getYearShort = (date, isLocal) =>
  numberToStringWithLeadingZero(getYear(date, isLocal) % 100, 2);

const getYearFull = (date, isLocal) =>
  numberToStringWithLeadingZero(getYear(date, isLocal), 4);

const dateFormatFunctions = {
  "dd MMM 'yy": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)} ${dateFormatsMap[
      getMonth(date, isLocal)
    ]()} '${getYearShort(date, isLocal)}`,
  "MMM dd, yyyy": (date, isLocal) =>
    `${dateFormatsMap[getMonth(date, isLocal)]()} ${getDayWithLeadingZero(
      date,
      isLocal
    )}, ${getYearFull(date, isLocal)}`,
  "MMM dd": (date, isLocal) =>
    `${dateFormatsMap[getMonth(date, isLocal)]()} ${getDayWithLeadingZero(
      date,
      isLocal
    )}`,
  "dd MMM": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)} ${dateFormatsMap[
      getMonth(date, isLocal)
    ]()}`,
  "yyyy-MM-dd": (date, isLocal) =>
    `${getYearFull(date, isLocal)}-${getMonthWithLeadingZero(
      date,
      isLocal
    )}-${getDayWithLeadingZero(date, isLocal)}`,
  "yy-MM-dd": (date, isLocal) =>
    `${getYearShort(date, isLocal)}-${getMonthWithLeadingZero(
      date,
      isLocal
    )}-${getDayWithLeadingZero(date, isLocal)}`,
  "yy/MM/dd": (date, isLocal) =>
    `${getYearShort(date, isLocal)}/${getMonthWithLeadingZero(
      date,
      isLocal
    )}/${getDayWithLeadingZero(date, isLocal)}`,
  "yyyy/MM/dd": (date, isLocal) =>
    `${getYearFull(date, isLocal)}/${getMonthWithLeadingZero(
      date,
      isLocal
    )}/${getDayWithLeadingZero(date, isLocal)}`,
  "dd-MM-yyyy": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)}-${getMonthWithLeadingZero(
      date,
      isLocal
    )}-${getYearFull(date, isLocal)}`,
  "dd-MM-yy": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)}-${getMonthWithLeadingZero(
      date,
      isLocal
    )}-${getYearShort(date, isLocal)}`,
  "dd/MM/yy": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)}/${getMonthWithLeadingZero(
      date,
      isLocal
    )}/${getYearShort(date, isLocal)}`,
  "dd/MM/yyyy": (date, isLocal) =>
    `${getDayWithLeadingZero(date, isLocal)}/${getMonthWithLeadingZero(
      date,
      isLocal
    )}/${getYearFull(date, isLocal)}`,
  "MM/dd/yy": (date, isLocal) =>
    `${getMonthWithLeadingZero(date, isLocal)}/${getDayWithLeadingZero(
      date,
      isLocal
    )}/${getYearShort(date, isLocal)}`,
  "MM/dd/yyyy": (date, isLocal) =>
    `${getMonthWithLeadingZero(date, isLocal)}/${getDayWithLeadingZero(
      date,
      isLocal
    )}/${getYearFull(date, isLocal)}`,
};

const getDateFormatWithWeekday = (format) => {
  return "ja" === window.language
    ? (date, isLocal) =>
        `${dateFormatFunctions[format](date, isLocal)} (${getWeekday(date)})`
    : (date, isLocal) =>
        `${getWeekday(date)} ${dateFormatFunctions[format](date, isLocal)}`;
};

const availableDateFormats = Object.keys(dateFormatFunctions);
const defaultDateFormat = () => {
  const supportedLanguages = ["ja", "ko", "zh", "zh_TW"];
  const language = window.language || "";
  return supportedLanguages.includes(language) ? "yyyy-MM-dd" : "dd MMM 'yy";
};

export {
  availableDateFormats,
  dateFormatFunctions,
  defaultDateFormat,
  getDateFormatWithWeekday,
};
