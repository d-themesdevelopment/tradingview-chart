utils.SetPriceScaleCurrencyUndoCommand = (e, t, i, r) => {
    const { UndoCommand } = i(62591);
    const { ensureNotNull } = i(50151);
    const { symbolOriginalCurrency } = i(42960);
  
    class SetPriceScaleCurrencyUndoCommand extends UndoCommand {
      constructor(e, t, i, r) {
        super(r);
        this._newSourcesCurrencies = new Map();
        this._oldSourcesCurrencies = new Map();
        this._showFade = false;
        this._chartWidget = i;
  
        const mainSeries = i.model().mainSeries();
  
        for (const series of e.seriesLikeSources()) {
          if (!series.isVisible() || !series.isActingAsSymbolSource().value()) continue;
          const currency = t || ensureNotNull(symbolOriginalCurrency(ensureNotNull(series.symbolInfo())));
          this._newSourcesCurrencies.set(series.id(), currency);
          this._oldSourcesCurrencies.set(series.id(), series.currency());
          this._showFade = this._showFade || (series === mainSeries && series.currency() !== currency);
        }
      }
  
      redo() {
        this._applyCurrencies(this._newSourcesCurrencies);
      }
  
      undo() {
        this._applyCurrencies(this._oldSourcesCurrencies);
      }
  
      _applyCurrencies(currencies) {
        const chartModel = this._chartWidget.model().model();
        currencies.forEach((currency, id) => {
          ensureNotNull(chartModel.dataSourceForId(id)).setCurrency(currency);
        });
  
        this._chartWidget.model().selectionMacro((selection) => {
          selection.clearSelection();
        });
  
        if (this._showFade) {
          this._chartWidget.screen.show(true);
        }
      }
    }
  
    return SetPriceScaleCurrencyUndoCommand;
  };
  
  module.exports = utils;