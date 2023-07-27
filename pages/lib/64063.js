import { OverlayLegendValuesProvider } from 'overlay-legend-values-provider-module';
import { OverlayStatusProvider } from 'overlay-status-provider-module';
import { StudyOverlayBase } from 'study-overlay-base-module';

class StudyOverlay extends StudyOverlayBase {
  constructor(model, inputs, options, priceData) {
    super(model, inputs, options, priceData);
    this._paneView = null;

    const self = this;
    this.properties().minTick.listeners().subscribe(null, function () {
      self._recreatePriceFormattingDependencies();
      self.updateAllViews();
      self._model.fullUpdate();
    });
  }

  _showLastValueOnPriceScale() {
    return this._model.properties().scalesProperties.showSeriesLastValue.value();
  }

  _onQuotesUpdate(symbol, values) {
    if (this._legendView && (values.change !== undefined || values.change_percent !== undefined)) {
      this._legendView.update();
      this._model.updateSource(this);
    }
  }

  destroy() {
    this._quotesProvider.quotesUpdate().unsubscribeAll(this);
    this._quotesProvider.destroy();
    super.destroy();
  }

  tags() {
    const tags = [];
    const symbolInfo = this.symbolInfo();
    if (symbolInfo) {
      tags.push(symbolInfo.name);
    } else if (this._properties.inputs.symbol.value()) {
      tags.push(this._properties.inputs.symbol.value());
    }
    return tags;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const StudyOverlayDefinitionsViewModel = await Promise.all([
      import(/* webpackChunkName: "chunk-studyOverlay-1" */ 'study-overlay-module1'),
      import(/* webpackChunkName: "chunk-studyOverlay-2" */ 'study-overlay-module2'),
      import(/* webpackChunkName: "chunk-studyOverlay-3" */ 'study-overlay-module3'),
      import(/* webpackChunkName: "chunk-studyOverlay-4" */ 'study-overlay-module4'),
      import(/* webpackChunkName: "chunk-studyOverlay-5" */ 'study-overlay-module5'),
      import(/* webpackChunkName: "chunk-studyOverlay-6" */ 'study-overlay-module6')
    ]).then((modules) => modules[0].StudyOverlayDefinitionsViewModel);

    return StudyOverlayDefinitionsViewModel;
  }

  defaultPlotIdForAlert() {
    return '';
  }

  valuesProvider() {
    return new OverlayLegendValuesProvider(this, this.model());
  }

  statusProvider(overlayModel) {
    return new OverlayStatusProvider(this, this.model());
  }
}

export { StudyOverlay };
