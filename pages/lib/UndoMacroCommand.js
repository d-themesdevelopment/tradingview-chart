

import { UndoCommand } from './UndoCommand.js';

class UndoMacroCommand extends UndoCommand {
  constructor(name) {
    super(name, false);
    this._subcommands = [];
  }

  addCommand(command) {
    this._subcommands.push(command);
  }

  isEmpty() {
    return this._subcommands.length === 0;
  }

  redo() {
    for (let i = 0; i < this._subcommands.length; i++) {
      this._subcommands[i].redo();
    }
  }

  undo() {
    for (let i = this._subcommands.length - 1; i >= 0; i--) {
      this._subcommands[i].undo();
    }
  }

  commands() {
    return this._subcommands;
  }
}

export { UndoMacroCommand };