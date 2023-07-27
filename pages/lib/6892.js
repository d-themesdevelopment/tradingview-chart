import { t } from "i18next";
import { StudyStatusProviderBase } from "./code2";

t(null, void 0, import(47542));

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
