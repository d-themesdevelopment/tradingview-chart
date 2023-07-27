import { StatusProviderBase } from '<path_to_StatusProviderBase_module>';
import { convertStudyStatusToString, StudyStatusType, studyStatusSolutionId, studyStatusTitle, studyStatusFeature } from '<path_to_studyStatus_module>';

const PARTS_OPTIONS = {
  NONE: "Default"
};

const SHOW_PARTS = false;

export class StudyStatusProviderBase extends StatusProviderBase {
  constructor(source, options) {
    super(options);
    this._source = source;
  }

  getSplitTitle() {
    return this._source.titleInParts(true, PARTS_OPTIONS, undefined, SHOW_PARTS);
  }

  text() {
    if (this._source.isActualInterval()) {
      if (this._source.isFailed()) {
        return `${this._source.title(true, PARTS_OPTIONS, undefined, SHOW_PARTS)}: ${this.sourceStatusText()}`;
      } else {
        return `${this._source.title(true, PARTS_OPTIONS, undefined, SHOW_PARTS)} ${this.sourceStatusText()}`;
      }
    } else {
      return this._source.title(true, PARTS_OPTIONS, undefined, SHOW_PARTS);
    }
  }

  sourceStatusText() {
    return convertStudyStatusToString(this._source.status(), true);
  }

  errorStatus() {
    if (!this._source.isActualInterval() || this._source.isSymbolInvalid()) {
      return null;
    }

    const studyStatus = this._source.status();
    if (studyStatus.type === StudyStatusType.Error) {
      return {
        error: this.sourceStatusText(),
        solutionId: studyStatusSolutionId(studyStatus),
        title: studyStatusTitle(studyStatus),
        studyFeature: studyStatusFeature(studyStatus)
      };
    } else {
      return null;
    }
  }
}
