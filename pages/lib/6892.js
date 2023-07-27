import { translateMessage } from "./44352.js";
import { StudyStatusProviderBase } from "./code2";

translateMessage(null, void 0, "Fundamental studies are no longer available on charts");

class StudyStatusProvider extends StudyStatusProviderBase {
  constructor(study, model) {
    super(study, model);
    this._study = study;
  }

  color() {
    if (
      this._study.isFailed() ||
      (this._study.metaInfo && this._study.metaInfo().isTVScriptStub)
    ) {
      return "#ff0000";
    }
    return super.color();
  }

  sourceStatusText() {
    this._study.status();
    return super.sourceStatusText();
  }
}

export { StudyStatusProvider };
