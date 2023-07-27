const { getTranslatedResolutionModel } = require("./94025.js");

function translatedIntervalString(e) {
  const resolutionModel = getTranslatedResolutionModel(e, true);

  if (resolutionModel === null) {
    return e;
  }

  return (
    resolutionModel.multiplier +
    (resolutionModel.mayOmitShortKind ? "" : resolutionModel.shortKind)
  );
}

export { translatedIntervalString };
