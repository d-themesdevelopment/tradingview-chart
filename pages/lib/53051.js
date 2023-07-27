import { ensureNotNull } from 'ensure-module';
import { UndoCommand } from 'undo-command-module';
import { createPriceScaleSelectionStrategy } from 'price-scale-selection-strategy-module';

class PriceScaleRestorer {
  constructor(chartModel) {
    this._leftScales = chartModel.leftPriceScales().map(scale => scale.id());
    this._rightScales = chartModel.rightPriceScales().map(scale => scale.id());
  }

  restorePane(pane) {
    this._leftScales.reverse().map(id => ensureNotNull(pane.getPriceScaleById(id))).forEach(scale => pane.movePriceScale(scale, 'left'));
    this._rightScales.reverse().map(id => ensureNotNull(pane.getPriceScaleById(id))).forEach(scale => pane.movePriceScale(scale, 'right'));
  }
}

class SetPriceScaleSelectionStrategyCommand extends UndoCommand {
  constructor(chartModel, strategy, options) {
    super(options);
    this._chartModel = chartModel;
    this._targetStrategy = createPriceScaleSelectionStrategy(strategy);
    this._initialState = chartModel.panes().map(pane => new PriceScaleRestorer(pane));
  }

  redo() {
    this._chartModel.panes().forEach(pane => pane.setPriceScaleSelectionStrategy(this._targetStrategy));
    this._chartModel.fullUpdate();
  }

  undo() {
    const panes = this._chartModel.panes();
    for (let i = 0; i < panes.length; i++) {
      this._initialState[i].restorePane(panes[i]);
    }
    this._chartModel.fullUpdate();
  }
}

export { SetPriceScaleSelectionStrategyCommand as SetPriceScaleSelectionStrategyCommand };