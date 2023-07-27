import { getLogger } from 'utils/logger';
import { TranslatedString } from 'utils/translations';
import { UndoCommand } from 'commands';
import { ensureNotNull } from 'util/assertions';

const logger = getLogger("Chart.ChartUndoModel");
const scalePriceString = new TranslatedString("scale price", t(null, void 0, i(47222)));

class PriceScaleChangeUndoCommand extends UndoCommand {
  constructor(model, pane, priceScale, state, timestamp) {
    super(scalePriceString, false);
    this._newPriceScaleState = null;
    this._model = model;
    this._paneIndex = model.panes().indexOf(pane);
    this._priceScaleId = priceScale.id();
    this._state = state;
    this._timestamp = timestamp ? performance.now() : null;
  }

  undo() {
    if (this._newPriceScaleState !== null) {
      logger.logDebug("PriceScaleChangeUndoCommand.undo: Command is already undone");
      return;
    }

    const [pane, scale] = this._getPaneAndScale();
    this._newPriceScaleState = scale.state();
    this._model.restorePriceScaleState(pane, scale, this._state);
  }

  redo() {
    if (this._newPriceScaleState === null) {
      logger.logDebug("PriceScaleChangeUndoCommand.redo: Command is not undone");
      return;
    }

    const [pane, scale] = this._getPaneAndScale();
    this._model.restorePriceScaleState(pane, scale, this._newPriceScaleState);
    this._newPriceScaleState = null;
  }

  canMerge(command) {
    return (
      command instanceof PriceScaleChangeUndoCommand &&
      this._timestamp !== null &&
      command._timestamp !== null &&
      this._newPriceScaleState === null &&
      command._model === this._model &&
      command._paneIndex === this._paneIndex &&
      command._priceScaleId === this._priceScaleId &&
      Math.abs(command._timestamp - this._timestamp) < 1000
    );
  }

  merge(command) {
    this._timestamp = command._timestamp;
  }

  _getPaneAndScale() {
    const pane = this._model.panes()[this._paneIndex];
    const scale = ensureNotNull(pane.getPriceScaleById(this._priceScaleId));
    return [pane, scale];
  }
}

export { PriceScaleChangeUndoCommand };