import { keys as _keys } from "lodash";

const validLineToolNames = new Set([
  "LineToolRegressionTrend",
  "LineToolVbPFixed",
  "LineToolFixedRangeVolumeProfile",
  "LineToolAnchoredVWAP",
]);

const validTextToolNames = new Set([
  "LineToolBalloon",
  "LineToolComment",
  "LineToolText",
  "LineToolTextAbsolute",
  "LineToolCallout",
  "LineToolNote",
  "LineToolNoteAbsolute",
  "LineToolSignpost",
]);

function isMtpPredictorToolName(name) {
  return false;
}

function isStudyLineToolName(name) {
  return validLineToolNames.has(name);
}

export function isLineToolName(name) {
  return (
    _keys(s || (s = i.t(r, 2))).includes(name) || isStudyLineToolName(name)
  );
}

function isLineDrawnWithPressedButton(name) {
  return name === "LineToolBrush" || name === "LineToolHighlighter";
}

function isLineToolFinishRequiredWhenCreatedByApi(name) {
  return (
    isLineDrawnWithPressedButton(name) ||
    name === "LineToolPath" ||
    name === "LineToolPolyline" ||
    name === "LineToolGhostFeed"
  );
}

function isLineToolDrawWithoutPoints(name) {
  return (
    name === "LineToolTweet" ||
    name === "LineToolIdea" ||
    name === "LineToolImage"
  );
}

function isImageToolName(name) {
  return name === "LineToolImage";
}

function isTextToolName(name) {
  return validTextToolNames.has(name);
}
