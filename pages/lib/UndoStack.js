
import { UndoCommand } from '<path_to_UndoCommand_module>';
import { getLogger } from 'log';
import { EventDispatcher } from '<path_to_EventDispatcher_module>';
import { default as n__default } from '<path_to_default_module>';

const logger = getLogger("Common.UndoStack");

export class UndoStack {
  constructor() {
    this._commands = [];
    this._onChange = new EventDispatcher();
  }

  onChange() {
    return this._onChange;
  }

  isEmpty() {
    return this._commands.length === 0;
  }

  size() {
    return this._commands.length;
  }

  clear() {
    if (!this.isEmpty()) {
      this._commands.length = 0;
      this._onChange.fire();
    }
  }

  push(command) {
    if (!(command instanceof UndoCommand)) {
      throw new TypeError("argument must be an instance of UndoCommand");
    }
    this._commands.push(command);
    this._onChange.fire(command);
  }

  pop() {
    if (this.isEmpty()) {
      logger.logDebug("pop: undo stack is empty");
      return;
    }
    const command = this._commands.pop();
    this._onChange.fire(command);
    return command;
  }

  head() {
    if (!this.isEmpty()) {
      return this._commands[this._commands.length - 1];
    }
  }
}