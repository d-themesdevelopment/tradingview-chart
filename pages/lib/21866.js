import { t } from "some-library"; // ! not correct
import { showWarning } from "./3615";

function showTooManyStudiesNotice(studyCount) {
  if (typeof studyCount !== "number") {
    studyCount = TradingView.STUDY_COUNT_LIMIT;
  }
  showWarning({
    title: t(null, void 0, i(33603)),
    text: t(null, void 0, i(70213)).format({
      number: studyCount,
    }),
  });
}

export { showTooManyStudiesNotice };
