import { ensureDefined } from 'utility-module';
import { LineDataSource, LineToolVertLineTimeAxisView } from 'line-tool-module';
import { Point } from 'point-module';
import { DefaultProperty } from 'property-module';

class LineToolVertLine extends LineDataSource {
  constructor(model, options, chartWidget, id) {
    const properties = options || LineToolVertLine.createProperties();
    super(model, properties, chartWidget, id);
    this._timeAxisView = new LineToolVertLineTimeAxisView(this);
    this._paneViewFactory = null;
    properties.childs().extendLine.subscribe(this, () => model.lightUpdate());
    import(1583)
      .then((module) => module(77444))
      .then((VertLinePaneView) => {
        this._paneViewFactory = (pane) => new VertLinePaneView(this, model, pane);
        this._model.lightUpdate();
      });
  }

  destroy() {
    this.properties().childs().extendLine.unsubscribeAll(this);
    super.destroy();
  }

  pointsCount() {
    return 1;
  }

  name() {
    return 'Vertical Line';
  }

  timeAxisViews() {
    return this.isSourceHidden() ? null : (this.properties().childs().showTime.value() ? [this._timeAxisView] : null);
  }

  updateAllViews(fullUpdate) {
    super.updateAllViews(fullUpdate);
    this._timeAxisView.update(fullUpdate);
  }

  canHasAlert() {
    return true;
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  isMultiPaneAvailable() {
    return true;
  }

  isMultiPaneEnabled() {
    return this.properties().childs().extendLine.value();
  }

  paneViews(pane) {
    pane = ensureDefined(pane);
    if (!this.isMultiPaneEnabled() || this._model.paneForSource(this) === pane) {
      if (this._getPaneViews(pane) === null && this._paneViewFactory !== null) {
        this._setPaneViews([this._paneViewFactory(pane)], pane, true);
      }
      return super.paneViews(pane);
    }
    return null;
  }

  priceAxisViews() {
    return null;
  }

  priceAxisPoints() {
    return [];
  }

  pointToScreenPoint(point) {
    const timeScale = this._model.timeScale();
    if (timeScale.isEmpty()) {
      return null;
    }
    const x = timeScale.indexToCoordinate(point.index);
    return new Point(x, 0);
  }

  convertYCoordinateToPriceForMoving(y) {
    return 0;
  }

  static createProperties(options) {
    if (options !== null) {
      if (options.textOrientation === undefined) {
        options.textOrientation = 'horizontal';
      }
      if (options.extendLine === undefined) {
        options.extendLine = false;
      }
    }
    const properties = new DefaultProperty('linetoolvertline', options);
    this._configureProperties(properties);
    return properties;
  }

  _getAlertPlots() {
    const point = this._points[0];
    const nextPoint = {
      index: point.index,
      price: point.price + 1
    };
    const plot = this._linePointsToAlertPlot([point, nextPoint], null, true, true);
    return plot === null ? [] : [plot];
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537)
    ]).then((module) => module(71472))
      .then((ViewModel) => ViewModel.VerticalLineDefinitionsViewModel);
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties().childs().text.setValue(template.text || '');
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild('text')) {
      properties.addChild('text', new String(''));
    }
    properties.addExclusion('text');
  }
}

export { LineToolVertLine };