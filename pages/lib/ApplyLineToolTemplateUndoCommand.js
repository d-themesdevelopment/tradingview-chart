"use strict";

const { UndoCommand } = require("./UndoCommand.js");

export class ApplyLineToolTemplateUndoCommand extends UndoCommand {
  constructor(source, newState, id) {
    super(id);
    this._source = source;
    this._newState = newState;
    this._oldState = source.properties().state();
  }

  redo() {
    this._source.applyTemplate(this._newState);
  }

  undo() {
    this._source.applyTemplate(this._oldState);
  }
}
