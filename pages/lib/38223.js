import { getNormalizedScrollLeft, detectScrollType } from "./64531.js"; // ! not correct

const isRtl = () => window.document.dir === "rtl";
const ltrMark = "‎";
const ltrMarkSsr = "‪";
const rtlMark = "‫";
const rtlMarkSsr = "‪";
const stripMarksRegex = new RegExp("‎|‪|‫|‬", "g");
const nonRtlCharRegex =
  /[^\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u02B9-\u02FF\u2000-\u200E\u2010-\u2029\u202C\u202F-\u2BFF]/;
const rtlCharRegex =
  /[\u0590-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

function stripLTRMarks(str) {
  return str !== "" && isRtl() && str !== null
    ? str.replace(stripMarksRegex, "")
    : str;
}

function startWithLTR(str) {
  return str !== "" && isRtl() && str !== null ? ltrMark + str : str;
}

function forceLTRStr(str) {
  return str !== "" && isRtl() && str !== null
    ? ltrMarkSsr + str + ltrMark
    : str;
}

function forceLTRStrSsr(str) {
  return ltrMarkSsr + str + ltrMark;
}

function forceRTLStr(str) {
  return str !== "" && isRtl() && str !== null ? rtlMark + str + ltrMark : str;
}

function getLTRScrollLeft(element) {
  return getNormalizedScrollLeft(element, "rtl");
}

function getLTRScrollLeftOffset(element, offset) {
  const scrollType = detectScrollType();
  if (scrollType === "indeterminate") {
    return 0;
  }
  switch (scrollType) {
    case "negative":
      offset = element.clientWidth - element.scrollWidth + offset;
      break;
    case "reverse":
      offset = element.scrollWidth - element.clientWidth - offset;
      break;
  }
  return offset;
}

function detectAutoDirection(text) {
  const matchedChar = nonRtlCharRegex.exec(text);
  return matchedChar ? (rtlCharRegex.test(matchedChar[0]) ? "rtl" : "ltr") : "";
}

export {
  isRtl,
  stripLTRMarks,
  startWithLTR,
  forceLTRStr,
  forceLTRStrSsr,
  forceRTLStr,
  getLTRScrollLeft,
  getLTRScrollLeftOffset,
  detectAutoDirection,
};
