

export class ChartChangesWatcher {
    constructor(chartWidgetCollection, undoHistory, chartSaver, globalEvents) {
      this._undoHistoryHasChanges = false;
      this._changesMask = 0;
      this._recursiveLoopingGuard = false;
      this._handleMetainfoChanged = () => {
        this._changesMask = 1 | this._changesMask;
      };
      this._recalculateHaveChanges = (e, t) => {
        if (!this._recursiveLoopingGuard) {
          try {
            this._recursiveLoopingGuard = true;
            const e = this._undoHistoryHasChanges ? 1 : 0;
            let i = this._lineToolsHaveChanges.value() ? 2 : 0;
            const s = this._changesMask;
            this._changesMask = e | i;
            if (s !== this._changesMask) {
              this._changesMask && (
                this._chartWidgetCollection.getAll().forEach(e => {
                  const i = e.lineToolsSynchronizer();
                  if (i) {
                    i.markAsValidatedBecuaseOfSavingToContent(!!t);
                  }
                })
              );
              i = this._lineToolsHaveChanges.value() ? 2 : 0;
              this._changesMask = e | i;
            }
            this._onValueChanged.fire(this._changesMask !== 0);
          } finally {
            this._recursiveLoopingGuard = false;
          }
        }
      };
      this._chartWidgetCollection = chartWidgetCollection;
      this._undoHistory = undoHistory;
      this._lineToolsHaveChanges = chartWidgetCollection.lineToolsSynchronizerHasChanges;
      this._chartSaver = chartSaver;
      this._globalEvents = globalEvents;
      this._onValueChanged = new Event();
      this._subscribe();
    }
  
    destroy() {
      this._unsubscribe();
      this._onValueChanged.destroy();
    }
  
    changes() {
      return this._changesMask;
    }
  
    hasChanges() {
      return this._changesMask > 0;
    }
  
    getOnChange() {
      return this._onValueChanged;
    }
  
    _subscribe() {
      this._globalEvents.subscribe("chart_loaded", this._handleChartLoaded, this);
      this._globalEvents.subscribe("chart_migrated", this._handleChartMigrated, this);
      this._undoHistory.undoStack().onChange().subscribe(this, this._handleUndoHistoryChange);
      this._chartSaver.chartSaved().subscribe(this, this._handleChartSaved);
      this._lineToolsHaveChanges.subscribe(this._recalculateHaveChanges);
      this._chartWidgetCollection.metaInfo.name.subscribe(this._handleMetainfoChanged);
    }
  
    _unsubscribe() {
      this._globalEvents.unsubscribe("chart_loaded", this._handleChartLoaded, this);
      this._globalEvents.unsubscribe("chart_migrated", this._handleChartMigrated, this);
      this._undoHistory.undoStack().onChange().unsubscribe(this, this._handleUndoHistoryChange);
      this._chartSaver.chartSaved().unsubscribe(this, this._handleChartSaved);
      this._lineToolsHaveChanges.unsubscribe(this._recalculateHaveChanges);
      this._chartWidgetCollection.metaInfo.name.unsubscribe(this._handleMetainfoChanged);
    }
  
    _setUndoHistoryHasChanges(hasChanges, saveToContent) {
      this._undoHistoryHasChanges = hasChanges;
      this._recalculateHaveChanges(hasChanges, saveToContent);
    }
  
    _handleChartLoaded() {
      this._setUndoHistoryHasChanges(false);
    }
  
    _handleUndoHistoryChange(change) {
      if (change && !change.customFlag("doesnt_affect_save")) {
        this._setUndoHistoryHasChanges(true);
      }
    }
  
    _handleChartMigrated() {
      this._setUndoHistoryHasChanges(true);
    }
  
    _handleChartSaved(saved) {
      if (saved) {
        this._setUndoHistoryHasChanges(false, true);
      }
    }
  }
  
  export const changedAll = 3;
  