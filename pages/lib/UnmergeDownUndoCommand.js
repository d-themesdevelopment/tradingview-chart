
import { ensureNotNull } from '<path_to_ensureNotNull_module>';
import { MoveSourceUndoCommand } from '<path_to_MoveSourceUndoCommand_module>';

export class UnmergeDownUndoCommand extends MoveSourceUndoCommand {
  constructor(sourceId, targetPaneIndex) {
    super(sourceId, targetPaneIndex);
  }

  redo() {
    const dataSource = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    const sourcePane = ensureNotNull(this._chartModel.paneForSource(dataSource));
    const children = this._chartModel.children(dataSource, true);
    
    sourcePane.bulkActionMacro(() => {
      children.forEach((child) => this._chartModel.detachSource(child));
      this._chartModel.detachSource(dataSource);
    });

    const targetPane = this._chartModel.createPane(this.targetPaneIndex());
    const targetPriceScale = targetPane.findSuitableScale(dataSource);

    targetPane.bulkActionMacro(() => {
      targetPane.addDataSource(dataSource, targetPriceScale, false);
      children.forEach((child) => targetPane.addDataSource(child, targetPriceScale, false));
    });

    const priceScale = ensureNotNull(dataSource.priceScale());
    priceScale.restoreState(this._newPriceScaleState(targetPane.isOverlay(dataSource)));
    priceScale.setHeight(targetPane.height());

    this._chartModel.fullUpdate();
    this._chartModel.setShouldBeSavedEvenIfHidden(true);
  }

  undo() {
    const dataSource = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    const sourcePane = ensureNotNull(this._chartModel.paneForSource(dataSource));
    const children = this._chartModel.children(dataSource, true);

    sourcePane.bulkActionMacro(() => {
      children.forEach((child) => this._chartModel.detachSource(child));
      const detached = this._chartModel.detachSource(dataSource);
      ensureNotNull(detached, "Undo of detaching must remove pane");
    });

    const initialPane = this._chartModel.panes()[this._initialPaneIndex];
    let initialPriceScale = initialPane.getPriceScaleById(this._initialPriceScaleId);
    if (initialPriceScale === null) {
      initialPriceScale = initialPane.createPriceScaleAtPosition(
        this._initialPriceScalePosition,
        this._initialPriceScaleIndex
      );
    }

    initialPane.bulkActionMacro(() => {
      initialPane.addDataSource(dataSource, initialPriceScale, true);
      children.forEach((child) => initialPane.addDataSource(child, initialPriceScale, false));
    });

    const priceScale = ensureNotNull(dataSource.priceScale());
    priceScale.restoreState(this._originalPriceScaleState());
    priceScale.setHeight(initialPane.height());

    this._chartModel.fullUpdate();
  }
}

export class UnmergeToNewBottomPane extends MoveSourceUndoCommand {
  constructor(sourceId) {
    super(sourceId, this._chartModel.panes().length);
  }
}

export class UnmergeUpUndoCommand extends MoveSourceUndoCommand {
  constructor(sourceId, targetPaneIndex) {
    super(sourceId, targetPaneIndex);
  }
}
