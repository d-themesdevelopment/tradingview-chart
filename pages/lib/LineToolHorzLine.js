
const { LineDataSource } = require('13087');
const { LineToolHorzLinePriceAxisView } = require('46927');
const { DefaultProperty } = require('46100');
const { bind } = require('59452');

class LineToolHorzLine extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolHorzLine.createProperties(), s, r);
    this._priceAxisView = new LineToolHorzLinePriceAxisView(this);
    
    Promise.resolve().then(bind(null, 74660)).then(({ HorzLinePaneView: e }) => {
      this._setPaneViews([new e(this, this._model)]);
    });
  }
  
  state(e) {
    const t = super.state(e);
    if (t.points && t.points.length !== 0) {
      t.points[0].offset = 0;
    }
    return t;
  }
  
  pointsCount() {
    return 1;
  }
  
  name() {
    return 'Horizontal Line';
  }
  
  priceAxisViews(e, t) {
    if (
      this.isSourceHidden() ||
      t !== this.priceScale() ||
      (!this._model.selection().isSelected(this) && !this.properties().childs().showPrice.value()) ||
      e !== this._model.paneForSource(this)
    ) {
      return null;
    }
    return [this._priceAxisView];
  }
  
  timeAxisViews() {
    return null;
  }
  
  timeAxisPoints() {
    return [];
  }
  
  updateAllViews(e) {
    super.updateAllViews(e);
    this._priceAxisView.update(e);
  }
  
  canHasAlert() {
    return true;
  }
  
  template() {
    const e = super.template();
    e.text = this.properties().childs().text.value();
    return e;
  }
  
  denormalizeTimePoints() {
    this._points = [];
    if (this._timePoint.length > 0) {
      this._points.push({
        price: this._timePoint[0].price,
        index: 0,
      });
    }
  }
  
  clearData() {
    const e = this._points;
    super.clearData();
    this._points = e;
  }
  
  static createProperties(e) {
    const t = new DefaultProperty('linetoolhorzline', e);
    this._configureProperties(t);
    return t;
  }
  
  _getAlertPlots() {
    return [this.points()[0].price];
  }
  
  _pointsForPointset() {
    return [];
  }
  
  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      require.e(7201),
      require.e(3753),
      require.e(5871),
      require.e(8167),
      require.e(8537),
    ]).then(bind(null, 55252)).then(({ HorizontalLineDefinitionsViewModel: e }) => e);
  }
  
  _applyTemplateImpl(e) {
    super._applyTemplateImpl(e);
    this.properties().childs().text.setValue(e.text || '');
  }
  
  static _configureProperties(e) {
    super._configureProperties(e);
    if (!e.hasChild('text')) {
      e.addChild('text', new (require.n(59452))(''));
    }
    e.addExclusion('text');
  }
}

module.exports = {
  LineToolHorzLine,
};

