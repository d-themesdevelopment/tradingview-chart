

import { ensureNotNull } from 50151;
import { UndoCommand } from 62591;

class MoveSourceUndoCommand extends UndoCommand {
  constructor(chartModel, source, id) {
    super(id);
    this._chartModel = chartModel;
    this._sourceId = source.id();
    const priceScale = ensureNotNull(source.priceScale());
    this._initialPriceScaleId = priceScale.id();
    this._initialPriceScaleState = ensureNotNull(source.priceScale()).state();
    const pane = ensureNotNull(chartModel.paneForSource(source));
    this._initialPriceScalePosition = pane.priceScalePosition(priceScale);
    this._initialPriceScaleIndex = pane.priceScaleIndex(priceScale, this._initialPriceScalePosition);
    this._initialPaneIndex = chartModel.panes().indexOf(pane);
  }

  _newPriceScaleState() {
    const newPriceScaleState = { ...this._initialPriceScaleState };
    delete newPriceScaleState.m_isLockScale;
    delete newPriceScaleState.id;
    delete newPriceScaleState.m_topMargin;
    delete newPriceScaleState.m_bottomMargin;
    return newPriceScaleState;
  }

  _originalPriceScaleState() {
    return this._initialPriceScaleState;
  }
}

export { MoveSourceUndoCommand };