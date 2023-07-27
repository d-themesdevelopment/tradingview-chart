


import { UndoCommand } from './UndoCommand.js';

class SetWatchedValueCommand extends UndoCommand {
  constructor(watchedValue, newValue, commandName) {
    super(commandName);
    this._wv = watchedValue;
    this._newValue = newValue;
    this._oldValue = watchedValue.value();
  }

  redo() {
    this._wv.setValue(this._newValue);
  }

  undo() {
    this._wv.setValue(this._oldValue);
  }
}

export { SetWatchedValueCommand };
