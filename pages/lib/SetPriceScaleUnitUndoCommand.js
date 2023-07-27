import {
    UndoCommand
  } from '<path_to_UndoCommand_module>';
  
  class SetPriceScaleUnitUndoCommand extends UndoCommand {
    constructor(sourceList, unit, chartWidget, id) {
      super(id);
      this._newSourcesUnits = new Map();
      this._oldSourcesUnits = new Map();
      this._showFade = false;
      this._chartWidget = chartWidget;
  
      const mainSeries = chartWidget.model().mainSeries();
  
      for (const source of sourceList.seriesLikeSources()) {
        if (!source.isVisible() || !source.isActingAsSymbolSource().value()) {
          continue;
        }
  
        const originalUnit = unit || symbolOriginalUnit(ensureNotNull(source.symbolInfo()), this._chartWidget.model().model().unitConversionEnabled());
        this._newSourcesUnits.set(source.id(), originalUnit);
        this._oldSourcesUnits.set(source.id(), source.unit());
        this._showFade = this._showFade || (source === mainSeries && source.unit() !== originalUnit);
      }
    }
  
    redo() {
      this._applyUnits(this._newSourcesUnits);
    }
  
    undo() {
      this._applyUnits(this._oldSourcesUnits);
    }
  
    _applyUnits(sourceUnits) {
      const model = this._chartWidget.model().model();
  
      sourceUnits.forEach((unit, id) => {
        ensureNotNull(model.dataSourceForId(id)).setUnit(unit);
      });
  
      this._chartWidget.model().selectionMacro(e => {
        e.clearSelection();
      });
  
      if (this._showFade) {
        this._chartWidget.screen.show(true);
      }
    }
  }
  
  