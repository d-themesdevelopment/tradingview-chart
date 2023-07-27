"use strict";

var RangeDependentStudyInputNames;

function isExtendedInput(e) {
  return RangeDependentStudyInputNames.includes(e);
}

function isExtendedInputSource(e) {
  return e === "source";
}

function getInputValue(e) {
  return isExtendedInput(e) ? e.v : e;
}

function isStudyInputOptionsInfo(e) {
  return (
    ["text", "integer", "float", "price", "session", "resolution"].includes(
      e.type
    ) && e.hasOwnProperty("options")
  );
}

function areStudyInputsEqual(e, t, i) {
  for (const s of e) {
    if (t[s.id] !== i[s.id]) {
      return false;
    }
  }
  return true;
}

function isTimeOrPriceNotHiddenInput(e) {
  return (e.type === "time" || e.type === "price") && e.isHidden !== true;
}

function editableStudyInputs(e) {
  return [];
}

(function (e) {
  e.FirstBar = "first_visible_bar_time";
  e.LastBar = "last_visible_bar_time";
  e.Realtime = "subscribeRealtime";
})(RangeDependentStudyInputNames || (RangeDependentStudyInputNames = {}));

export {
  RangeDependentStudyInputNames,
  areStudyInputsEqual,
  editableStudyInputs,
  getInputValue,
  isExtendedInput,
  isExtendedInputSource,
  isStudyInputOptionsInfo,
  isTimeOrPriceNotHiddenInput,
};
