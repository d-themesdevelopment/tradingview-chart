import { translateMessage } from "./44352.js"; // ! not correct
import { showWarning } from "./3615.js";

function showTooManyStudiesNotice(studyCount) {
  if (typeof studyCount !== "number") {
    studyCount = TradingView.STUDY_COUNT_LIMIT;
  }
  showWarning({
    title: translateMessage(null, void 0, "Warning"),
    text: translateMessage(null, void 0, "Studies limit exceeded: {number} studies per layout.\nPlease, remove some studies").format({
      number: studyCount,
    }),
  });
}

export { showTooManyStudiesNotice };
