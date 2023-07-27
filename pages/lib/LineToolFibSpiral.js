
const { LineDataSource } = require('13087');
const { DefaultProperty } = require('46100');

class LineToolFibSpiral extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolFibSpiral.createProperties(), s, r);
    require.ensure([], function (require) {
      const { FibSpiralPaneView } = require(47056);
      this._setPaneViews([new FibSpiralPaneView(this, this._model)]);
    }.bind(this), '1583');
  }
  
  pointsCount() {
    return 2;
  }
  
  name() {
    return 'Fib Spiral';
  }
  
  async _getPropertyDefinitionsViewModelClass() {
    const { FibSpiralDefinitionsViewModel } = await Promise.all([
      require.ensure([], function (require) { return require(7201); }, '7201'),
      require.ensure([], function (require) { return require(3753); }, '3753'),
      require.ensure([], function (require) { return require(5871); }, '5871'),
      require.ensure([], function (require) { return require(8167); }, '8167'),
      require.ensure([], function (require) { return require(8537); }, '8537'),
    ]).then(require.bind(null, 90448));
    
    return FibSpiralDefinitionsViewModel;
  }
  
  static createProperties(e) {
    const t = new DefaultProperty('linetoolfibspiral', e);
    this._configureProperties(t);
    return t;
  }
}

module.exports = {
  LineToolFibSpiral,
};