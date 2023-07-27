import { ensureDefined } from "./assertions";
import { UndoStack } from "./UndoStack";
import { UndoMacroCommand } from "./UndoMacroCommand";
import { SetWatchedValueCommand } from "./69718";

import { getLogger } from "path/to/logger"; // ! not correct

import { create } from "path/to/eventEmitter"; // ! not correct

const logger = getLogger("Common.UndoHistory");

function createUndoHistory() {
  const commandStack = [];
  const undoStack = new UndoStack();
  const redoStack = new UndoStack();
  const eventEmitter = create();

  function executeCommand(command) {
    if (commandStack.length > 0) {
      commandStack[commandStack.length - 1].addCommand(command);
    } else {
      undoStack.clear();
      const currentHead = undoStack.head();
      const previousText = currentHead && currentHead.text().originalText();

      if (currentHead && currentHead.canMerge(command)) {
        currentHead.merge(command);
      } else {
        undoStack.push(command);
      }

      const newText = command.text().originalText();
      if (newText !== "" && newText !== previousText) {
        logger.logNormal("DO: " + newText);
      }
    }
    if (command.executeOnPush()) {
      command.redo();
    }
    if (commandStack.length === 0) {
      eventEmitter.fire(getUndoHistoryState());
    }
  }

  function getUndoHistoryState() {
    const undoHead = undoStack.head();
    const redoHead = redoStack.head();
    const undoText = undoHead ? undoHead.text().translatedText() : undefined;
    const redoText = redoHead ? redoHead.text().translatedText() : undefined;

    return {
      enableUndo: !undoStack.isEmpty(),
      undoCommandCount: undoStack.size(),
      undoText: undoText,
      enableRedo: !redoStack.isEmpty(),
      redoCommandCount: redoStack.size(),
      redoText: redoText,
      originalUndoText: undoHead ? undoHead.text().originalText() : undefined,
      originalRedoText: redoHead ? redoHead.text().originalText() : undefined,
    };
  }

  return {
    beginUndoMacro: function (description) {
      const macroCommand = new UndoMacroCommand(description);
      commandStack.push(macroCommand);
      return macroCommand;
    },

    clearStack: function () {
      undoStack.clear();
      redoStack.clear();
      eventEmitter.fire(getUndoHistoryState());
    },

    createUndoCheckpoint: function () {
      return {
        lastActualCommand: undoStack.isEmpty() ? null : undoStack.head(),
      };
    },

    endUndoMacro: function () {
      const macroCommand = ensureDefined(commandStack.pop());
      if (!macroCommand.isEmpty()) {
        executeCommand(macroCommand);
      }
    },

    pushUndoCommand: executeCommand,

    redo: function () {
      if (redoStack.isEmpty()) {
        return false;
      }
      const command = redoStack.pop();
      if (!command) {
        return false;
      }
      command.redo();
      undoStack.push(command);
      logger.logNormal("REDO: " + command.text().originalText());
      eventEmitter.fire(getUndoHistoryState());
      return true;
    },

    redoStack: function () {
      return redoStack;
    },

    setWatchedValue: function (
      watchedValue,
      value,
      description,
      doesNotAffectSave
    ) {
      if (watchedValue.value() !== value) {
        const command = new SetWatchedValueCommand(
          watchedValue,
          value,
          description
        );
        command.setCustomFlag("doesnt_affect_save", !!doesNotAffectSave);
        executeCommand(command);
        command.redo();
      }
    },

    undo: function () {
      if (undoStack.isEmpty()) {
        return false;
      }
      const command = undoStack.pop();
      if (!command) {
        return false;
      }
      command.undo();
      redoStack.push(command);
      logger.logNormal("UNDO: " + command.text().originalText());
      eventEmitter.fire(getUndoHistoryState());
      return true;
    },

    undoStack: function () {
      return undoStack;
    },

    undoToCheckpoint: function (checkpoint) {
      while (
        !undoStack.isEmpty() &&
        checkpoint.lastActualCommand !== undoStack.head()
      ) {
        undoStack.pop().undo();
      }
      redoStack.clear();
      eventEmitter.fire(getUndoHistoryState());
    },

    state: getUndoHistoryState,

    onChange: function () {
      return eventEmitter;
    },
  };
}

export { createUndoHistory };
