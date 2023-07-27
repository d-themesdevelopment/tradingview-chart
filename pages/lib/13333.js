"use strict";

const translations = new Map([
  [
    "You cannot see this pivot timeframe on this resolution",
    t(null, undefined, i(17126)),
  ],
  [
    "The data vendor doesn't provide volume data for this symbol.",
    t(null, undefined, i(29198)),
  ],
  [
    'Histogram is too large, please increase "Row Size" input.',
    t(null, undefined, i(69085)),
  ],
  [
    "Histogram is too large, please reduce 'Row Size' input.",
    t(null, undefined, i(8122)),
  ],
  [
    "This script is invite-only. To request access, please contact its author.",
    t(null, undefined, i(74986)),
  ],
  [
    "Volume Profile indicator available only on our upgraded plans.",
    t(null, undefined, i(61022)),
  ],
]);

const loadingTranslation = t(null, undefined, i(30295)); // ! not correct

const errorTranslationMap = new Map();
const solutionIdMap = new Map();

function convertStudyStatusToString(status, isTranslationEnabled) {
  if (status.type === c.Loading) {
    return isTranslationEnabled ? loadingTranslation : "loading...";
  }

  if (status.type === c.Error) {
    const errorDescription = status.errorDescription;
    const errorKey = isTranslationEnabled
      ? translations.get(errorDescription.error) || errorDescription.error
      : errorDescription.error;

    if (errorDescription.ctx) {
      const ctx = {};
      for (const [key, value] of Object.entries(errorDescription.ctx)) {
        ctx[key] = value.toString();
      }
      return errorKey.format(ctx);
    }

    return errorKey;
  }

  return "";
}

function studyStatusSolutionId(status) {
  if (status.type === c.Error) {
    return (
      status.errorDescription.solution_id ||
      solutionIdMap.get(status.errorDescription.error)
    );
  }
}

function studyStatusTitle(status) {
  if (status.type === c.Error) {
    const errorDescription = status.errorDescription;
    if (
      errorDescription.error
        .toLowerCase()
        .includes(
          "the data vendor doesn't provide volume data for this symbol."
        )
    ) {
      return translations.get(
        "The data vendor doesn't provide volume data for this symbol."
      );
    }
  }
}

function studyStatusFeature(status) {
  const errorDescription = status.errorDescription;
  const error = errorDescription.error;

  for (const [prefix, feature] of errorTranslationMap) {
    if (error.startsWith(prefix)) {
      return feature;
    }
  }
}

export {
  convertStudyStatusToString,
  studyStatusFeature,
  studyStatusSolutionId,
  studyStatusTitle,
};
