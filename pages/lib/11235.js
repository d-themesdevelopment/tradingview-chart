const { ensureNotNull } = require("./assertions");
const { MoveSourceUndoCommand } = require("./MoveSourceUndoCommand");

class MergeDownUndoCommand extends MoveSourceUndoCommand {
  constructor(e, t, i, s) {
    super(e, t, i);
    this._restorePane = false;
    this._keepZOrder = s != null && s;
  }

  redo() {
    const e = this._chartModel.panes().length;
    const t = this._chartModel.panes()[this._targetPaneIndex()];
    const i = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    const r = ensureNotNull(this._chartModel.paneForSource(i));
    const n = this._chartModel.children(i, true);

    r.bulkActionMacro(() => {
      n.forEach((e) => this._chartModel.detachSource(e));
      this._restorePane = this._chartModel.detachSource(i);
    });

    const o =
      this._initialPriceScalePosition === "overlay"
        ? this._initialPriceScalePosition
        : undefined;
    const a = t.findSuitableScale(i, undefined, o);
    const l = a.dataSources().length === 0;

    t.bulkActionMacro(() => {
      t.addDataSource(i, a, this._keepZOrder);
      n.forEach((e) => t.addDataSource(e, a, this._keepZOrder));
    });

    if (i === this._chartModel.mainSeries()) {
      const e = t.priceScalePosition(a);
      t.movePriceScale(a, e, 0);
    }

    if (l) {
      const e = ensureNotNull(i.priceScale());
      e.restoreState(this._newPriceScaleState(t.isOverlay(i)));
      e.setHeight(t.height());
    }

    this._chartModel.fullUpdate();

    if (e !== this._chartModel.panes().length) {
      this._chartModel.setShouldBeSavedEvenIfHidden(true);
    }
  }

  undo() {
    let e;
    if (this._restorePane) {
      e = this._chartModel.createPane(this._initialPaneIndex);
    } else {
      e = this._chartModel.panes()[this._initialPaneIndex];
    }

    const t = ensureNotNull(this._chartModel.dataSourceForId(this._sourceId));
    const i = ensureNotNull(this._chartModel.paneForSource(t));
    const r = this._chartModel.children(t, true);

    i.bulkActionMacro(() => {
      r.forEach((e) => this._chartModel.detachSource(e));
      this._chartModel.detachSource(t);
    });

    let n = e.getPriceScaleById(this._initialPriceScaleId);
    if (n === null) {
      n = e.createPriceScaleAtPosition(
        this._initialPriceScalePosition,
        this._initialPriceScaleIndex
      );
    }

    e.bulkActionMacro(() => {
      e.addDataSource(t, n, true);
      r.forEach((t) => e.addDataSource(t, n, false));
    });

    const o = ensureNotNull(t.priceScale());
    o.restoreState(this._originalPriceScaleState());
    o.setHeight(e.height());

    this._chartModel.fullUpdate();
  }
}

class MergeUpUndoCommand extends MoveSourceUndoCommand {
  constructor(e, t, i) {
    super(e, t, i);
  }

  _targetPaneIndex() {
    return this._initialPaneIndex - 1;
  }
}

class MergeToTargetPane extends MoveSourceUndoCommand {
  constructor(e, t, i, s, r) {
    super(e, t, s, r);
    this._targetPane = i;
  }

  _targetPaneIndex() {
    return this._targetPane;
  }
}

export { MergeDownUndoCommand, MergeToTargetPane, MergeUpUndoCommand };
