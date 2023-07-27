

import { ensureNotNull } from '<path_to_ensureNotNull_module>';
import { MoveSourceUndoCommand } from '<path_to_MoveSourceUndoCommand_module>';

export class MoveToExistingPriceScaleUndoCommand extends MoveSourceUndoCommand {
  constructor(chartModel, sourceId, initialPaneIndex, targetPaneIndex) {
    super(chartModel, sourceId, targetPaneIndex);
    this._sourcePaneRemoved = false;
    this._targetPaneIndex = chartModel.panes().indexOf(initialPaneIndex);
  }

  redo() {
    const sourcePane = this._chartModel.panes()[this._initialPaneIndex];
    const targetPane = this._chartModel.panes()[this._targetPaneIndex];
    const moveBetweenPanes = sourcePane !== targetPane;
    const targetPriceScale = this._targetPriceScale(targetPane);
    const dataSource = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    const childSources = this._chartModel.children(dataSource, true);

    for (const child of childSources) {
      if (moveBetweenPanes) {
        this._chartModel.detachSource(child);
        targetPane.addDataSource(child, targetPriceScale, false);
      } else {
        targetPane.move(child, targetPriceScale);
      }
    }

    if (moveBetweenPanes) {
      this._sourcePaneRemoved = this._chartModel.detachSource(dataSource);
      targetPane.addDataSource(dataSource, targetPriceScale, false);
    } else {
      targetPane.move(dataSource, targetPriceScale);
    }

    const targetPriceScalePosition = targetPane.priceScalePosition(targetPriceScale);
    targetPane.movePriceScale(targetPriceScale, targetPriceScalePosition, this._targetPriceScaleIndex(dataSource));
    this._chartModel.fullUpdate();
  }

  undo() {
    if (this._sourcePaneRemoved) {
      this._chartModel.createPane(this._initialPaneIndex);
    }

    const sourcePane = this._chartModel.panes()[this._initialPaneIndex];
    const moveBetweenPanes = sourcePane !== this._chartModel.panes()[this._targetPaneIndex];
    const dataSource = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    let initialPriceScale = sourcePane.getPriceScaleById(this._initialPriceScaleId);

    if (initialPriceScale === null) {
      initialPriceScale = sourcePane.createPriceScaleAtPosition(this._initialPriceScalePosition, this._initialPriceScaleIndex);
    }

    const childSources = this._chartModel.children(dataSource, true);

    for (const child of childSources) {
      if (moveBetweenPanes) {
        this._chartModel.detachSource(child);
        sourcePane.addDataSource(child, initialPriceScale, false);
      } else {
        sourcePane.move(child, initialPriceScale);
      }
    }

    if (moveBetweenPanes) {
      this._chartModel.detachSource(dataSource);
      sourcePane.addDataSource(dataSource, initialPriceScale, false);
    } else {
      sourcePane.move(dataSource, initialPriceScale);
    }

    const initialPriceScaleInstance = ensureNotNull(dataSource.priceScale());
    initialPriceScaleInstance.restoreState(this._originalPriceScaleState());
    initialPriceScaleInstance.setHeight(sourcePane.height());
    this._chartModel.fullUpdate();
  }
}

export class MoveToNewPriceScaleUndoCommand extends MoveToExistingPriceScaleUndoCommand {
  constructor(chartModel, sourceId, initialPaneIndex, targetPaneIndex, targetPriceScalePosition) {
    super(chartModel, sourceId, initialPaneIndex, targetPaneIndex);
    this._targetPriceScalePosition = targetPriceScalePosition;
  }

  _targetPriceScale(targetPane) {
    const newPriceScale = targetPane.createPriceScaleAtPosition(this._targetPriceScalePosition);
    newPriceScale.restoreState(this._newPriceScaleState("overlay" === this._targetPriceScalePosition));
    newPriceScale.setHeight(targetPane.height());
    return newPriceScale;
  }

  _targetPriceScaleIndex(targetPane) {
    return targetPane === this._chartModel.mainSeries() ? 0 : undefined;
  }
}

export class MoveToExistingPriceScaleUndoCommand extends MoveSourceUndoCommand {
  constructor(chartModel, sourceId, initialPaneIndex, targetPaneIndex, targetPriceScaleId) {
    super(chartModel, sourceId);
    this._targetPriceScaleId = targetPriceScaleId;
  }

  _targetPriceScale(targetPane) {
    return ensureNotNull(targetPane.getPriceScaleById(this._targetPriceScaleId));
  }

  _targetPriceScaleIndex(targetPane) {
    // Do nothing
  }
}
