
import { TranslatedString } from './TranslatedString.js';

export class UndoCommand {
  constructor(text, executeOnPush = true) {
    this._customFlags = {};
    this._text = text || new TranslatedString("", "");
    this._executeOnPush = executeOnPush;
  }

  text() {
    return this._text;
  }

  executeOnPush() {
    return this._executeOnPush;
  }

  customFlag(flag) {
    return this._customFlags[flag];
  }

  setCustomFlag(flag, value) {
    this._customFlags[flag] = value;
  }

  canMerge(command) {
    return false;
  }

  merge(command) {
    throw new Error("Should be re-implemented in child classes");
  }
}