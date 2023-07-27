
import { StudyStatusProvider as _StudyStatusProvider } from './6892.js';

class OverlayStatusProvider extends _StudyStatusProvider {
  getSplitTitle() {
    return this._source.titleInParts(true, undefined, false, false);
  }
  text() {
    if (this._source.isActualInterval()) {
      if (this._source.isFailed()) {
        return `${this._source.title(true, undefined, false, false)}: ${this.sourceStatusText()}`;
      } else {
        return `${this._source.title(true, undefined, false, false)} ${this.sourceStatusText()}`;
      }
    } else {
      return this._source.title(true, undefined, false, false);
    }
  }
}

export { OverlayStatusProvider };
