import { DefaultProperty } from 'properties';
import { LineDataSource } from 'lineDataSource';
import { LineToolPriceAxisView } from 'lineToolPriceAxisView';
import { TrendLineDefinitionsViewModel } from 'trendLineDefinitionsViewModel';

class TrendLineTool extends LineDataSource {
  constructor(chartModel, priceScale, timeScale, properties) {
    super(chartModel, properties || TrendLineTool.createProperties(), priceScale, timeScale);
    this._trendLinePaneView = null;

    import(96310).then(({ TrendLinePaneView }) => {
      this._trendLinePaneView = new TrendLinePaneView(this, this._model);
      this._setPaneViews([this._trendLinePaneView]);
    });
  }

  dataAndViewsReady() {
    return super.dataAndViewsReady() && this._trendLinePaneView !== null && this._trendLinePaneView.iconsReady();
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Trend Line";
  }

  canHasAlert() {
    return true;
  }

  showPriceLabels() {
    return this._properties.childs().showPriceLabels.value();
  }

  createPriceAxisView(index) {
    return new LineToolPriceAxisView(this, {
      pointIndex: index,
      backgroundPropertyGetter: () => this.showPriceLabels() ? this._properties.childs().linecolor.value() : null
    });
  }

  isForcedDrawPriceAxisLabel() {
    return this.showPriceLabels();
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  static createProperties(options, name) {
    if (options && options.showPercentPriceRange === undefined) {
      options.showPercentPriceRange = options.showPriceRange;
      options.showPipsPriceRange = options.showPriceRange;
    }

    const properties = new DefaultProperty(name !== undefined ? name : 'linetooltrendline', options);
    this._configureProperties(properties);
    return properties;
  }

  _getAlertPlots() {
    const alertPlot = this._linePointsToAlertPlot(
      this._points,
      null,
      this._properties.childs().extendLeft.value(),
      this._properties.childs().extendRight.value()
    );

    return alertPlot === null ? [] : [alertPlot];
  }

  async _getPropertyDefinitionsViewModelClass() {
    const [module1, module2, module3, module4, module5] = await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537)
    ]);
    return module1.TrendLineDefinitionsViewModel;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text || '');
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild('text')) {
      properties.addChild('text', new TextProperty(''));
    }
    properties.addExclusion('text');
  }
}

export { TrendLineTool as LineToolTrendLine };