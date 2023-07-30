import { getLogger } from "some-library"; // Replace 'some-library' with the actual library you're using
import { UndoCommand } from "some-library"; // Replace 'some-library' with the actual library you're using

const logger = getLogger("Chart.ChartUndoModel");

class TimeScaleChangeUndoCommand extends UndoCommand {
  constructor(model, rightOffsetAndBarSpacing, customFlag) {
    super(customFlag, false);
    this._newRightOffsetAndBarSpacing = null;
    this.setCustomFlag("doesnt_affect_save", true);
    this._model = model;
    this._rightOffsetAndBarSpacing = rightOffsetAndBarSpacing;
  }

  undo() {
    if (this._newRightOffsetAndBarSpacing !== null) {
      logger.logDebug(
        "TimeScaleChangeUndoCommand.undo: Command is already undone"
      );
      return;
    }

    const timeScale = this._model.timeScale();
    this._newRightOffsetAndBarSpacing = {
      barSpacing: timeScale.barSpacing(),
      rightOffset: timeScale.rightOffset(),
    };
    timeScale.setBarSpacing(this._rightOffsetAndBarSpacing.barSpacing);
    timeScale.setRightOffset(this._rightOffsetAndBarSpacing.rightOffset);
    this._model.lightUpdate();
  }

  redo() {
    if (this._newRightOffsetAndBarSpacing === null) {
      logger.logDebug("TimeScaleChangeUndoCommand.redo: Command is not undone");
      return;
    }

    const timeScale = this._model.timeScale();
    timeScale.setBarSpacing(this._newRightOffsetAndBarSpacing.barSpacing);
    timeScale.setRightOffset(this._newRightOffsetAndBarSpacing.rightOffset);
    this._model.lightUpdate();
    this._newRightOffsetAndBarSpacing = null;
  }
}

export { TimeScaleChangeUndoCommand };
